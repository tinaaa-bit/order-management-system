package com.ivanfranchin.orderapi.order.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record CreateOrderRequest(@Schema(example = "Buy two iPhones") @NotBlank String description) {
}
