package org.example.postplaceSpring.repository;

import org.example.postplaceSpring.entity.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAuthRepository extends JpaRepository<UserAuth, String> {
    UserAuth findByUsername(String username);
}
