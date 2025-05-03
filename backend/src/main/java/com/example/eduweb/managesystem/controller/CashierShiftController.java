// src/main/java/com/yourpackage/controller/CashierShiftController.java
package com.example.eduweb.managesystem.controller;

import com.example.eduweb.managesystem.dto.CashierShiftResponseDto;
import com.example.eduweb.managesystem.dto.CloseShiftRequestDto;
import com.example.eduweb.managesystem.dto.StartShiftRequestDto;
import com.example.eduweb.managesystem.service.CashierShiftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cashier-shifts")
@RequiredArgsConstructor // Lombok constructor injection
public class CashierShiftController {

    private final CashierShiftService cashierShiftService;

    @PostMapping("/start")
    public ResponseEntity<CashierShiftResponseDto> startShift(@Valid @RequestBody StartShiftRequestDto requestDto) {
        CashierShiftResponseDto createdShift = cashierShiftService.startShift(requestDto);
        return new ResponseEntity<>(createdShift, HttpStatus.CREATED);
    }

    @PostMapping("/{shiftId}/close")
    public ResponseEntity<CashierShiftResponseDto> closeShift(
            @PathVariable Long shiftId,
            @Valid @RequestBody CloseShiftRequestDto requestDto) {
        CashierShiftResponseDto closedShift = cashierShiftService.closeShift(shiftId, requestDto);
        return ResponseEntity.ok(closedShift);
    }

    @GetMapping("/{shiftId}")
    public ResponseEntity<CashierShiftResponseDto> getShiftById(@PathVariable Long shiftId) {
        CashierShiftResponseDto shift = cashierShiftService.getShiftById(shiftId);
        return ResponseEntity.ok(shift);
    }

    @GetMapping
    public ResponseEntity<List<CashierShiftResponseDto>> getAllShifts() {
        List<CashierShiftResponseDto> shifts = cashierShiftService.getAllShifts();
        return ResponseEntity.ok(shifts);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CashierShiftResponseDto>> getShiftsByUser(@PathVariable Long userId) {
        List<CashierShiftResponseDto> shifts = cashierShiftService.getShiftsByUserId(userId);
        return ResponseEntity.ok(shifts);
    }

    @GetMapping("/user/{userId}/current")
    public ResponseEntity<CashierShiftResponseDto> getCurrentOpenShiftForUser(@PathVariable Long userId) {
        CashierShiftResponseDto currentShift = cashierShiftService.getCurrentOpenShiftByUserId(userId);
        if (currentShift != null) {
            return ResponseEntity.ok(currentShift);
        } else {
            // You could return 404 or 204 No Content depending on preference
            return ResponseEntity.noContent().build();
            // Or: return ResponseEntity.notFound().build();
        }
    }

    // --- Add endpoints for RECONCILE status if needed ---
    // @PostMapping("/{shiftId}/reconcile")
    // public ResponseEntity<?> reconcileShift(@PathVariable Long shiftId /*, DTO if needed */) {
    //    cashierShiftService.reconcileShift(shiftId); // Implement this in service
    //    return ResponseEntity.ok().build();
    // }
}