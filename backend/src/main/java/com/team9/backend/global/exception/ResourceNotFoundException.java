package com.team9.backend.global.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// 요청한 리소스를 찾을 수 없을 때 발생하는 예외 클래스
// 존재하지 않는 사용자 ID, Username 등으로 조회 시 사용
// HTTP 404 (NOT_FOUND) 응답을 반환

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
