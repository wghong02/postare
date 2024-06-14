package org.example.postplaceSpring;

import org.example.postplaceSpring.entity.Users;
import org.example.postplaceSpring.repository.UsersRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


import java.util.Date;
import java.util.Optional;
import java.time.LocalDate;
import java.time.ZoneId;

@Configuration
public class DatabaseInitializer {
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Bean
    CommandLineRunner initDatabase(UsersRepo usersRepo) {
        return args -> {
            long userId = 103L;
            String username = "kbr";
            String userEmail = "knm@example.com";

            Optional<Users> userById = usersRepo.findByUserId(userId);
            Optional<Users> userByUsername = usersRepo.findByUsername(username);
            Optional<Users> userByEmail = usersRepo.findByUserEmail(userEmail);

            if (userById.isEmpty() && userByUsername.isEmpty() && userByEmail.isEmpty()) {
                Users user = new Users(
                        userId,
                        username,
                        userEmail,
                        "+9876567",
                        encoder.encode("plain_text_password"),
                        "Somewhere secret",
                        "https://avatars.mds.yandex.net/i?id=a618da0091d756df0ad8c74d52ce4d7bdc3d0837-9555580-images-thumbs&n=13",
                        Date.from(LocalDate.of(2023, 4, 2).atStartOfDay(ZoneId.systemDefault()).toInstant()),
                        0.7,
                        3,
                        0
                );

                usersRepo.save(user);
                System.out.println("User added: " + user);
            } else {
                System.out.println("User already exists with UserID: " + userId + ", Username: " + username + ", or UserEmail: " + userEmail);
            }

            // Print all users
            usersRepo.findAll().forEach(System.out::println);
        };
    }
}
