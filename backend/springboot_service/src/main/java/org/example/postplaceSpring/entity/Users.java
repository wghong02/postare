package org.example.postplaceSpring.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "users")
public class Users {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "userid", updatable = false, nullable = false)
        private long userId;

        @Column(name = "username", nullable = false, length = 50, unique = true)
        private String username;

        @JsonProperty("user_email")
        @Column(name = "useremail", nullable = false, unique = true)
        private String userEmail;

        @JsonProperty("user_phone")
        @Column(name = "userphone", length = 20)
        private String userPhone;

        @Column(name = "password", nullable = false)
        private String hashedPassword;

        @Column(name = "address")
        private String address;

        @JsonProperty("profile_picture")
        @Column(name = "profilepicture")
        private String profilePicture;

        @JsonProperty("register_date")
        @Temporal(TemporalType.TIMESTAMP)
        @Column(name = "registerdate", nullable = false)
        private Date registerDate;

        @JsonProperty("user_rating")
        @Column(name = "userrating", nullable = false)
        private double userRating;

        @JsonProperty("total_items_sold")
        @Column(name = "totalitemssold", nullable = false)
        private int totalItemsSold;

        @JsonProperty("total_reviews")
        @Column(name = "totalreviews", nullable = false)
        private int totalReviews;

        // Constructors
        public Users() {}

        public Users(long userId, String username, String userEmail, String userPhone, String hashedPassword,
                     String address, String profilePicture, Date registerDate, double userRating,
                     int totalItemsSold, int totalReviews) {
                this.userId = userId;
                this.username = username;
                this.userEmail = userEmail;
                this.userPhone = userPhone;
                this.hashedPassword = hashedPassword;
                this.address = address;
                this.profilePicture = profilePicture;
                this.registerDate = registerDate;
                this.userRating = userRating;
                this.totalItemsSold = totalItemsSold;
                this.totalReviews = totalReviews;
        }

        // Getters and Setters
        public long getUserId() {
                return userId;
        }

        public void setUserId(long userId) {
                this.userId = userId;
        }

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

        public String getHashedPassword() {
                return hashedPassword;
        }

        public void setHashedPassword(String hashedPassword) {
                this.hashedPassword = hashedPassword;
        }

        public String getAddress() {
                return address;
        }

        public void setAddress(String address) {
                this.address = address;
        }

        public String getProfilePicture() {
                return profilePicture;
        }

        public void setProfilePicture(String profilePicture) {
                this.profilePicture = profilePicture;
        }

        public Date getRegisterDate() {
                return registerDate;
        }

        public void setRegisterDate(Date registerDate) {
                this.registerDate = registerDate;
        }

        public double getUserRating() {
                return userRating;
        }

        public void setUserRating(double userRating) {
                this.userRating = userRating;
        }

        public int getTotalItemsSold() {
                return totalItemsSold;
        }

        public void setTotalItemsSold(int totalItemsSold) {
                this.totalItemsSold = totalItemsSold;
        }

        public int getTotalReviews() {
                return totalReviews;
        }

        public void setTotalReviews(int totalReviews) {
                this.totalReviews = totalReviews;
        }
}
