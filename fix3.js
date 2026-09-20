const fs = require('fs');
const path = require('path');

const backendSrc = path.join(__dirname, 'backend', 'src', 'main', 'java', 'com', 'techforbetter', 'smartwaste');

// 1. Rewrite WasteLogDto.java
const wasteLogDtoPath = path.join(backendSrc, 'dto', 'WasteLogDto.java');
fs.writeFileSync(wasteLogDtoPath, `package com.techforbetter.smartwaste.dto;

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
`);

// 2. Fix WasteLogService.java (toUpperCase error)
const wasteLogServicePath = path.join(backendSrc, 'service', 'WasteLogService.java');
let serviceContent = fs.readFileSync(wasteLogServicePath, 'utf8');
serviceContent = serviceContent.replace('WasteType.valueOf(request.getWasteType().toUpperCase())', 'request.getWasteType()');
fs.writeFileSync(wasteLogServicePath, serviceContent);

console.log('Fix 3 applied!');
