package com.example.customer.repository;

import com.example.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByNicNumber(String nicNumber);
    Optional<Customer> findByNicNumber(String nicNumber);

    @Query("SELECT DISTINCT c FROM Customer c " +
           "LEFT JOIN FETCH c.mobiles " +
           "LEFT JOIN FETCH c.addresses a " +
           "LEFT JOIN FETCH a.city " +
           "LEFT JOIN FETCH a.country " +
           "LEFT JOIN FETCH c.familyMembers")
    List<Customer> findAllWithDetails();
}
