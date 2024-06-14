package org.example.postplaceSpring.controller;

import org.example.postplaceSpring.model.JwtRequest;
import org.example.postplaceSpring.model.JwtResponse;
import org.example.postplaceSpring.service.CustomUserDetails;
import org.example.postplaceSpring.service.UserAuthService;
import org.example.postplaceSpring.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
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
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userDetailsService = userDetailsService;
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
}
