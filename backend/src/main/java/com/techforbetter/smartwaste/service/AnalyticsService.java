package com.techforbetter.smartwaste.service;
import com.techforbetter.smartwaste.repository.WasteLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final WasteLogRepository wasteLogRepository;

    public List<Map<String, Object>> getWasteByZone() {
        return wasteLogRepository.getTotalWasteByCityZone().stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("zoneName", obj[0] != null ? obj[0].toString() : "UNKNOWN");
            map.put("totalWaste", obj[1]);
            return map;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getWasteByType() {
        return wasteLogRepository.getTotalWasteByType().stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("wasteType", obj[0].toString());
            map.put("totalWaste", obj[1]);
            return map;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getLeaderboard() {
        return wasteLogRepository.getLeaderboard().stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("userName", obj[0]);
            map.put("userType", obj[1] != null ? obj[1].toString() : "RESIDENTIAL");
            map.put("cityZone", obj[2] != null ? obj[2].toString() : "UNKNOWN");
            map.put("totalWasteKg", obj[3]);
            return map;
        }).collect(Collectors.toList());
    }
}