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