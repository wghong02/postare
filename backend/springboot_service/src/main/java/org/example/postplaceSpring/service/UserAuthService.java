package org.example.postplaceSpring.service;

import org.example.postplaceSpring.entity.UserAuth;
import org.example.postplaceSpring.repository.UserAuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class UserAuthService implements UserDetailsService {

    private final UserAuthRepository userAuthRepository;
    private final RestTemplate restTemplate;

    public UserAuthService(UserAuthRepository userAuthRepository, RestTemplate restTemplate) {
        this.userAuthRepository = userAuthRepository;
        this.restTemplate = restTemplate;
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
        String url = "http://localhost:8081/userid/" + username;  // Replace with actual URL
        return restTemplate.getForObject(url, Long.class);
    }
}
