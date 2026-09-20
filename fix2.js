const fs = require('fs');
const path = require('path');

const backendSrc = path.join(__dirname, 'backend', 'src', 'main', 'java', 'com', 'techforbetter', 'smartwaste');

// 1. Fix JwtUtil.java
const jwtUtilPath = path.join(backendSrc, 'security', 'JwtUtil.java');
if (fs.existsSync(jwtUtilPath)) {
    let content = fs.readFileSync(jwtUtilPath, 'utf8');
    if (!content.includes('generateToken(String username)')) {
        content = content.replace('public String generateToken(UserDetails userDetails) {', `public String generateToken(String username) {
        return createToken(new HashMap<>(), username);
    }
    
    public String generateToken(UserDetails userDetails) {`);
        fs.writeFileSync(jwtUtilPath, content);
    }
}

// 2. Fix WasteLogService.java
const wasteLogServicePath = path.join(backendSrc, 'service', 'WasteLogService.java');
fs.writeFileSync(wasteLogServicePath, `package com.techforbetter.smartwaste.service;
import com.techforbetter.smartwaste.dto.WasteLogDto;
import com.techforbetter.smartwaste.dto.WasteLogRequest;
import com.techforbetter.smartwaste.entity.User;
import com.techforbetter.smartwaste.entity.WasteLog;
import com.techforbetter.smartwaste.enums.WasteType;
import com.techforbetter.smartwaste.repository.UserRepository;
import com.techforbetter.smartwaste.repository.WasteLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WasteLogService {
    private final WasteLogRepository wasteLogRepository;
    private final UserRepository userRepository;

    public WasteLogDto createLog(String email, WasteLogRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow();
        WasteLog log = WasteLog.builder()
                .user(user)
                .cityZone(user.getCityZone())
                .wasteType(WasteType.valueOf(request.getWasteType().toUpperCase()))
                .quantityKg(request.getQuantityKg())
                .logDate(LocalDateTime.now())
                .build();
        wasteLogRepository.save(log);
        return mapToDto(log);
    }

    public List<WasteLogDto> getMyLogs(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return wasteLogRepository.findByUser_IdOrderByLogDateDesc(user.getId()).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<WasteLogDto> getAllLogs() {
        return wasteLogRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private WasteLogDto mapToDto(WasteLog log) {
        return WasteLogDto.builder()
                .id(log.getId())
                .wasteType(log.getWasteType().name())
                .quantityKg(log.getQuantityKg())
                .logDate(log.getLogDate())
                .cityZone(log.getCityZone() != null ? log.getCityZone().name() : null)
                .build();
    }
}
`);

// 3. Fix AnalyticsController.java
const analyticsControllerPath = path.join(backendSrc, 'controller', 'AnalyticsController.java');
fs.writeFileSync(analyticsControllerPath, `package com.techforbetter.smartwaste.controller;
import com.techforbetter.smartwaste.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @GetMapping("/zone-waste")
    public ResponseEntity<List<Map<String, Object>>> getWasteByZone() {
        return ResponseEntity.ok(analyticsService.getWasteByZone());
    }

    @GetMapping("/type-waste")
    public ResponseEntity<List<Map<String, Object>>> getWasteByType() {
        return ResponseEntity.ok(analyticsService.getWasteByType());
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard() {
        return ResponseEntity.ok(analyticsService.getLeaderboard());
    }
}
`);

console.log('Fixes part 2 applied!');
