package org.example.postplaceSpring.service;

import org.example.postplaceSpring.exceptions.ResourceBadRequestException;
import org.example.postplaceSpring.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
public class LikeService {
    // connect directly to go BE to get data from be using RESTAPI
    private final RestTemplate restTemplate;
    private final String goServiceUrl; // Replace with your Go service URL

    @Autowired
    public LikeService(RestTemplate restTemplate, Environment env) {

        this.restTemplate = restTemplate;
        this.goServiceUrl = env.getProperty("GO_BACKEND_URL");
    }

    public ResponseEntity<String> findLikesByPostId(UUID postId, int limit, int offset) {
        String url = goServiceUrl + "/public/getLikesByPost/" + postId + "?limit=" + limit + "&offset=" + offset;
        try {
            return restTemplate.getForEntity(url, String.class);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceNotFoundException("Likes not found with PostId: " + postId, ex);
        }
    }

    public ResponseEntity<String> findLikesByUserId(long userId, int limit, int offset) {
        String url = goServiceUrl + "/user/getLikesByUser/" + "?limit=" + limit + "&offset=" + offset;
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-ID", String.valueOf(userId));
        HttpEntity<String> request = new HttpEntity<>(headers);
        try {
            return restTemplate.getForEntity(url, String.class, request);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceNotFoundException("Likes not found with UserId: " + userId, ex);
        }
    }

    public ResponseEntity<String> createLike(String likeJson, long userId) {
        String url = goServiceUrl + "/user/likes/upload";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-User-ID", String.valueOf(userId));

        HttpEntity<String> request = new HttpEntity<>(likeJson, headers);
        return restTemplate.postForEntity(url, request, String.class);
    }

    public String checkLike(long userId, UUID postId) {
        String url = goServiceUrl + "/user/likes/check/" + postId;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-User-ID", String.valueOf(userId));

        HttpEntity<String> request = new HttpEntity<>(headers);
        // Make the request and get the response
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

        // Extract and return the boolean value from the response
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            // Read the response body directly as a string
            return responseEntity.getBody(); // return the plain text response
        } else {
            // Handle other status codes or errors as needed
            throw new RuntimeException("Failed to check like");
        }
    }


    public void deleteLike(long userId, UUID postId) {
        String url = goServiceUrl + "/user/likes/delete/" + postId ;
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-ID", String.valueOf(userId));
        HttpEntity<String> request = new HttpEntity<>(headers);
        try {
            restTemplate.exchange(url, HttpMethod.DELETE, request, Void.class);
        }catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceBadRequestException("Like not found with post: " + postId + " and user " + userId, ex);
        }
    }

//    public ResponseEntity<String> getLikeCountByPostId(UUID postId) {
//        String url = goServiceUrl + "/public/getLikesCount/" + postId;
//        try {
//            return restTemplate.getForEntity(url, String.class);
//        } catch (HttpClientErrorException.NotFound ex) {
//            throw new ResourceNotFoundException("Like not found with PostId: " + postId, ex);
//        }
//    }

}
