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
public class CommentService {
    // connect directly to go BE to get data from be using RESTAPI
    private final RestTemplate restTemplate;
    private final String goServiceUrl;

    @Autowired
    public CommentService(RestTemplate restTemplate, Environment env) {

        this.restTemplate = restTemplate;
        this.goServiceUrl = env.getProperty("GO_BACKEND_URL");
    }

    public ResponseEntity<String> findCommentsByPostId(UUID postId, int limit, int offset) {
        String url = goServiceUrl + "/public/comments/postID/" + postId + "?limit=" + limit + "&offset=" + offset;
        try {
            return restTemplate.getForEntity(url, String.class);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceNotFoundException("Comments not found with PostId: " + postId, ex);
        }
    }

    public ResponseEntity<String> createComment(String commentJson, long userId) {
        String url = goServiceUrl + "/user/comments/upload";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-User-ID", String.valueOf(userId));

        HttpEntity<String> request = new HttpEntity<>(commentJson, headers);
        return restTemplate.postForEntity(url, request, String.class);
    }


    public void deleteCommentByCommentId(long commentId, long userId) {
        String url = goServiceUrl + "/user/comments/delete/" + commentId ;
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-ID", String.valueOf(userId));
        HttpEntity<String> request = new HttpEntity<>(headers);
        try {
            restTemplate.exchange(url, HttpMethod.DELETE, request, Void.class);
        }catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceBadRequestException("Comment not found with id: " + commentId, ex);
        }
    }

    public ResponseEntity<String> findSubCommentsByCommentId(long commentId, int limit, int offset) {
        String url = goServiceUrl + "/public/subComments/commentID/" + commentId + "?limit=" + limit + "&offset=" + offset;
        try {
            return restTemplate.getForEntity(url, String.class);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceNotFoundException("Sub comments not found with CommentId: " + commentId, ex);
        }
    }

    public ResponseEntity<String> createSubComment(String subCommentJson, long userId) {
        String url = goServiceUrl + "/user/subComments/upload";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-User-ID", String.valueOf(userId));

        HttpEntity<String> request = new HttpEntity<>(subCommentJson, headers);
        return restTemplate.postForEntity(url, request, String.class);
    }


    public void deleteSubCommentBySubCommentId(long subCommentId, long userId) {
        String url = goServiceUrl + "/user/subComments/delete/" + subCommentId;
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-ID", String.valueOf(userId));
        HttpEntity<String> request = new HttpEntity<>(headers);
        try {
            restTemplate.exchange(url, HttpMethod.DELETE, request, Void.class);
        }catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceBadRequestException("Sub Comment not found with id: " + subCommentId, ex);
        }
    }

    public ResponseEntity<String> getCommentCountByPostId(UUID postId, boolean isTotal) {
        String url = goServiceUrl + "/public/count/comment/postID/" + postId + "?isTotal=" + isTotal;
        try {
            return restTemplate.getForEntity(url, String.class);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceNotFoundException("Comments not found with PostId: " + postId, ex);
        }
    }

    public ResponseEntity<String> getSubCommentCountByCommentId(long commentId) {
        String url = goServiceUrl + "/public/count/subComment/commentID/" + commentId;
        try {
            return restTemplate.getForEntity(url, String.class);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceNotFoundException("Sub comments not found with CommentId: " + commentId, ex);
        }
    }
}
