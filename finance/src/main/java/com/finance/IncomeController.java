package com.finance;

import com.finance.domain.Income;
import com.finance.domain.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable; 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/income")
public class IncomeController {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private UserRepository userRepository;

    // Fetch daily income
    @GetMapping("/daily/{userId}")
    public List<Income> getDailyIncome(@PathVariable Long userId) {
        return incomeRepository.findDailyIncomeByUserId(userId);
    }

    @GetMapping("/weekly/{userId}")
    public ResponseEntity<List<Income>> getWeeklyIncome(@PathVariable Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(java.time.DayOfWeek.SUNDAY));

        List<Income> incomes = incomeRepository.findIncomeByUserIdAndDateRange(userId, startOfWeek, endOfWeek);
        System.out.println("Start of week: " + startOfWeek);
        System.out.println("End of week: " + endOfWeek);
        System.out.println("Income List: " + incomes);
        return new ResponseEntity<>(incomes, HttpStatus.OK);
    }

    // Fetch monthly income
    @GetMapping("/monthly/{userId}")
    public ResponseEntity<List<Income>> getMonthlyIncome(@PathVariable Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endOfMonth = today.with(TemporalAdjusters.lastDayOfMonth());
        List<Income> incomes = incomeRepository.findIncomeByUserIdAndDateRange(userId, startOfMonth, endOfMonth);

        return new ResponseEntity<>(incomes, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/{incomeId}")
    public ResponseEntity<String> deleteIncome(@PathVariable Long userId, @PathVariable Long incomeId) {
        try {
            Optional<Income> income = incomeRepository.findByIdAndUserId(incomeId, userId);
            if (income.isPresent()) {
                incomeRepository.deleteByIdAndUserId(incomeId, userId);
                return new ResponseEntity<>("Income Deleted", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Income not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            // Log the exception to see the details
            e.printStackTrace();
            return new ResponseEntity<>("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Save an income Record
    @PostMapping("/add/{userId}")
    public ResponseEntity<Income> addIncome(@PathVariable Long userId, @RequestBody Income incomeData) {
        incomeData.setDate(LocalDate.now()); // Set current date

        // Retrieve the User directly using UserRepository
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (incomeData.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        incomeData.setUser(userOptional.get()); // Set the User to the Income
        Income savedIncome = incomeRepository.save(incomeData);
        return new ResponseEntity<>(savedIncome, HttpStatus.CREATED); // Return saved Income
    }

    // Update income
    @PutMapping("/update/{userId}")
    public ResponseEntity<Income> updateIncome(@PathVariable Long userId, @RequestBody Income incomeData) {
        Optional<Income> existingIncome = incomeRepository.findByIdAndUserId(incomeData.getId(), userId);
        if (existingIncome.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (incomeData.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Income updatedIncome = existingIncome.get();
        updatedIncome.setAmount(incomeData.getAmount());
        updatedIncome.setCategory(incomeData.getCategory());

        incomeRepository.save(updatedIncome);
        return new ResponseEntity<>(updatedIncome, HttpStatus.OK);
    }

    @GetMapping("/latest/{userId}")
    public ResponseEntity<List<Income>> getLatestIncomes(@PathVariable Long userId) {
        Pageable pageable = PageRequest.of(0, 3); // Fetch the first 3 records
        List<Income> latestIncomes = incomeRepository.findLatestIncomesByUserId(userId, pageable);
        return new ResponseEntity<>(latestIncomes, HttpStatus.OK);
    }

}