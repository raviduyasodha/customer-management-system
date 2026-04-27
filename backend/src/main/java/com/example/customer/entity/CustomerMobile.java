package com.example.customer.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customer_mobile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerMobile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false)
    private String mobile;
}
