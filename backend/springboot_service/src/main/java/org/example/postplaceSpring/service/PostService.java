package org.example.postplaceSpring.service;

import org.example.postplaceSpring.exceptions.ResourceBadRequestException;
import org.example.postplaceSpring.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.UUID;

@Service
public class PostService {

    // connect directly to go BE to get data from be using RESTAPI
    private final RestTemplate restTemplate;
    private final String goServiceUrl; // Replace with your Go service URL

    @Autowired
    public PostService(RestTemplate restTemplate, Environment env) {

        this.restTemplate = restTemplate;
        this.goServiceUrl = env.getProperty("GO_BACKEND_URL");
    }

    public ResponseEntity<String> findPostById(UUID postId) {
        String url = goServiceUrl + "/posts/" + postId;
        try {
            return restTemplate.getForEntity(url, String.class);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceNotFoundException("Post not found with id: " + postId, ex);
        }
    }

    public ResponseEntity<String> findPostsByDescription(String description, int limit, int offset) {
        String url = goServiceUrl + "/search?description=" + description + "&limit=" + limit + "&offset=" + offset;
        return restTemplate.getForEntity(url, String.class);
    }

    public ResponseEntity<String> createPost(String title,
        String description, String postDetails, MultipartFile image, long userId) throws IOException {
        String url = goServiceUrl + "/user/posts/upload";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("X-User-ID", String.valueOf(userId));

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("title", title);
        body.add("description", description);
        body.add("postDetails", postDetails);
        body.add("image", new ByteArrayResource(image.getBytes()) {
            @Override
            public String getFilename() {
                return image.getOriginalFilename();
            }
        });
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                String.class
        );
        return new ResponseEntity<>(response.getBody(), response.getStatusCode());
    }


    public void deletePostByPostId(UUID postId, long userId) {
        String url = goServiceUrl + "/user/posts/delete/" + postId;
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-ID", String.valueOf(userId));
        HttpEntity<String> request = new HttpEntity<>(headers);
        try {
            restTemplate.exchange(url, HttpMethod.DELETE, request, Void.class);
        }catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceBadRequestException("User not found with id: " + userId, ex);
        }
    }

    public ResponseEntity<String> findMostInOneAttributePosts(int limit, int offset, String attribute) {
        String url = goServiceUrl + "/posts/get/most/" + attribute + "?limit=" + limit + "&offset=" + offset;
        return restTemplate.getForEntity(url, String.class);
    }

    public ResponseEntity<String> findUserPostHistory(long userId, int limit, int offset) {
        String url = goServiceUrl + "/postHistory/" + userId + "?limit=" + limit + "&offset=" + offset;
        return restTemplate.getForEntity(url, String.class);
    }
}