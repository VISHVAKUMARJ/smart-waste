package com.techforbetter.smartwaste.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDto {
    private Long householdId;
    private String householdName;
    private Double totalWasteKg;
}
