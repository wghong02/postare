package org.example.postplaceSpring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "userauth")
public class UserAuth {

    @Id
    private String username;

    private String encodedPassword;

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
}
