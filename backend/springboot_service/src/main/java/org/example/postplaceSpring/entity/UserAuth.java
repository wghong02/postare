package org.example.postplaceSpring.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "userauth")
public class UserAuth {

    @Id
    @Column(name = "username", updatable = false, nullable = false)
    private String username;

    @JsonProperty("encoded_password")
    @Column(name = "encodedpassword", updatable = false, nullable = false)
    private String encodedPassword;

    @Column(name = "role", updatable = false, nullable = false)
    private String role;

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEncodedPassword() {
        return encodedPassword;
    }

    public void setEncodedPassword(String encodedPassword) {
        this.encodedPassword = encodedPassword;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
