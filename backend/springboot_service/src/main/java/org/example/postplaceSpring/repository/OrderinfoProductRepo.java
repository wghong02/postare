package org.example.postplaceSpring.repository;

import org.example.postplaceSpring.entity.OrderinfoProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderinfoProductRepo extends JpaRepository<OrderinfoProduct, Long> {
}
