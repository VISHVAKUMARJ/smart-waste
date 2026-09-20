package com.techforbetter.smartwaste.config;
import com.techforbetter.smartwaste.enums.Role;
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
        if (userRepository.findByEmail("sharma@gmail.com").isEmpty()) {
            wasteLogRepository.deleteAllInBatch(); 
            userRepository.deleteAllInBatch(); 
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