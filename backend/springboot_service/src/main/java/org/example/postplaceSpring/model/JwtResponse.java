package org.example.postplaceSpring.model;

import java.io.Serializable;

public class JwtResponse implements Serializable {
    // model for jwt response, a token

    private static final long serialVersionUID = -8091879091924046844L;
    private final String jwtToken;

    public JwtResponse(String jwttoken) {
        this.jwtToken = jwttoken;
    }

    public String getToken() {
        return this.jwtToken;
    }
}
