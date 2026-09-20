package com.techforbetter.smartwaste.controller;

import com.techforbetter.smartwaste.dto.UserDto;
import com.techforbetter.smartwaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(user -> UserDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .cityZone(user.getCityZone() != null ? user.getCityZone().name() : "N/A")
                        .userType(user.getUserType() != null ? user.getUserType().name() : "N/A")
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
}
