package com.techforbetter.smartwaste.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZoneWasteDto {
    private Long zoneId;
    private String zoneName;
    private Double totalWasteKg;
    private Boolean isFlagged;
}
