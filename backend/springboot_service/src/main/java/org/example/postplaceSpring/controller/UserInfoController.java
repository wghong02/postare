package org.example.postplaceSpring.controller;

import org.example.postplaceSpring.service.CustomUserDetails;
import org.example.postplaceSpring.service.UserInfoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
public class UserInfoController {
    private final UserInfoService userInfoService;

    private static final Logger logger = LoggerFactory.getLogger(UserInfoController.class);

    @Autowired
    // automatically inject dependency here
    public UserInfoController(UserInfoService userInfoService) {
        this.userInfoService = userInfoService;
    }

    @GetMapping("/user/get/userinfo")
    public ResponseEntity<String> getUserInfo( // call user details related if authed
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        logger.info("Received Get request for /user/get/userinfo");
        if (userDetails == null) {
            throw new IllegalStateException("User details not found in authentication context");
        }
        // get userId using userDetail's function
        long userId = userDetails.getUserId();

        ResponseEntity<String> response = userInfoService.getUserInfoById(userId);
        if (response.getStatusCode().is2xxSuccessful()) {
            logger.info("Post {} returned", userId);
            return response;
        } else {
            throw new ResponseStatusException(response.getStatusCode(), "Post not found");
        }
    }

    @GetMapping("/public/get/userInfo/userID/{userId}")
    public ResponseEntity<String> getUserPublicInfo( // call user details related if authed
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable long userId) {
        logger.info("Received Get request for /public/get/userinfo/{userId}");
        ResponseEntity<String> response = userInfoService.getUserInfoById(userId);
        if (response.getStatusCode().is2xxSuccessful()) {
            logger.info("Post {} returned", userId);
            return response;
        } else {
            throw new ResponseStatusException(response.getStatusCode(), "Post not found");
        }
    }

    @GetMapping("/public/get/userInfo/userLikes/{postId}")
    public ResponseEntity<String> getLikesByPostId(@PathVariable UUID postId,
                                                   @RequestParam(defaultValue = "10") int limit,
                                                   @RequestParam(defaultValue = "0") int offset) {
        logger.info("Received Get request for /public/get/userInfo/userLikes/{postId}");
        ResponseEntity<String> response = userInfoService.findLikedUsersByPostId(postId, limit, offset);
        if (response.getStatusCode().is2xxSuccessful()) {
            logger.info("UserInfo {} returned", postId);
            return response;
        } else {
            throw new ResponseStatusException(response.getStatusCode(), "Like not found");
        }
    }

}
