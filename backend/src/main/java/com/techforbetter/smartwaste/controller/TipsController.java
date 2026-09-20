package com.techforbetter.smartwaste.controller;

import com.techforbetter.smartwaste.enums.WasteType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tips")
public class TipsController {

    private final Map<WasteType, List<String>> tipsMap = Map.of(
            WasteType.WET, List.of(
                    "Compost your vegetable peels and fruit scraps.",
                    "Use eggshells in your garden as a natural fertilizer.",
                    "Avoid throwing liquids in wet waste; drain excess moisture."
            ),
            WasteType.DRY, List.of(
                    "Flatten cardboard boxes before recycling to save space.",
                    "Ensure plastic containers are clean and dry before disposal.",
                    "Donate old clothes instead of throwing them away."
            ),
            WasteType.E_WASTE, List.of(
                    "Take old batteries to designated e-waste drop-off bins.",
                    "Consider repairing electronics before replacing them.",
                    "Wipe your personal data before recycling phones or laptops."
            ),
            WasteType.HAZARDOUS, List.of(
                    "Do not mix chemicals; keep them in original containers.",
                    "Dispose of medical waste at local pharmacy take-back programs.",
                    "Never pour paint or motor oil down the drain."
            )
    );

    @GetMapping("/{type}")
    public ResponseEntity<List<String>> getTipsByType(@PathVariable WasteType type) {
        return ResponseEntity.ok(tipsMap.getOrDefault(type, List.of("Reduce, reuse, recycle!")));
    }
}
