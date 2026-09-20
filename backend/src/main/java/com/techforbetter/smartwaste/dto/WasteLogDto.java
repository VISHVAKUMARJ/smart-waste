package com.techforbetter.smartwaste.dto;

import com.techforbetter.smartwaste.enums.WasteType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class WasteLogDto {
    private Long id;
    private String wasteType;
    private Double quantityKg;
    private LocalDateTime logDate;
    private String cityZone;
}
