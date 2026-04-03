package com.ivanfranchin.orderapi.common.controller;

import com.ivanfranchin.orderapi.order.service.OrderService;
import com.ivanfranchin.orderapi.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/public")
public class PublicController {

    private final UserService userService;
    private final OrderService orderService;

    @GetMapping("/numberOfUsers")
    public Long getNumberOfUsers() {
        return userService.countUsersByRole("USER");
    }

    @GetMapping("/numberOfOrders")
    public Integer getNumberOfOrders() {
        return orderService.getOrders().size();
    }
}