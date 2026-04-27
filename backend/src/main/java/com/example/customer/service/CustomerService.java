package com.example.customer.service;

import com.example.customer.dto.AddressDTO;
import com.example.customer.dto.CustomerDTO;
import com.example.customer.entity.*;
import com.example.customer.exception.DuplicateNicException;
import com.example.customer.exception.ResourceNotFoundException;
import com.example.customer.repository.CityRepository;
import com.example.customer.repository.CountryRepository;
import com.example.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepo;
    private final CityRepository cityRepo;
    private final CountryRepository countryRepo;

    public CustomerDTO createCustomer(CustomerDTO dto) {
        if (customerRepo.existsByNicNumber(dto.getNicNumber())) {
            throw new DuplicateNicException("NIC already exists: " + dto.getNicNumber());
        }
        Customer customer = mapToEntity(dto);
        return mapToDTO(customerRepo.save(customer));
    }

    public CustomerDTO updateCustomer(Long id, CustomerDTO dto) {
        Customer customer = customerRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        
        updateEntityFromDTO(customer, dto);
        return mapToDTO(customerRepo.save(customer));
    }

    @Transactional(readOnly = true)
    public CustomerDTO getCustomer(Long id) {
        return customerRepo.findById(id)
            .map(this::mapToDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
    }

    @Transactional(readOnly = true)
    public List<CustomerDTO> getAllCustomers() {
        return customerRepo.findAllWithDetails()
            .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public void deleteCustomer(Long id) {
        if (!customerRepo.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found");
        }
        customerRepo.deleteById(id);
    }

    private Customer mapToEntity(CustomerDTO dto) {
        Customer customer = new Customer();
        updateEntityFromDTO(customer, dto);
        return customer;
    }

    private void updateEntityFromDTO(Customer customer, CustomerDTO dto) {
        customer.setName(dto.getName());
        customer.setDob(dto.getDob());
        customer.setNicNumber(dto.getNicNumber());

        // Update Mobiles
        if (dto.getMobiles() != null) {
            customer.getMobiles().clear();
            for (String mobile : dto.getMobiles()) {
                CustomerMobile m = new CustomerMobile();
                m.setMobile(mobile);
                m.setCustomer(customer);
                customer.getMobiles().add(m);
            }
        }

        // Update Addresses
        if (dto.getAddresses() != null) {
            customer.getAddresses().clear();
            for (AddressDTO aDto : dto.getAddresses()) {
                CustomerAddress a = new CustomerAddress();
                a.setAddressLine1(aDto.getAddressLine1());
                a.setAddressLine2(aDto.getAddressLine2());
                if (aDto.getCityId() != null) {
                    City city = cityRepo.findById(aDto.getCityId()).orElse(null);
                    if (city != null) {
                        a.setCity(city);
                        a.setCountry(city.getCountry()); // Explicitly set from the city table
                    }
                }
                a.setCustomer(customer);
                customer.getAddresses().add(a);
            }
        }

        // Update Family Members (ID based)
        if (dto.getFamilyMemberIds() != null) {
            List<Customer> family = customerRepo.findAllById(dto.getFamilyMemberIds());
            customer.setFamilyMembers(new HashSet<>(family));
        }
    }

    private CustomerDTO mapToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setDob(customer.getDob());
        dto.setNicNumber(customer.getNicNumber());
        
        dto.setMobiles(customer.getMobiles().stream()
            .map(CustomerMobile::getMobile)
            .collect(Collectors.toList()));
        
        dto.setAddresses(customer.getAddresses().stream()
            .map(a -> new AddressDTO(
                a.getId(),
                a.getAddressLine1(),
                a.getAddressLine2(),
                a.getCity() != null ? a.getCity().getId() : null,
                a.getCity() != null && a.getCity().getCountry() != null ? a.getCity().getCountry().getId() : null,
                a.getCity() != null ? a.getCity().getName() : null,
                a.getCity() != null && a.getCity().getCountry() != null ? a.getCity().getCountry().getName() : null
            ))
            .collect(Collectors.toList()));
        
        dto.setFamilyMemberIds(customer.getFamilyMembers().stream()
            .map(Customer::getId)
            .collect(Collectors.toList()));
            
        return dto;
    }
}
