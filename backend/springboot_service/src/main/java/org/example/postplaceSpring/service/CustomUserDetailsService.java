package org.example.postplaceSpring.service;

import org.example.postplaceSpring.entity.Users;
import org.example.postplaceSpring.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsersRepo usersRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        // Load user by userId
        Optional<Users> user = usersRepository.findById(Long.parseLong(userId));
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found with userId: " + userId);
        }
        Users foundUser = user.get();
        return new CustomUserDetails(foundUser);
    }
}
