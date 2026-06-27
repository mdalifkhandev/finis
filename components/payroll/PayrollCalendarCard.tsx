import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import DateTimePicker, {
  type DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";
import { Text, TouchableOpacity, View } from "react-native";

type PayrollCalendarCardProps = {
  monthDate: Date;
  selectedDate: Date;
  periodMode?: PayrollCalendarMode;
  selectedRangeEnd?: Date | null;
  onSelectDate: (date: Date) => void;
  onSelectRangeEnd?: (date: Date | null) => void;
  onMonthDateChange: (date: Date) => void;
  onPeriodModeChange?: (mode: PayrollCalendarMode) => void;
};

export type PayrollCalendarMode =
  | "custom"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "bimonthly";

const PERIOD_OPTIONS: Array<{
  label: string;
  value: PayrollCalendarMode;
}> = [
  { label: "Custom", value: "custom" },
  { label: "Weekly", value: "weekly" },
  { label: "Biweekly", value: "biweekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Bimonthly", value: "bimonthly" },
];

function toDate(value: DateType | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;

  const parsed = new Date(value as string | number);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfWeek(value: Date) {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(value: Date, amount: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(value: Date, amount: number) {
  const next = new Date(value);
  next.setMonth(next.getMonth() + amount);
  return next;
}

function endOfToday() {
  const next = new Date();
  next.setHours(23, 59, 59, 999);
  return next;
}

function endOfWeek(value: Date) {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + 6);
  return next;
}

function startOfBiweekly(value: Date) {
  return startOfWeek(value);
}

function endOfBiweekly(value: Date) {
  return addDays(startOfWeek(value), 13);
}

function endOfBimonthly(value: Date) {
  const next = addMonths(value, 2);
  next.setDate(next.getDate() - 1);
  return next;
}

export default function PayrollCalendarCard({
  monthDate,
  selectedDate,
  periodMode = "custom",
  selectedRangeEnd,
  onSelectDate,
  onSelectRangeEnd,
  onMonthDateChange,
  onPeriodModeChange = () => {},
}: PayrollCalendarCardProps) {
  const defaultStyles = useDefaultStyles();
  const [menuOpen, setMenuOpen] = useState(false);

  const calendarStyles = useMemo(
    () => ({
      ...defaultStyles,
      header: {
        ...defaultStyles.header,
        marginBottom: 18,
        paddingHorizontal: 2,
      },
      month_selector_label: {
        ...defaultStyles.month_selector_label,
        fontSize: 18,
        fontWeight: "700" as const,
        color: "#111827",
      },
      year_selector_label: {
        ...defaultStyles.year_selector_label,
        fontSize: 18,
        fontWeight: "700" as const,
        color: "#111827",
      },
      weekday_label: {
        ...defaultStyles.weekday_label,
        color: "#1F5577",
        fontSize: 13,
        fontWeight: "500" as const,
      },
      day: {
        ...defaultStyles.day,
        width: 42,
        height: 42,
        borderRadius: 21,
      },
      day_label: {
        ...defaultStyles.day_label,
        color: "#111827",
        fontSize: 15,
        fontWeight: "500" as const,
      },
      selected: {
        ...defaultStyles.selected,
        backgroundColor: "#1F5577",
        borderRadius: 21,
      },
      selected_label: {
        ...defaultStyles.selected_label,
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600" as const,
      },
      outside_label: {
        ...defaultStyles.outside_label,
        color: "#D1D5DB",
      },
      button_prev: {
        ...defaultStyles.button_prev,
        paddingHorizontal: 8,
      },
      button_next: {
        ...defaultStyles.button_next,
        paddingHorizontal: 8,
      },
    }),
    [defaultStyles],
  );

  const selectedLabel =
    PERIOD_OPTIONS.find((item) => item.value === periodMode)?.label ?? "Custom";

  const selectedRange =
    periodMode === "custom"
      ? {
          start: selectedDate,
          end: selectedRangeEnd ?? selectedDate,
        }
      : {
          start: selectedDate,
          end:
            periodMode === "weekly"
              ? endOfWeek(selectedDate)
              : periodMode === "biweekly"
                ? endOfBiweekly(selectedDate)
                : periodMode === "monthly"
                  ? (() => {
                      const next = addMonths(selectedDate, 1);
                      next.setDate(next.getDate() - 1);
                      return next;
                    })()
                  : endOfBimonthly(selectedDate),
        };

  return (
    <View className="rounded-[18px] border border-[#D8DDE3] bg-white px-3 py-3">
      <View className="mb-3">
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => setMenuOpen((prev) => !prev)}
          className="h-11 flex-row items-center justify-between rounded-[12px] border border-[#D8DDE3] bg-[#F8FAFC] px-3"
        >
          <Text className="text-[14px] font-medium text-[#111827]">
            {selectedLabel}
          </Text>
          <Ionicons
            name={menuOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color="#475467"
          />
        </TouchableOpacity>

        {menuOpen ? (
          <View className="mt-2 overflow-hidden rounded-[12px] border border-[#D8DDE3] bg-white">
            {PERIOD_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                activeOpacity={0.85}
                onPress={() => {
                  onPeriodModeChange(option.value);
                  onSelectRangeEnd?.(null);
                  setMenuOpen(false);
                }}
                className={`h-11 flex-row items-center px-3 ${
                  option.value === periodMode ? "bg-[#EAF3F8]" : "bg-white"
                }`}
              >
                <Text
                  className={`text-[14px] ${
                    option.value === periodMode
                      ? "font-medium text-[#1F5577]"
                      : "text-[#344054]"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>

      <DateTimePicker
        mode="range"
        locale="en"
        startDate={selectedRange?.start}
        endDate={selectedRange?.end}
        month={monthDate.getMonth()}
        year={monthDate.getFullYear()}
        firstDayOfWeek={0}
        weekdaysFormat="short"
        showOutsideDays
        maxDate={endOfToday()}
        allowRangeReset
        styles={calendarStyles}
        onChange={(payload: any) => {
          const anchor = toDate(payload?.date ?? payload?.startDate ?? payload?.endDate);
          if (!anchor) return;

          if (anchor > endOfToday()) {
            return;
          }

          if (periodMode === "custom") {
            const currentStart = selectedDate;
            const currentEnd = selectedRangeEnd ?? null;

            if (!currentStart) {
              onSelectDate(anchor);
              onSelectRangeEnd?.(null);
            } else if (!currentEnd) {
              if (anchor < currentStart) {
                onSelectDate(anchor);
                onSelectRangeEnd?.(currentStart);
              } else {
                onSelectRangeEnd?.(anchor);
              }
            } else if (anchor <= currentStart) {
              onSelectDate(anchor);
              onSelectRangeEnd?.(currentEnd);
            } else if (anchor >= currentEnd) {
              onSelectRangeEnd?.(anchor);
            } else {
              const startDistance = Math.abs(anchor.getTime() - currentStart.getTime());
              const endDistance = Math.abs(currentEnd.getTime() - anchor.getTime());

              if (startDistance <= endDistance) {
                onSelectDate(anchor);
              } else {
                onSelectRangeEnd?.(anchor);
              }
            }
            onMonthDateChange(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
            return;
          }

          onSelectDate(anchor);
          onSelectRangeEnd?.(null);
          onMonthDateChange(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
        }}
        onMonthChange={(month) => {
          onMonthDateChange(new Date(monthDate.getFullYear(), month, 1));
        }}
        onYearChange={(year) => {
          onMonthDateChange(new Date(year, monthDate.getMonth(), 1));
        }}
      />
    </View>
  );
}
