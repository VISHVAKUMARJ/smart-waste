package com.techforbetter.smartwaste.dto;

import com.techforbetter.smartwaste.enums.WasteType;
import lombok.Data;

@Data
public class WasteLogRequest {
    private WasteType wasteType;
    private Double quantityKg;
}
