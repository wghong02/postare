package org.example.postplaceSpring.controller;

import org.example.postplaceSpring.service.UserInfoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class UserInfoController {
    private final UserInfoService userInfoService;

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired
    public UserInfoController(UserInfoService userInfoService) {
        this.userInfoService = userInfoService;
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<String> getUserInfo(@PathVariable long userId) {
        ResponseEntity<String> response = userInfoService.getUserInfoById(userId);
        if (response.getStatusCode().is2xxSuccessful()) {
            logger.info("Post {} returned", userId);
            return response;
        } else {
            throw new ResponseStatusException(response.getStatusCode(), "Post not found");
        }
    }
}
