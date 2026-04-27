package com.example.customer.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkResultDTO {
    private int success;
    private int failed;
}
