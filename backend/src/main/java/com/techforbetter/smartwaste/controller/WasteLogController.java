package com.techforbetter.smartwaste.controller;

import com.techforbetter.smartwaste.dto.WasteLogDto;
import com.techforbetter.smartwaste.dto.WasteLogRequest;
import com.techforbetter.smartwaste.service.WasteLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waste-logs")
@RequiredArgsConstructor
public class WasteLogController {

    private final WasteLogService wasteLogService;

    @PostMapping
    @PreAuthorize("hasRole('HOUSEHOLD')")
    public ResponseEntity<WasteLogDto> createLog(@RequestBody WasteLogRequest request, Authentication authentication) {
        return ResponseEntity.ok(wasteLogService.createLog(authentication.getName(), request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('HOUSEHOLD')")
    public ResponseEntity<List<WasteLogDto>> getMyLogs(Authentication authentication) {
        return ResponseEntity.ok(wasteLogService.getMyLogs(authentication.getName()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<WasteLogDto>> getAllLogs() {
        return ResponseEntity.ok(wasteLogService.getAllLogs());
    }
}
