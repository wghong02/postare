package org.example.postplaceSpring.repository;

import org.example.postplaceSpring.entity.Orderinfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderinfoRepo extends JpaRepository<Orderinfo, Long> {
}
