package org.example.postplaceSpring.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public record Category(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "categoryid", updatable = false, nullable = false)
        long categoryId,

        @JsonProperty("category_name")
        @Column(name = "categoryname", nullable = false, length = 50)
        String categoryName
) {}
