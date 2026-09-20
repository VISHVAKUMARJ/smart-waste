const fs = require('fs');
const path = require('path');

const backendSrc = path.join(__dirname, 'backend', 'src', 'main', 'java', 'com', 'techforbetter', 'smartwaste');

// Helper to write files
const writeFile = (relPath, content) => {
    const fullPath = path.join(backendSrc, ...relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim());
};

// Helper to delete files
const deleteFile = (relPath) => {
    const fullPath = path.join(backendSrc, ...relPath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};

// 1. Delete Old Files
deleteFile(['entity', 'Household.java']);
deleteFile(['entity', 'Zone.java']);
deleteFile(['repository', 'HouseholdRepository.java']);
deleteFile(['repository', 'ZoneRepository.java']);
deleteFile(['config', 'DataInitializer.java']);

// 2. Write Enums
writeFile(['enums', 'CityZone.java'], `
package com.techforbetter.smartwaste.enums;
public enum CityZone { CHENNAI, MUMBAI, DELHI, BANGALORE }
`);

writeFile(['enums', 'UserType.java'], `
package com.techforbetter.smartwaste.enums;
public enum UserType { RESIDENTIAL, SCHOOL, COMMERCIAL }
`);

// 3. Write Entities
writeFile(['entity', 'User.java'], `
package com.techforbetter.smartwaste.entity;

import com.techforbetter.smartwaste.enums.CityZone;
import com.techforbetter.smartwaste.enums.Role;
import com.techforbetter.smartwaste.enums.UserType;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private CityZone cityZone;

    @Enumerated(EnumType.STRING)
    private UserType userType;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<WasteLog> wasteLogs;
}
`);

writeFile(['entity', 'WasteLog.java'], `
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

    private LocalDateTime logDate;
}
`);

// 4. Write DTOs
writeFile(['dto', 'SignupRequest.java'], `
package com.techforbetter.smartwaste.dto;
import lombok.Data;
@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private String cityZone;
    private String userType;
}
`);

writeFile(['dto', 'UserDto.java'], `
package com.techforbetter.smartwaste.dto;
import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String cityZone;
    private String userType;
}
`);

// 5. Write Repositories
writeFile(['repository', 'WasteLogRepository.java'], `
package com.techforbetter.smartwaste.repository;
import com.techforbetter.smartwaste.entity.WasteLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface WasteLogRepository extends JpaRepository<WasteLog, Long> {
    List<WasteLog> findByUser_IdOrderByLogDateDesc(Long userId);

    @Query("SELECT w.cityZone, SUM(w.quantityKg) FROM WasteLog w GROUP BY w.cityZone")
    List<Object[]> getTotalWasteByCityZone();

    @Query("SELECT w.wasteType, SUM(w.quantityKg) FROM WasteLog w GROUP BY w.wasteType")
    List<Object[]> getTotalWasteByType();
    
    @Query("SELECT w.user.name, w.user.userType, w.cityZone, SUM(w.quantityKg) FROM WasteLog w GROUP BY w.user.id, w.user.name, w.user.userType, w.cityZone ORDER BY SUM(w.quantityKg) ASC")
    List<Object[]> getLeaderboard();
}
`);

// 6. Write Services
writeFile(['service', 'AuthService.java'], `
package com.techforbetter.smartwaste.service;
import com.techforbetter.smartwaste.dto.AuthResponse;
import com.techforbetter.smartwaste.dto.LoginRequest;
import com.techforbetter.smartwaste.dto.SignupRequest;
import com.techforbetter.smartwaste.dto.UserDto;
import com.techforbetter.smartwaste.entity.User;
import com.techforbetter.smartwaste.enums.CityZone;
import com.techforbetter.smartwaste.enums.Role;
import com.techforbetter.smartwaste.enums.UserType;
import com.techforbetter.smartwaste.repository.UserRepository;
import com.techforbetter.smartwaste.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse signup(SignupRequest request) {
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.HOUSEHOLD)
                .cityZone(request.getCityZone() != null ? CityZone.valueOf(request.getCityZone()) : CityZone.CHENNAI)
                .userType(request.getUserType() != null ? UserType.valueOf(request.getUserType()) : UserType.RESIDENTIAL)
                .build();
        userRepository.save(user);
        var token = jwtService.generateToken(user.getEmail());
        return AuthResponse.builder().token(token).user(mapToDto(user)).build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        var token = jwtService.generateToken(user.getEmail());
        return AuthResponse.builder().token(token).user(mapToDto(user)).build();
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .cityZone(user.getCityZone() != null ? user.getCityZone().name() : null)
                .userType(user.getUserType() != null ? user.getUserType().name() : null)
                .build();
    }
}
`);

writeFile(['service', 'WasteLogService.java'], `
package com.techforbetter.smartwaste.service;
import com.techforbetter.smartwaste.dto.WasteLogDto;
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

    public void logWaste(Long userId, String wasteType, Double quantityKg) {
        User user = userRepository.findById(userId).orElseThrow();
        WasteLog log = WasteLog.builder()
                .user(user)
                .cityZone(user.getCityZone())
                .wasteType(WasteType.valueOf(wasteType.toUpperCase()))
                .quantityKg(quantityKg)
                .logDate(LocalDateTime.now())
                .build();
        wasteLogRepository.save(log);
    }

    public List<WasteLogDto> getUserLogs(Long userId) {
        return wasteLogRepository.findByUser_IdOrderByLogDateDesc(userId).stream()
                .map(log -> WasteLogDto.builder()
                        .id(log.getId())
                        .wasteType(log.getWasteType().name())
                        .quantityKg(log.getQuantityKg())
                        .logDate(log.getLogDate())
                        .build())
                .collect(Collectors.toList());
    }
}
`);

writeFile(['service', 'AnalyticsService.java'], `
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
`);

// 7. Write Seeder
writeFile(['config', 'IndianDataSeeder.java'], `
package com.techforbetter.smartwaste.config;
import com.techforbetter.smartwaste.entity.Role;
import com.techforbetter.smartwaste.entity.User;
import com.techforbetter.smartwaste.entity.WasteLog;
import com.techforbetter.smartwaste.enums.CityZone;
import com.techforbetter.smartwaste.enums.UserType;
import com.techforbetter.smartwaste.enums.WasteType;
import com.techforbetter.smartwaste.repository.UserRepository;
import com.techforbetter.smartwaste.repository.WasteLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class IndianDataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final WasteLogRepository wasteLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() < 2) {
            String pass = passwordEncoder.encode("password123");
            
            User admin = User.builder().name("Admin User").email("admin@smartwaste.com").passwordHash(pass).role(Role.ADMIN).cityZone(CityZone.DELHI).userType(UserType.COMMERCIAL).build();
            User u1 = User.builder().name("Sharma Residence").email("sharma@gmail.com").passwordHash(pass).role(Role.HOUSEHOLD).cityZone(CityZone.CHENNAI).userType(UserType.RESIDENTIAL).build();
            User u2 = User.builder().name("Delhi Public School").email("dps@gmail.com").passwordHash(pass).role(Role.HOUSEHOLD).cityZone(CityZone.DELHI).userType(UserType.SCHOOL).build();
            User u3 = User.builder().name("Andheri Cafe").email("cafe@gmail.com").passwordHash(pass).role(Role.HOUSEHOLD).cityZone(CityZone.MUMBAI).userType(UserType.COMMERCIAL).build();
            User u4 = User.builder().name("Reddy Family").email("reddy@gmail.com").passwordHash(pass).role(Role.HOUSEHOLD).cityZone(CityZone.BANGALORE).userType(UserType.RESIDENTIAL).build();
            
            userRepository.saveAll(Arrays.asList(admin, u1, u2, u3, u4));

            List<User> users = Arrays.asList(u1, u2, u3, u4);
            for (User u : users) {
                wasteLogRepository.save(WasteLog.builder().user(u).cityZone(u.getCityZone()).wasteType(WasteType.WET).quantityKg(Math.random() * 5 + 1).logDate(LocalDateTime.now().minusDays(1)).build());
                wasteLogRepository.save(WasteLog.builder().user(u).cityZone(u.getCityZone()).wasteType(WasteType.DRY).quantityKg(Math.random() * 3 + 1).logDate(LocalDateTime.now().minusDays(2)).build());
            }
            System.out.println("Data Seeded Successfully!");
        }
    }
}
`);
console.log("Refactoring complete.");
