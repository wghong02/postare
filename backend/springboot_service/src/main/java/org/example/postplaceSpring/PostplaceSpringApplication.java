package org.example.postplaceSpring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class PostplaceSpringApplication {

    public static void main(String[] args) {
        SpringApplication.run(PostplaceSpringApplication.class, args);
    }
}
