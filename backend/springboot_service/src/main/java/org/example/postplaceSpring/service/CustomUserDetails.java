package org.example.postplaceSpring.service;

import org.example.postplaceSpring.entity.UserAuth;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserDetails implements UserDetails {
    // the user info required for auth
    // user userid as the encrypted user info

    private final UserAuth userAuth;
    private final long userId;

    public CustomUserDetails(UserAuth userAuth, long userId) {
        this.userAuth = userAuth;
        this.userId = userId;
    }

    public long getUserId() {
        return userId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return userAuth.getEncodedPassword();
    }

    @Override
    public String getUsername() {
        return userAuth.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CustomUserDetails that = (CustomUserDetails) o;

        return userAuth.getUsername().equals(that.userAuth.getUsername());
    }

    @Override
    public int hashCode() {
        return userAuth.getUsername().hashCode();
    }
}
