package com.finance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
public class BalanceService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    public BigDecimal getCurrentBalance(Long userId) {

        BigDecimal totalIncome = incomeRepository.getTotalIncomeByUserId(userId).orElse(BigDecimal.ZERO);
        BigDecimal totalExpenses = expenseRepository.getTotalExpensesByUserId(userId).orElse(BigDecimal.ZERO);

        BigDecimal balance = totalIncome.subtract(totalExpenses);

        userRepository.findById(userId).ifPresent(user -> {
            user.setCurrentBalance(balance);
            userRepository.save(user);
        });

        return balance;
    }
}