package org.example.postplaceSpring.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serial;
import java.io.Serializable;

public class GoSaveUserInfo implements Serializable {
    // this is for the part of the user info that is to be saved by go backend
    @Serial
    private static final long serialVersionUID = 1L;

    private String username;
    @JsonProperty("user_email")
    private String userEmail;
    @JsonProperty("user_phone")
    private String userPhone;
    private String nickname;
    @JsonProperty("profile_picture")
    private String profilePicture;

    public GoSaveUserInfo() {
    }

    public GoSaveUserInfo(String username, String userEmail, String userPhone, String nickname, String profilePicture) {
        this.username = username;
        this.userEmail = userEmail;
        this.userPhone = userPhone;
        this.nickname = nickname;
        this.profilePicture = profilePicture;
    }

    // Getters and setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}