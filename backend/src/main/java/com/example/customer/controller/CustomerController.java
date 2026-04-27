package com.example.customer.controller;

import com.example.customer.dto.BulkResultDTO;
import com.example.customer.dto.CustomerDTO;
import com.example.customer.service.BulkImportService;
import com.example.customer.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*") // For local development simplicity
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService service;
    private final BulkImportService bulkService;

    @PostMapping
    public ResponseEntity<CustomerDTO> create(@Valid @RequestBody CustomerDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createCustomer(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> update(@PathVariable Long id, @Valid @RequestBody CustomerDTO dto) {
        return ResponseEntity.ok(service.updateCustomer(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(service.getCustomer(id));
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAll() {
        return ResponseEntity.ok(service.getAllCustomers());
    }

    @PostMapping("/bulk")
    public ResponseEntity<BulkResultDTO> bulkUpload(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(bulkService.processFile(file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
