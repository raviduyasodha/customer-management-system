package com.example.customer.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    private Long id;
    private String name;
    private LocalDate dob;
    private String nicNumber;
    private List<String> mobiles;
    private List<AddressDTO> addresses;
    private List<Long> familyMemberIds;
}
