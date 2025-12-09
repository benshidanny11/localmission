package com.rra.local_mission_management.utils;

import java.time.DayOfWeek;
import java.time.LocalDate;

public class MissionUtils {

    // Method to check if a mission crosses over a weekend
    public static boolean crossesWeekend(LocalDate startDate, LocalDate endDate) {
        LocalDate currentDate = startDate;

        // Iterate through each day between startDate and endDate
        while (!currentDate.isAfter(endDate)) {
            // Check if the current date is a Saturday or Sunday
            DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
            if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
                return true; // Weekend day found, so the mission crosses a weekend
            }
            // Move to the next day
            currentDate = currentDate.plusDays(1);
        }

        // No weekend day found
        return false;
    }
}
