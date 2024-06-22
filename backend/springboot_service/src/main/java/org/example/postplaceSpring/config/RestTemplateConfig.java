package org.example.postplaceSpring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {
    // to call rest API end points of microservices
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}