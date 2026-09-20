package com.techforbetter.smartwaste.controller;
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
