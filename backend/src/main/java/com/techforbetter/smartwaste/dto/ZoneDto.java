package com.techforbetter.smartwaste.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZoneDto {
    private Long id;
    private String name;
    private String collectionSchedule;
}
