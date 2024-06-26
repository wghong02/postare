package org.example.postplaceSpring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.util.UUID;

@Service
public class PostService {

    // connect directly to go BE to get data from be using RESTAPI
    private final RestTemplate restTemplate;
    private final String GO_SERVICE_URL = "http://localhost:8081"; // Replace with your Go service URL

    @Autowired
    public PostService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<String> findPostById(UUID postId) {
        String url = GO_SERVICE_URL + "/posts/" + postId;
        return restTemplate.getForEntity(url, String.class);
    }

    public ResponseEntity<String> findPostsByDescription(String description, int limit, int offset) {
        String url = GO_SERVICE_URL + "/search?description=" + description + "&limit=" + limit + "&offset=" + offset;
        return restTemplate.getForEntity(url, String.class);
    }

    public ResponseEntity<String> createPost(String postJson, long userId) {
        String url = GO_SERVICE_URL + "/user/posts/upload";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-User-ID", String.valueOf(userId));
        HttpEntity<String> request = new HttpEntity<>(postJson, headers);
        return restTemplate.postForEntity(url, request, String.class);
    }

    public void deletePostByPostId(UUID postId, long userId) {
        String url = GO_SERVICE_URL + "/user/posts/delete/" + postId;
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-ID", String.valueOf(userId));
        HttpEntity<String> request = new HttpEntity<>(headers);
        restTemplate.exchange(url, HttpMethod.DELETE, request, Void.class);
    }

    public ResponseEntity<String> findMostInOneAttributePosts(int limit, int offset, String attribute) {
        String url = GO_SERVICE_URL + "/posts/get/most/" + attribute + "?limit=" + limit + "&offset=" + offset;
        return restTemplate.getForEntity(url, String.class);
    }

    public ResponseEntity<String> findUserPostHistory(long userId, int limit, int offset) {
        String url = GO_SERVICE_URL + "/postHistory/" + userId + "?limit=" + limit + "&offset=" + offset;
        return restTemplate.getForEntity(url, String.class);
    }
}