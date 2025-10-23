package com.team9.backend.community.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class AuthorMismatchException extends RuntimeException {

    public AuthorMismatchException(String message) {
        super(message);
    }
}
