package org.example.postplaceSpring.service;

import org.example.postplaceSpring.entity.UserAuth;
import org.example.postplaceSpring.model.GoSaveUserInfo;
import org.example.postplaceSpring.model.UserRegistrationRequest;
import org.example.postplaceSpring.repository.UserAuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class UserAuthService implements UserDetailsService {

    private final UserAuthRepository userAuthRepository;
    private final RestTemplate restTemplate;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserAuthService(UserAuthRepository userAuthRepository, RestTemplate restTemplate, PasswordEncoder passwordEncoder) {
        this.userAuthRepository = userAuthRepository;
        this.restTemplate = restTemplate;
        this.passwordEncoder = passwordEncoder;
    }


    public UserDetails loadUserByUserId(long userId) throws UsernameNotFoundException {
        String username = getUsernameFromGoService(userId);
        UserAuth userAuth = userAuthRepository.findByUsername(username);
        if (userAuth == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return new CustomUserDetails(userAuth, userId);
    }

    private String getUsernameFromGoService(long userId) {
        String url = "http://localhost:8081/users/getUsername/" + userId;  // Change URL to match db url
        String response = restTemplate.getForObject(url, String.class);
        if (response == null) {
            throw new IllegalArgumentException("No response received from Go service");
        }
        return response.replace("\"", "");
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAuth userAuth = userAuthRepository.findByUsername(username);
        if (userAuth == null) {
            throw new UsernameNotFoundException("User not found");
        }

        // Call Go service to get userId
        Long userId = getUserIdFromGoService(username);

        return new CustomUserDetails(userAuth, userId);
    }

    private Long getUserIdFromGoService(String username) {
        String url = "http://localhost:8081/users/getUserID/" + username;  // Change URL to match db url
        return restTemplate.getForObject(url, Long.class);
    }

    public void registerNewUser(UserRegistrationRequest registrationRequest) throws Exception {
        // Check if the user already exists
        if (userAuthRepository.existsById(registrationRequest.getUsername())) {
            throw new Exception("Username already exists");
        }

        // Create a new user
        UserAuth newUser = new UserAuth();
        newUser.setUsername(registrationRequest.getUsername());
        newUser.setEncodedPassword(passwordEncoder.encode(registrationRequest.getPassword()));

        // Save the new user
        userAuthRepository.save(newUser);
        // Call the Go service to save additional user info
        saveUserInfoInGoService(registrationRequest);
    }

    private void saveUserInfoInGoService(UserRegistrationRequest registrationRequest) {
        String url = "http://localhost:8081/saveUserInfo";
        GoSaveUserInfo goRequest = new GoSaveUserInfo(
                registrationRequest.getUsername(),
                registrationRequest.getUserEmail(),
                registrationRequest.getUserPhone(),
                registrationRequest.getNickname(),
                registrationRequest.getProfilePicture()
        );
        restTemplate.postForObject(url, goRequest, String.class);
    }
}

