package com.example.customer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateNicException extends RuntimeException {
    public DuplicateNicException(String message) {
        super(message);
    }
}
