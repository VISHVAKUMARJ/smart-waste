package com.techforbetter.smartwaste.service;
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
                .wasteType(request.getWasteType())
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
