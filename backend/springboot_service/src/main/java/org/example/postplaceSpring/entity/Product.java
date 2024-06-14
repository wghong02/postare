package org.example.postplaceSpring.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "Products")
public class Product {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        @Column(name = "productid", updatable = false, nullable = false)
        private UUID productId;

        @Column(name = "title", nullable = false, length = 255)
        private String title;

        @Column(name = "description", nullable = false, length = 1000)
        private String description;

        @Column(name = "price", nullable = false, columnDefinition = "NUMERIC(10, 2)")
        private double price;

        @JsonProperty("product_location")
        @Column(name = "productlocation", nullable = false, length = 255)
        private String productLocation;

        @JsonProperty("product_details")
        @Column(name = "productdetails", length = 1000)
        private String productDetails;

        @JsonProperty("category_id")
        @Column(name = "categoryid")
        private long categoryId;

        @JsonProperty("seller_id")
        @Column(name = "sellerid", nullable = false)
        private long sellerId;

        @Column(name = "condition", length = 50, nullable = false)
        private String condition;

        @JsonProperty("put_out_time")
        @Temporal(TemporalType.TIMESTAMP)
        @Column(name = "putouttime", nullable = false)
        private Date putOutTime;

        @Column(name = "status", columnDefinition = "status", nullable = false)
        private short status;

        @JsonProperty("image_url")
        @Column(name = "imageurl", nullable = false)
        private String imageUrl;

        @Column(name = "views", nullable = false)
        private long views;

        // Getters and Setters

        public UUID getProductId() {
                return productId;
        }

        public void setProductId(UUID productId) {
                this.productId = productId;
        }

        public String getTitle() {
                return title;
        }

        public void setTitle(String title) {
                this.title = title;
        }

        public String getDescription() {
                return description;
        }

        public void setDescription(String description) {
                this.description = description;
        }

        public double getPrice() {
                return price;
        }

        public void setPrice(double price) {
                this.price = price;
        }

        public String getProductLocation() {
                return productLocation;
        }

        public void setProductLocation(String productLocation) {
                this.productLocation = productLocation;
        }

        public String getProductDetails() {
                return productDetails;
        }

        public void setProductDetails(String productDetails) {
                this.productDetails = productDetails;
        }

        public long getCategoryId() {
                return categoryId;
        }

        public void setCategoryId(long categoryId) {
                this.categoryId = categoryId;
        }

        public long getSellerId() {
                return sellerId;
        }

        public void setSellerId(long sellerId) {
                this.sellerId = sellerId;
        }

        public String getCondition() {
                return condition;
        }

        public void setCondition(String condition) {
                this.condition = condition;
        }

        public Date getPutOutTime() {
                return putOutTime;
        }

        public void setPutOutTime(Date putOutTime) {
                this.putOutTime = putOutTime;
        }

        public short getStatus() {
                return status;
        }

        public void setStatus(short status) {
                this.status = status;
        }

        public String getImageUrl() {
                return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
                this.imageUrl = imageUrl;
        }

        public long getViews() {
                return views;
        }

        public void setViews(long views) {
                this.views = views;
        }

        @Override
        public String toString() {
                return "Product{" +
                        "productId=" + productId +
                        ", title='" + title + '\'' +
                        ", description='" + description + '\'' +
                        ", price=" + price +
                        ", productLocation='" + productLocation + '\'' +
                        ", productDetails='" + productDetails + '\'' +
                        ", categoryId=" + categoryId +
                        ", sellerId=" + sellerId +
                        ", condition='" + condition + '\'' +
                        ", putOutDate=" + putOutTime +
                        ", status=" + status +
                        ", imageUrl='" + imageUrl + '\'' +
                        ", views=" + views +
                        '}';
        }
}
