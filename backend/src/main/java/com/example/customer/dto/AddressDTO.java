package com.example.customer.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {
    private Long id;
    private String addressLine1;
    private String addressLine2;
    private Integer cityId;
    private Integer countryId;
    private String cityName;
    private String countryName;
}
