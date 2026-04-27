package com.example.customer.service;

import com.example.customer.dto.CustomerDTO;
import com.example.customer.exception.DuplicateNicException;
import com.example.customer.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class CustomerServiceTest {

    @Autowired private CustomerService service;
    @Autowired private CustomerRepository repo;

    @BeforeEach
    void cleanup() { repo.deleteAll(); }

    @Test
    void createCustomer_success() {
        CustomerDTO dto = new CustomerDTO();
        dto.setName("John Doe");
        dto.setDob(LocalDate.of(1990, 1, 15));
        dto.setNicNumber("901234567V");

        CustomerDTO result = service.createCustomer(dto);

        assertNotNull(result.getId());
        assertEquals("John Doe", result.getName());
    }

    @Test
    void createCustomer_duplicateNic_throwsException() {
        CustomerDTO dto = new CustomerDTO();
        dto.setName("Jane");
        dto.setDob(LocalDate.of(1992, 2, 2));
        dto.setNicNumber("9012345678V");
        
        service.createCustomer(dto);

        assertThrows(DuplicateNicException.class, () -> service.createCustomer(dto));
    }

    @Test
    void updateCustomer_success() {
        CustomerDTO dto = new CustomerDTO();
        dto.setName("Old Name");
        dto.setDob(LocalDate.of(1980, 5, 5));
        dto.setNicNumber("111111111V");
        
        CustomerDTO created = service.createCustomer(dto);
        created.setName("New Name");
        
        CustomerDTO updated = service.updateCustomer(created.getId(), created);
        assertEquals("New Name", updated.getName());
    }
}
