package org.example.postplaceSpring.controller;

import org.example.postplaceSpring.service.CustomUserDetails;
import org.example.postplaceSpring.service.LikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
public class LikeController {
    private final LikeService likeService;

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired
    // automatically inject dependency here
    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @GetMapping("/public/getLikesByPost/{postId}")
    public ResponseEntity<String> getLikesByPostId(@PathVariable UUID postId,
                                                      @RequestParam(defaultValue = "10") int limit,
                                                      @RequestParam(defaultValue = "0") int offset) {
        logger.info("Received Get request for /public/getLikesByPost/{postId}");
        ResponseEntity<String> response = likeService.findLikesByPostId(postId, limit, offset);
        if (response.getStatusCode().is2xxSuccessful()) {
            logger.info("Like {} returned", postId);
            return response;
        } else {
            throw new ResponseStatusException(response.getStatusCode(), "Like not found");
        }
    }

    @GetMapping("/user/getLikesByUser")
    public ResponseEntity<String> getLikesByUserId(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                      @RequestParam(defaultValue = "10") int limit,
                                                      @RequestParam(defaultValue = "0") int offset) {
        logger.info("Received Get request for /public/getLikesByUser/{userId}");
        // Get the authenticated user's details
        if (userDetails == null) {
            throw new IllegalStateException("User details not found in authentication context");
        }
        long userId = userDetails.getUserId();
        ResponseEntity<String> response = likeService.findLikesByUserId(userId, limit, offset);
        if (response.getStatusCode().is2xxSuccessful()) {
            logger.info("Like {} returned", userId);
            return response;
        } else {
            throw new ResponseStatusException(response.getStatusCode(), "Like not found");
        }
    }

    @PostMapping("/user/likes/upload")
    public ResponseEntity<String> uploadLike(@RequestBody String likeJson,
                                             @AuthenticationPrincipal CustomUserDetails userDetails) {
        logger.info("Received Post request for /user/likes/upload");
        // Get the authenticated user's details
        if (userDetails == null) {
            throw new IllegalStateException("User details not found in authentication context");
        }
        long userId = userDetails.getUserId();
        // Pass the like file and userId to the service layer
        return likeService.createLike(likeJson, userId);
    }

    @DeleteMapping("/user/likes/delete/{postId}")
    public ResponseEntity<Void> deleteLike(@PathVariable UUID postId,
                                           @AuthenticationPrincipal CustomUserDetails userDetails) {
        logger.info("Received Delete request for /user/likes/delete/{postId}");
        if (userDetails == null) {
            throw new IllegalStateException("User details not found in authentication context");
        }
        long userId = userDetails.getUserId();
        likeService.deleteLike(userId, postId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/likes/check/{postId}")
    public ResponseEntity<String> checkLike(@PathVariable UUID postId,
                                            @AuthenticationPrincipal CustomUserDetails userDetails) {
        logger.info("Received check request for /user/likes/check/{postId}");
        if (userDetails == null) {
            throw new IllegalStateException("User details not found in authentication context");
        }
        long userId = userDetails.getUserId();
        String response = likeService.checkLike(userId, postId);
        return ResponseEntity.ok(response);
    }

//    @GetMapping("/public/getLikesCount/{postId}")
//    public ResponseEntity<String> getLikeCountByPostId(@PathVariable UUID postId) {
//        logger.info("Received Get request for /public/getLikeCount/{postId}");
//        ResponseEntity<String> response = likeService.getLikeCountByPostId(postId);
//        if (response.getStatusCode().is2xxSuccessful()) {
//            logger.info("Like count with post {} returned", postId);
//            return response;
//        } else {
//            throw new ResponseStatusException(response.getStatusCode(), "Like not found");
//        }
//    }

}
