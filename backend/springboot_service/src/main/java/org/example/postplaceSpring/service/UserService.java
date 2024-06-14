package org.example.postplaceSpring.service;

import org.example.postplaceSpring.entity.Users;
import org.example.postplaceSpring.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class UserService {
    private final UsersRepo userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UsersRepo userRepository) {
        this.userRepository = userRepository;
    }

    public Iterable<Users> findAllUsers() {
        return this.userRepository.findAll();
    }

    public Users findUserById(long id) {
        Optional<Users> user = userRepository.findById(id);
        return user.orElse(null); // Handle the Optional if user is not found
    }

    public Users createUser(Users user) {
//        user.setHashedPassword(passwordEncoder.encode(user.getHashedPassword()));
        user.setHashedPassword(user.getHashedPassword());
        return this.userRepository.save(user);
    }

    @Transactional
    public Users updateUserById(Users users, long userID) {
        Users existingUsers = userRepository.findById(userID)
                .orElseThrow(() -> new NoSuchElementException("Invalid update no seller found with the ID: " + userID));

        // Update fields
        existingUsers.setUsername(users.getUsername());
        existingUsers.setUserEmail(users.getUserEmail());
        existingUsers.setUserPhone(users.getUserPhone());
        existingUsers.setHashedPassword(users.getHashedPassword());
        existingUsers.setAddress(users.getAddress());
        existingUsers.setProfilePicture(users.getProfilePicture());
        existingUsers.setRegisterDate(users.getRegisterDate());
        existingUsers.setUserRating(users.getUserRating());
        existingUsers.setTotalItemsSold(users.getTotalItemsSold());

        // Save the updated seller
        return userRepository.save(existingUsers);
    }

    public void deleteUserByUserId(long userID) {
        userRepository.findById(userID)
                .orElseThrow(() -> new NoSuchElementException("Invalid delete no seller found with the ID: " + userID));
        this.userRepository.deleteById(userID);
    }

    public long getUserIdByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username))
                .getUserId();
    }
}