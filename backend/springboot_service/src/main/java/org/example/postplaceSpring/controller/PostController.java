    package org.example.postplaceSpring.controller;

    import org.example.postplaceSpring.service.PostService;
    import org.example.postplaceSpring.service.CustomUserDetails;
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.core.annotation.AuthenticationPrincipal;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.multipart.MultipartFile;
    import org.springframework.web.server.ResponseStatusException;

    import java.io.IOException;
    import java.util.UUID;

    @RestController
    public class PostController {

        private final PostService postService;

        private static final Logger logger = LoggerFactory.getLogger(PostController.class);

        @Autowired
        // automatically inject dependency here
        public PostController(PostService postService) {
            this.postService = postService;
        }

        @GetMapping("/posts/{postId}")
        public ResponseEntity<String> getIdPost(@PathVariable UUID postId) {
            logger.info("Received Get request for /post/{postId}");
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
            logger.info("Received Get request for /search");
            return postService.findPostsByDescription(description, limit, offset);
        }

        @PostMapping("/user/posts/upload")
        public ResponseEntity<String> uploadPost( @RequestParam("title") String title,
                                                  @RequestParam("description") String description,
                                                  @RequestParam("postDetails") String postDetails,
                                                  @RequestParam("imageFile") MultipartFile image,
                                                  @AuthenticationPrincipal CustomUserDetails userDetails) throws IOException {
            logger.info("Received Post request for /user/posts/upload");
            // Get the authenticated user's details
            if (userDetails == null) {
                throw new IllegalStateException("User details not found in authentication context");
            }
            long userId = userDetails.getUserId();
            // Pass the post file and userId to the service layer
            return postService.createPost(title, description, postDetails, image, userId);
        }

        @DeleteMapping("/user/posts/delete/{postId}")
        public ResponseEntity<Void> deletePost(@PathVariable UUID postId,
                                               @AuthenticationPrincipal CustomUserDetails userDetails) {
            logger.info("Received Delete request for /user/posts/delete/{postId}");
            if (userDetails == null) {
                throw new IllegalStateException("User details not found in authentication context");
            }
            long userId = userDetails.getUserId();
            postService.deletePostByPostId(postId, userId);
            return ResponseEntity.noContent().build();
        }

        @PostMapping("/posts/increasePostView/{postId}")
        public ResponseEntity<Void> increaseViewsByPostId(@PathVariable UUID postId) {
            logger.info("Received Delete request for /user/posts/delete/{postId}");

            postService.increaseViewsByPostId(postId);
            return ResponseEntity.noContent().build();
        }

        @GetMapping("/posts/get/most/{attribute}")
        public ResponseEntity<String> getMostInOneAttributePosts(
                @PathVariable String attribute,
                @RequestParam(defaultValue = "30") int limit,
                @RequestParam(defaultValue = "0") int offset) {
            logger.info("Received Get request for /posts/get/most/{attribute}");
            return postService.findMostInOneAttributePosts(limit, offset, attribute);
        }

        @GetMapping("/user/get/postHistory")
        public ResponseEntity<String> getUserPostHistory(
                @AuthenticationPrincipal CustomUserDetails userDetails,
                @RequestParam(defaultValue = "30") int limit,
                @RequestParam(defaultValue = "0") int offset) {
            logger.info("Received Get request for /user/get/postHistory");
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

        @GetMapping("/public/get/postHistory/{userId}")
        public ResponseEntity<String> getUserPublicInfo( // call user details related if authed
                                                         @RequestParam(defaultValue = "30") int limit,
                                                         @RequestParam(defaultValue = "0") int offset,
                                                         @PathVariable long userId) {
            logger.info("Received Get request for /public/get/postHistory/{userId}");
            ResponseEntity<String> response = postService.findUserPostHistory(userId, limit, offset);
            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Post {} returned", userId);
                return response;
            } else {
                throw new ResponseStatusException(response.getStatusCode(), "Post not found");
            }
        }

        @GetMapping("/user/posts/get/liked")
        public ResponseEntity<String> getLikesByUser(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                       @RequestParam(defaultValue = "10") int limit,
                                                       @RequestParam(defaultValue = "0") int offset) {
            logger.info("Received Get request for /user/posts/get/liked");
            // Get the authenticated user's details
            if (userDetails == null) {
                throw new IllegalStateException("User details not found in authentication context");
            }
            long userId = userDetails.getUserId();
            ResponseEntity<String> response = postService.findLikedPostsByUserId(userId, limit, offset);
            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Post {} returned", userId);
                return response;
            } else {
                throw new ResponseStatusException(response.getStatusCode(), "Posts not found");
            }
        }
    }