package org.example.postplaceSpring.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "orders")
public record Orderinfo(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "orderid", updatable = false, nullable = false)
        long orderinfoId,

        @JsonProperty("seller_id")
        @Column(name = "sellerid", nullable = false)
        long sellerId,

        @JsonProperty("buyer_id")
        @Column(name = "buyerid", nullable = false)
        long buyerId,

        @JsonProperty("date_time")
        @Column(name = "datetime", nullable = false)
        @Temporal(TemporalType.TIMESTAMP)
        Date date,

        @JsonProperty("price_total")
        @Column(name = "pricetotal", nullable = false)
        double priceTotal
) {}
