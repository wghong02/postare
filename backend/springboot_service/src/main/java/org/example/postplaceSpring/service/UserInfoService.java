package org.example.postplaceSpring.service;

import org.springframework.stereotype.Service;

@Service
public class UserInfoService {
//    private final UsersRepo userRepository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Autowired
//    public UserInfoService(UsersRepo userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    public Iterable<Users> findAllUsers() {
//        return this.userRepository.findAll();
//    }

//    public Users findUserById(long id) {
//        Optional<Users> user = userRepository.findById(id);
//        return user.orElse(null); // Handle the Optional if user is not found
//    }
//
//    public void deleteUserByUserId(long userID) {
//        userRepository.findById(userID)
//                .orElseThrow(() -> new NoSuchElementException("Invalid delete no seller found with the ID: " + userID));
//        this.userRepository.deleteById(userID);
//    }
//
//    public long getUserIdByUsername(String username) {
//        return userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found with username: " + username))
//                .getUserId();
//    }
}