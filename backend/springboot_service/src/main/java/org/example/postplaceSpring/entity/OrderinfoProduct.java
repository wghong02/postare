package org.example.postplaceSpring.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "OrderProducts")
public record OrderinfoProduct(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "detailid", updatable = false, nullable = false)
        long orderinfoProductId,

        @JsonProperty("order_id")
        @Column(name = "orderid", nullable = false)
        long orderinfoId,

        @JsonProperty("product_id")
        @Column(name = "productid", nullable = false)
        UUID productId
) {}
