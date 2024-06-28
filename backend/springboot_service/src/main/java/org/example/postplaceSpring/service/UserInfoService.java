package org.example.postplaceSpring.service;

import org.example.postplaceSpring.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class UserInfoService {
    // connect directly to go BE to get data from be using RESTAPI
    private final RestTemplate restTemplate;
    private final String goServiceUrl;

    @Autowired
    public UserInfoService(RestTemplate restTemplate, Environment env) {
        this.restTemplate = restTemplate;
        this.goServiceUrl = env.getProperty("GO_BACKEND_URL");
    }
    public ResponseEntity<String> getUserInfoById(long userId) {
        String url= goServiceUrl + "/users/" + userId ;;

        try {
            return restTemplate.getForEntity(url, String.class);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceNotFoundException("User not found with id: " + userId, ex);
        }
    }
}