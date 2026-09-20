package com.techforbetter.smartwaste.entity;

import com.techforbetter.smartwaste.enums.CityZone;
import com.techforbetter.smartwaste.enums.WasteType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "waste_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WasteLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private CityZone cityZone; 

    @Enumerated(EnumType.STRING)
    private WasteType wasteType;

    private Double quantityKg;

    @Column(name = "logged_at")
    private LocalDateTime logDate;
}