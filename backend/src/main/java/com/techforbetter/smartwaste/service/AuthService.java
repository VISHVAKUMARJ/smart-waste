package com.techforbetter.smartwaste.service;
import com.techforbetter.smartwaste.dto.AuthResponse;
import com.techforbetter.smartwaste.dto.AuthRequest;
import com.techforbetter.smartwaste.dto.SignupRequest;
import com.techforbetter.smartwaste.dto.UserDto;
import com.techforbetter.smartwaste.entity.User;
import com.techforbetter.smartwaste.enums.CityZone;
import com.techforbetter.smartwaste.enums.Role;
import com.techforbetter.smartwaste.enums.UserType;
import com.techforbetter.smartwaste.repository.UserRepository;
import com.techforbetter.smartwaste.security.JwtUtil;
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
    private final JwtUtil jwtUtil;
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
        var token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder().token(token).user(mapToDto(user)).build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        var token = jwtUtil.generateToken(user.getEmail());
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