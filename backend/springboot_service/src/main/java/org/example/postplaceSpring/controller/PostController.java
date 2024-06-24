    package org.example.postplaceSpring.controller;

    import org.example.postplaceSpring.service.PostService;
    import org.example.postplaceSpring.service.CustomUserDetails;
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.annotation.AuthenticationPrincipal;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.server.ResponseStatusException;

    import java.util.UUID;

    @RestController
    public class PostController {
        private final PostService postService;

        private static final Logger logger = LoggerFactory.getLogger(PostController.class);

        @Autowired
        public PostController(PostService postService) {
            this.postService = postService;
        }

        @GetMapping("/posts/{postId}")
        public ResponseEntity<String> getIdPost(@PathVariable UUID postId) {
            ResponseEntity<String> response = postService.findPostById(postId);
            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Post {} returned", postId);
                return response;
            } else {
                throw new ResponseStatusException(response.getStatusCode(), "Post not found");
            }
        }

        @GetMapping("/search")
        public ResponseEntity<String> findPostsByDescription(
                @RequestParam(required = false) String description,
                @RequestParam(defaultValue = "30") int limit,
                @RequestParam(defaultValue = "0") int offset) {
            return postService.findPostsByDescription(description, limit, offset);
        }

        @PostMapping("/user/posts/upload")
        public ResponseEntity<String> uploadPost(@RequestBody String postJson) {
            // Get the authenticated user's details
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            long userId = userDetails.getUserId();
            // Pass the post JSON and userId to the service layer
            return postService.createPost(postJson, userId);
        }

        @DeleteMapping("/user/posts/delete/{postId}")
        public ResponseEntity<Void> deletePost(@PathVariable UUID postId) {
            postService.deletePostByPostId(postId);
            return ResponseEntity.noContent().build();
        }

        @GetMapping("/posts/get/most/{attribute}")
        public ResponseEntity<String> getMostInOneAttributePosts(
                @PathVariable String attribute,
                @RequestParam(defaultValue = "30") int limit,
                @RequestParam(defaultValue = "0") int offset) {
            return postService.findMostInOneAttributePosts(limit, offset, attribute);
        }

        @GetMapping("/user/get/postHistory")
        public ResponseEntity<String> getUserPostHistory(
                @AuthenticationPrincipal CustomUserDetails userDetails,
                @RequestParam(defaultValue = "30") int limit,
                @RequestParam(defaultValue = "0") int offset) {
            if (userDetails == null) {
                throw new IllegalStateException("User details not found in authentication context");
            }
            // get userId using userDetail's function
            long userId = userDetails.getUserId();

            ResponseEntity<String> response = postService.findUserPostHistory(userId, limit, offset);
            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Post {} returned", userId);
                return response;
            } else {
                throw new ResponseStatusException(response.getStatusCode(), "Post not found");
            }
        }
    }