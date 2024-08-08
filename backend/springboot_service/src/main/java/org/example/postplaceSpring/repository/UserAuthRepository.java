package org.example.postplaceSpring.repository;

import org.example.postplaceSpring.entity.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAuthRepository extends JpaRepository<UserAuth, String> {

    @Query("SELECT u FROM UserAuth u WHERE u.username = :username")
    UserAuth findByUsername(String username);
}
