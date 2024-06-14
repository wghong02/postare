package org.example.postplaceSpring.repository;

import org.example.postplaceSpring.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepo extends JpaRepository<Users, Long> {
    Optional<Users> findByUserId(long userId);
    Optional<Users> findByUsername(String username);
    Optional<Users> findByUserEmail(String userEmail);
}