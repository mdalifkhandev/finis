import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type CalendarDay = {
  key: string;
  day: number;
  inCurrentMonth: boolean;
  date: Date;
};

type PayrollCalendarCardProps = {
  monthDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildCalendarDays(monthDate: Date): CalendarDay[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const totalCells = Math.ceil((startWeekDay + daysInMonth) / 7) * 7;
  const result: CalendarDay[] = [];

  for (let index = 0; index < totalCells; index += 1) {
    const dayNumber = index - startWeekDay + 1;

    if (dayNumber <= 0) {
      const prevMonthDay = daysInPrevMonth + dayNumber;
      const date = new Date(year, month - 1, prevMonthDay);
      result.push({
        key: `p-${index}`,
        day: prevMonthDay,
        inCurrentMonth: false,
        date,
      });
      continue;
    }

    if (dayNumber > daysInMonth) {
      const nextMonthDay = dayNumber - daysInMonth;
      const date = new Date(year, month + 1, nextMonthDay);
      result.push({
        key: `n-${index}`,
        day: nextMonthDay,
        inCurrentMonth: false,
        date,
      });
      continue;
    }

    const date = new Date(year, month, dayNumber);
    result.push({
      key: `c-${index}`,
      day: dayNumber,
      inCurrentMonth: true,
      date,
    });
  }

  return result;
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function PayrollCalendarCard({
  monthDate,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: PayrollCalendarCardProps) {
  const days = useMemo(() => buildCalendarDays(monthDate), [monthDate]);

  const monthLabel = monthDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <View className="rounded-[16px] border border-[#D8DDE3] bg-white px-3 pb-3 pt-3">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          activeOpacity={0.85}
          className="flex-row items-center"
        >
          <Text
            className="text-[25px] font-semibold text-[#111827]"
            style={{ fontSize: 25 / 2 }}
          >
            {monthLabel}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color="#111827"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>

        <View className="flex-row items-center">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPrevMonth}
            className="px-1 py-1"
          >
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNextMonth}
            className="px-1 py-1"
          >
            <Ionicons name="chevron-forward" size={24} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-5 flex-row justify-between px-1">
        {WEEK_DAYS.map((item) => (
          <Text
            key={item}
            className="w-9 text-center text-[12px] font-medium text-[#1F5577]"
          >
            {item}
          </Text>
        ))}
      </View>

      <View className="mt-2 flex-row flex-wrap justify-between px-1">
        {days.map((item) => {
          const selected =
            item.inCurrentMonth && isSameDate(item.date, selectedDate);

          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.85}
              onPress={() => onSelectDate(item.date)}
              className="h-[48px] w-[14%] items-center justify-center"
            >
              {selected ? (
                <View className="h-[40px] w-[40px] items-center justify-center rounded-full bg-[#1F5577]">
                  <Text className="text-[14px] font-medium text-white">
                    {item.day}
                  </Text>
                </View>
              ) : (
                <Text
                  className="text-[14px] font-medium"
                  style={{ color: item.inCurrentMonth ? "#111827" : "#C5C7CB" }}
                >
                  {item.day}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
