package com.team9.backend.community.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
public class ValidationErrorResponse {
    private final LocalDateTime timestamp = LocalDateTime.now();
    private final int status;
    private final String error;
    private final String message;

    private final Map<String, String> validationErrors;

    public ValidationErrorResponse(HttpStatus status, String message, Map<String, String> validationErrors) {
        this.status = status.value();
        this.error = status.getReasonPhrase();
        this.message = message;
        this.validationErrors = validationErrors;
    }
}
