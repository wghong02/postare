package org.example.postplaceSpring.service;

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
        String url= goServiceUrl + "/public/userInfo/userID/" + userId ;;

        try {
            return restTemplate.getForEntity(url, String.class);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceNotFoundException("User not found with id: " + userId, ex);
        }
    }

    public ResponseEntity<String> findLikedUsersByPostId(UUID postId, int limit, int offset) {
        String url = goServiceUrl + "/public/userInfo/userLikes/" + postId + "?limit=" + limit + "&offset=" + offset;
        try {
            return restTemplate.getForEntity(url, String.class);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceNotFoundException("User info not found liked PostId: " + postId, ex);
        }
    }

    public ResponseEntity<String> updateUserInfo(String userEmail, String userPhone, String nickname,
                                                 String bio, MultipartFile profilePicture, long userId) throws IOException {
        String url = goServiceUrl + "/user/userinfo/update";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("X-User-ID", String.valueOf(userId));

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("userEmail", userEmail);
        body.add("userPhone", userPhone);
        body.add("nickname", nickname);
        body.add("bio", bio);
        if (profilePicture!=null){
            body.add("profilePicture", new ByteArrayResource(profilePicture.getBytes()) {
                @Override
                public String getFilename() {
                    return profilePicture.getOriginalFilename();
                }
            });
        } else {
            body.add("profilePicture",null);
        }
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                String.class
        );
        return new ResponseEntity<>(response.getBody(), response.getStatusCode());
    }
}