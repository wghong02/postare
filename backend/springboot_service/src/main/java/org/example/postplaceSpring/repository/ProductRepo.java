package org.example.postplaceSpring.repository;

import org.example.postplaceSpring.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductRepo extends JpaRepository<Product, UUID> {
    Page<Product> findByDescriptionContaining(String description, Pageable pageable);
    Page<Product> findAll(Pageable pageable);
}
