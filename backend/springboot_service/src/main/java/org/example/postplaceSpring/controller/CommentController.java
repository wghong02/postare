package org.example.postplaceSpring.controller;

import org.example.postplaceSpring.service.CommentService;
import org.example.postplaceSpring.service.CustomUserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
public class CommentController {
    private final CommentService commentService;

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired
    // automatically inject dependency here
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/public/getComments/{postId}")
    public ResponseEntity<String> getCommentsByPostId(@PathVariable UUID postId,
                                                      @RequestParam(defaultValue = "10") int limit,
                                                      @RequestParam(defaultValue = "0") int offset) {
        logger.info("Received Get request for /public/getComments/{commentId}");
        ResponseEntity<String> response = commentService.findCommentsByPostId(postId, limit, offset);
        if (response.getStatusCode().is2xxSuccessful()) {
            logger.info("Comment {} returned", postId);
            return response;
        } else {
            throw new ResponseStatusException(response.getStatusCode(), "Comment not found");
        }
    }

    @PostMapping("/user/comments/upload")
    public ResponseEntity<String> uploadComment(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody String commentJson) {
        logger.info("Received Post request for /user/comments/upload");
        // Get the authenticated user's details
        if (userDetails == null) {
            throw new IllegalStateException("User details not found in authentication context");
        }
        long userId = userDetails.getUserId();
        // Pass the post file and userId to the service layer
        return commentService.createComment(commentJson, userId);
    }

    @DeleteMapping("/user/comments/delete/{commentId}")
    public ResponseEntity<Void> deleteComment(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable long commentId) {
        logger.info("Received Delete request for /user/comments/delete/{commentId}");
        if (userDetails == null) {
            throw new IllegalStateException("User details not found in authentication context");
        }
        long userId = userDetails.getUserId();
        commentService.deleteCommentByCommentId(commentId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/public/getSubComments/{commentId}")
    public ResponseEntity<String> getSubCommentsByPostId(@PathVariable long commentId,
                                                         @RequestParam(defaultValue = "10") int limit,
                                                         @RequestParam(defaultValue = "0") int offset) {
        logger.info("Received Get request for /public/getSubComments/{commentId}");
        ResponseEntity<String> response = commentService.findSubCommentsByCommentId(commentId, limit, offset);
        if (response.getStatusCode().is2xxSuccessful()) {
            logger.info("Sub comment {} returned", commentId);
            return response;
        } else {
            throw new ResponseStatusException(response.getStatusCode(), "Sub comment not found");
        }
    }
    
    @PostMapping("/user/subComments/upload")
    public ResponseEntity<String> uploadSubComment(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody String subCommentJson) {
        logger.info("Received Post request for /user/subComments/upload");
        // Get the authenticated user's details
        if (userDetails == null) {
            throw new IllegalStateException("User details not found in authentication context");
        }
        long userId = userDetails.getUserId();
        // Pass the post file and userId to the service layer
        return commentService.createSubComment(subCommentJson, userId);
    }

    @DeleteMapping("/user/subComments/delete/{subCommentId}")
    public ResponseEntity<Void> deleteSubComment(@AuthenticationPrincipal CustomUserDetails userDetails,@PathVariable long subCommentId) {
        logger.info("Received Delete request for /user/subComments/delete/{subCommentId}");
        if (userDetails == null) {
            throw new IllegalStateException("User details not found in authentication context");
        }
        long userId = userDetails.getUserId();
        commentService.deleteSubCommentBySubCommentId(subCommentId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/public/getCommentCount/{postId}")
    public ResponseEntity<String> getCommentCountByPostId(@PathVariable UUID postId,
                                                          @RequestParam boolean isTotal) {
        logger.info("Received Get request for /public/getCommentCount/{commentId}");
        ResponseEntity<String> response = commentService.getCommentCountByPostId(postId, isTotal);
        if (response.getStatusCode().is2xxSuccessful()) {
            logger.info("Comment count with post {} returned", postId);
            return response;
        } else {
            throw new ResponseStatusException(response.getStatusCode(), "Comment not found");
        }
    }

    @GetMapping("/public/getSubCommentCount/{commentId}")
    public ResponseEntity<String> getSubCommentCountByPostId(@PathVariable long commentId) {
        logger.info("Received Get request for /public/getSubCommentCount/{commentId}");
        ResponseEntity<String> response = commentService.getSubCommentCountByCommentId(commentId);
        if (response.getStatusCode().is2xxSuccessful()) {
            logger.info("Sub comment count with comment {} returned", commentId);
            return response;
        } else {
            throw new ResponseStatusException(response.getStatusCode(), "Sub comment not found");
        }
    }
}
