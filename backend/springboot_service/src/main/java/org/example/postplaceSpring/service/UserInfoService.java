package org.example.postplaceSpring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class UserInfoService {
    // connect directly to go BE to get data from be using RESTAPI
    private final RestTemplate restTemplate;
    private final String GO_SERVICE_URL = "http://localhost:8081";

    @Autowired
    public UserInfoService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<String> getUserInfoById(long userId) {
        String url = GO_SERVICE_URL + "/users/" + userId;
        return restTemplate.getForEntity(url, String.class);
    }
}