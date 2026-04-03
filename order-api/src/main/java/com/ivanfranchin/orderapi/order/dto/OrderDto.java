package com.ivanfranchin.orderapi.order.dto;

import com.ivanfranchin.orderapi.order.entity.Order;

import java.time.Instant;

public record OrderDto(String id, String description, UserDto user, Instant createdAt) {

    public record UserDto(String username) {
    }

    public static OrderDto from(Order order) {
        UserDto userDto = new UserDto(order.getUser().getUsername());
        return new OrderDto(order.getId(), order.getDescription(), userDto, order.getCreatedAt());
    }
}