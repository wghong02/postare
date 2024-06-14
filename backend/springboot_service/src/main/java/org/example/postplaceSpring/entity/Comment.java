package org.example.postplaceSpring.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "comments")
public class Comment {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "commentid", updatable = false, nullable = false)
        private long commentId;

        @JsonProperty("buyer_id")
        @Column(name = "buyerid", nullable = false)
        private long buyerId;

        @Column(name = "comment", nullable = false, length = 1000)
        private String comment;

        @JsonProperty("product_id")
        @Column(name = "productid", nullable = false)
        private UUID productId;

        @JsonProperty("seller_id")
        @Column(name = "sellerid", nullable = false)
        private long sellerId;

        // Getters and Setters

        public long getCommentId() {
                return commentId;
        }

        public void setCommentId(long commentId) {
                this.commentId = commentId;
        }

        public long getBuyerId() {
                return buyerId;
        }

        public void setBuyerId(long buyerId) {
                this.buyerId = buyerId;
        }

        public String getComment() {
                return comment;
        }

        public void setComment(String comment) {
                this.comment = comment;
        }

        public UUID getProductId() {
                return productId;
        }

        public void setProductId(UUID productId) {
                this.productId = productId;
        }

        public long getSellerId() {
                return sellerId;
        }

        public void setSellerId(long sellerId) {
                this.sellerId = sellerId;
        }
}
