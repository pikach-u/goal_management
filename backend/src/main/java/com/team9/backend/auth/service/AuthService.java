package com.team9.backend.auth.service;

import com.team9.backend.auth.dto.AuthRequest;
import com.team9.backend.auth.dto.AuthResponse;
import com.team9.backend.auth.dto.RegisterRequest;
import com.team9.backend.auth.entity.AuthProvider;
import com.team9.backend.auth.security.JwtService;
import com.team9.backend.global.exception.UnauthorizedException;
import com.team9.backend.global.exception.UserAlreadyExistsException;
import com.team9.backend.user.dto.UserResponse;
import com.team9.backend.user.entity.User;
import com.team9.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if(userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        List<String> defaultProfileImages = Arrays.asList(
                "resources/static/images/profile_1.jpg",
                "resources/static/images/profile_2.jpg",
                "resources/static/images/profile_3.jpg"
        );

        Collections.shuffle(defaultProfileImages);
        String defaultProfileImage = defaultProfileImages.get(0);

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .provider(AuthProvider.LOCAL)
                .role("ROLE_USER")
                .profileImageUrl(defaultProfileImage)
                .build();
        System.out.println(user.getEmail());
        user = userRepository.save(user);
        System.out.println(user.getProfileImageUrl());

        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .user(UserResponse.from(user))
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        try {
            // Support both email and username login
            String loginId = request.getEmail() != null ? request.getEmail() : request.getUsername();

            // First authenticate with the authentication manager
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginId,
                            request.getPassword()
                    )
            );

            // Only retrieve user after successful authentication
            User user = userRepository.findByEmail(loginId)
                    .or(() -> userRepository.findByUsername(loginId))
                    .orElseThrow(() -> new UnauthorizedException("Authentication failed"));

            // Generate tokens
            String jwtToken = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            return AuthResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .user(UserResponse.from(user))
                    .build();
        } catch (BadCredentialsException e) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }
}
