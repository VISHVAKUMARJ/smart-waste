package com.techforbetter.smartwaste.dto;

import com.techforbetter.smartwaste.enums.WasteType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WasteByTypeDto {
    private WasteType wasteType;
    private Double totalWasteKg;
}
