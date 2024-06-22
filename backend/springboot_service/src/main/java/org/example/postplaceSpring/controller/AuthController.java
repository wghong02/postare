package org.example.postplaceSpring.controller;

import org.example.postplaceSpring.model.JwtRequest;
import org.example.postplaceSpring.model.JwtResponse;
import org.example.postplaceSpring.model.UserRegistrationRequest;
import org.example.postplaceSpring.service.CustomUserDetails;
import org.example.postplaceSpring.service.UserAuthService;
import org.example.postplaceSpring.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserAuthService userDetailsService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                                       JwtTokenUtil jwtTokenUtil,
                          UserAuthService userDetailsService) {
        this.authenticationManager = authenticationManager; // by spring security to give auth
        this.jwtTokenUtil = jwtTokenUtil;   // token util functions
        this.userDetailsService = userDetailsService;   // apis to user's auth info
    }

    @PostMapping("/auth/login")
    public JwtResponse createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    authenticationRequest.getUsername(),
                    authenticationRequest.getPassword()));
        } catch (AuthenticationException e) {
            throw new AuthenticationServiceException("Invalid username or password");
        }

        // generate auth token on login
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        final long userId = ((CustomUserDetails) userDetails).getUserId();
        final String token = jwtTokenUtil.generateToken(userDetails, userId);

        return new JwtResponse(token);
    }

    @PostMapping("/auth/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegistrationRequest registrationRequest) {
        try {
            userDetailsService.registerNewUser(registrationRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
