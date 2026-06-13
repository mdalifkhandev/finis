import React, { useMemo } from "react";
import DateTimePicker, {
  type DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";
import { View } from "react-native";

type PayrollCalendarCardProps = {
  monthDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onMonthDateChange: (date: Date) => void;
};

function toDate(value: DateType | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;

  const parsed = new Date(value as string | number);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export default function PayrollCalendarCard({
  monthDate,
  selectedDate,
  onSelectDate,
  onMonthDateChange,
}: PayrollCalendarCardProps) {
  const defaultStyles = useDefaultStyles();

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

  return (
    <View className="rounded-[18px] border border-[#D8DDE3] bg-white px-3 py-3">
      <DateTimePicker
        mode="single"
        locale="en"
        date={selectedDate}
        month={monthDate.getMonth()}
        year={monthDate.getFullYear()}
        firstDayOfWeek={0}
        weekdaysFormat="short"
        showOutsideDays
        styles={calendarStyles}
        onChange={({ date }) => {
          const nextDate = toDate(date);
          if (nextDate) {
            onSelectDate(nextDate);
            onMonthDateChange(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
          }
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
