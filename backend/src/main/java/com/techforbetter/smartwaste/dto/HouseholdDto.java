package com.techforbetter.smartwaste.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdDto {
    private Long id;
    private String name;
    private String address;
    private Long zoneId;
    private String zoneName;
}
