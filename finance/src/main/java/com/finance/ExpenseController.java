package com.finance;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finance.domain.Budget;
import com.finance.domain.Expense;
import com.finance.domain.User;

@RestController
@RequestMapping("/expense")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    // Fetch daily expenses
    @GetMapping("/daily/{userId}")
    public List<Expense> getDailyExpenses(@PathVariable Long userId) {
        return expenseRepository.findDailyExpenseByUserId(userId);
    }

    // Fetch weekly expenses
    @GetMapping("/weekly/{userId}")
    public ResponseEntity<List<Expense>> getWeeklyExpenses(@PathVariable Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(java.time.DayOfWeek.SUNDAY));

        List<Expense> expenses = expenseRepository.findExpenseByUserIdAndDateRange(userId, startOfWeek, endOfWeek);
        return new ResponseEntity<>(expenses, HttpStatus.OK);
    }

    // Fetch monthly expenses
    @GetMapping("/monthly/{userId}")
    public ResponseEntity<List<Expense>> getMonthlyExpenses(@PathVariable Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endOfMonth = today.with(TemporalAdjusters.lastDayOfMonth());
        List<Expense> expenses = expenseRepository.findExpenseByUserIdAndDateRange(userId, startOfMonth, endOfMonth);

        return new ResponseEntity<>(expenses, HttpStatus.OK);
    }

    // Save an Expense Record
    @PostMapping("/add/{userId}")
    public ResponseEntity<Expense> addExpense(@PathVariable Long userId, @RequestBody Expense expenseData) {
        expenseData.setDate(LocalDate.now());

        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        User user = userOptional.get();

        BigDecimal totalIncome = incomeRepository.getTotalIncomeByUserId(userId).orElse(BigDecimal.ZERO);
        BigDecimal totalExpense = expenseRepository.getTotalExpensesByUserId(userId).orElse(BigDecimal.ZERO);
        BigDecimal projectedExpenseTotal = totalExpense.add(expenseData.getAmount());

        if (expenseData.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else if (totalIncome.compareTo(BigDecimal.ZERO) == 0) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else if (projectedExpenseTotal.compareTo(totalIncome) > 0) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Forbidden if expense would exceed income
        } else {
            expenseData.setUser(user);
            Expense savedExpense = expenseRepository.save(expenseData);
            Optional<Budget> budgetData = budgetRepository.findByCategoryAndUserId(userId, savedExpense.getCategory());
            if(budgetData.isPresent()){
                Budget budget = budgetData.get();
                BigDecimal totalSpent = expenseRepository.getTotalExpenseByCategory(userId, savedExpense.getCategory()).orElse(BigDecimal.ZERO);
                budget.setSpent(totalSpent);
                budgetRepository.save(budget);
            }
            return new ResponseEntity<>(savedExpense, HttpStatus.CREATED); // Return saved expense
        }
    }

    // Update expense
    @PutMapping("/update/{userId}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long userId, @RequestBody Expense expenseData) {
        Optional<Expense> existingExpense = expenseRepository.findByIdAndUserId(expenseData.getId(), userId);
        if (existingExpense.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (expenseData.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Expense updatedExpense = existingExpense.get();
        updatedExpense.setAmount(expenseData.getAmount());
        updatedExpense.setCategory(expenseData.getCategory());

        expenseRepository.save(updatedExpense);
        Optional<Budget> budgetData = budgetRepository.findByCategoryAndUserId(userId, updatedExpense.getCategory());
            if(budgetData.isPresent()){
                Budget budget = budgetData.get();
                BigDecimal totalSpent = expenseRepository.getTotalExpenseByCategory(userId, updatedExpense.getCategory()).orElse(BigDecimal.ZERO);
                budget.setSpent(totalSpent);
                budgetRepository.save(budget);
            }
        return new ResponseEntity<>(updatedExpense, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/{expenseId}")
    public ResponseEntity<String> deleteExpense(@PathVariable Long userId, @PathVariable Long expenseId) {
        try {
            Optional<Expense> expense = expenseRepository.findByIdAndUserId(expenseId, userId);
            if (expense.isPresent()) {
                expenseRepository.deleteByIdAndUserId(expenseId, userId);
                Optional<Budget> budgetData = budgetRepository.findByCategoryAndUserId(userId, expense.get().getCategory());
                if(budgetData.isPresent()){
                    Budget budget = budgetData.get();
                    BigDecimal totalSpent = expenseRepository.getTotalExpenseByCategory(userId, expense.get().getCategory()).orElse(BigDecimal.ZERO);
                    budget.setSpent(totalSpent);
                    budgetRepository.save(budget);
                }
                
                
                return new ResponseEntity<>("Expense Deleted", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Expense not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            // Log the exception to see the details
            e.printStackTrace();
            return new ResponseEntity<>("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // fetch latest 3 income
    @GetMapping("/latest/{userId}")
    public ResponseEntity<List<Expense>> getLatestExpenses(@PathVariable Long userId) {
        Pageable pageable = PageRequest.of(0, 3); // Fetch 3 latest expenses
        List<Expense> latestExpenses = expenseRepository.findLatestExpensesByUserId(userId, pageable);
        return ResponseEntity.ok(latestExpenses);
    }

    // weeklyreport
    @GetMapping("/weekly/categories/{userId}")
    public ResponseEntity<Map<String, BigDecimal>> getWeeklyCategoryExpenses(@PathVariable Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(java.time.DayOfWeek.SUNDAY));

        List<Expense> expenses = expenseRepository.findExpenseByUserIdAndDateRange(userId, startOfWeek, endOfWeek);

        // Create a map to store total expenses for each category
        Map<String, BigDecimal> categorySums = new HashMap<>();
        for (Expense expense : expenses) {
            String category = expense.getCategory();
            categorySums.put(category, categorySums.getOrDefault(category, BigDecimal.ZERO).add(expense.getAmount()));
        }

        return ResponseEntity.ok(categorySums);
    }

    @GetMapping("/monthly/categories/{userId}")
    public ResponseEntity<Map<String, Map<String, BigDecimal>>> getMonthlyCategoryExpenses(@PathVariable Long userId) {
        LocalDate oneYearAgo = LocalDate.now().minusMonths(11).withDayOfMonth(1); // Start date for past 12 months

        // Query database for monthly expenses grouped by category
        List<Map<String, Object>> rawData = expenseRepository.findMonthlyExpenseByCategory(userId, oneYearAgo);

        Map<String, Map<String, BigDecimal>> monthlyCategoryExpenses = new HashMap<>();
        for (Map<String, Object> entry : rawData) {
            int monthValue = (int) entry.get("month");
            String category = (String) entry.get("category");
            BigDecimal total = (BigDecimal) entry.get("total");

            // Format month as "Jan", "Feb", etc.
            String monthName = LocalDate.of(LocalDate.now().getYear(), monthValue, 1)
                    .getMonth()
                    .getDisplayName(java.time.format.TextStyle.SHORT, java.util.Locale.ENGLISH);

            monthlyCategoryExpenses.putIfAbsent(monthName, new HashMap<>());
            monthlyCategoryExpenses.get(monthName).put(category, total);
        }

        return ResponseEntity.ok(monthlyCategoryExpenses);
    }
    

    @GetMapping("/total/{userId}/{category}")
    public ResponseEntity<BigDecimal> getTotalExpenseByCategory(
            @PathVariable Long userId, @PathVariable String category) {
        
        Optional<BigDecimal> totalExpense = expenseRepository.getTotalExpenseByCategoryForCurrentMonth(userId, category);
        
        if (totalExpense.isPresent()) {
            return new ResponseEntity<>(totalExpense.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}