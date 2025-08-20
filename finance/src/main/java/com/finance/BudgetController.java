package com.finance;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.domain.Budget;
import com.finance.domain.Expense;
import com.finance.domain.User;


@RestController
@RequestMapping("/budgets")
public class BudgetController {
    
    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseRepository expenseRepository;
    
    @GetMapping("/{userId}")
    public ResponseEntity<List<Budget>> getAllBudget (@PathVariable Long userId){
        List<Budget> budgets = budgetRepository.findBudgetByUserId(userId);
        
        if(budgets.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(budgets, HttpStatus.OK);

    }

    @GetMapping("/category/{userId}/{category}")
    public ResponseEntity<BigDecimal> getBudgetByCategory(@PathVariable Long userId, @PathVariable String category) {
        Optional<Budget> budget = budgetRepository.findByCategoryAndUserId(userId, category);
        if (budget.isPresent()) {
            return new ResponseEntity<>(budget.get().getBudget_limit(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Return NOT_FOUND if no budget found for category
        }
    }

    @PostMapping("/add/{userId}")
    public ResponseEntity<Budget> addBudget(@PathVariable Long userId, @RequestBody Budget budgetData) {
        // budgetData.setDate(date); // Set current date

        // Retrieve the User directly using UserRepository
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (budgetData.getBudget_limit().compareTo(BigDecimal.ZERO) == 0) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        budgetData.setUser(userOptional.get()); // Set the User to the Income
        Optional<BigDecimal> optionalValue = expenseRepository.getTotalExpenseByCategory(userId, budgetData.getCategory());
        
        BigDecimal totalExpense = optionalValue.orElse(BigDecimal.ZERO); // Default to 0 if not present
            budgetData.setSpent(totalExpense);
        Budget savedBudget = budgetRepository.save(budgetData);
        
        return new ResponseEntity<>(savedBudget, HttpStatus.CREATED); // Return saved Income
    }

    @DeleteMapping("/{userId}/{id}")
    public ResponseEntity<Void> deleteCategory (@PathVariable Long id){
        if(budgetRepository.existsById(id)){
            budgetRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<> (HttpStatus.NOT_FOUND);
        } 
    }

    @PutMapping("/{userId}/{id}")
    public ResponseEntity<Budget> updateCategory(@RequestBody Budget budgetData, @PathVariable Long userId, @PathVariable Long id ){
        Optional<Budget>  budget = budgetRepository.findByIdAndUserId(budgetData.getId(), userId);
        if(!budget.isPresent()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (budgetData.getBudget_limit().compareTo(BigDecimal.ZERO) == 0) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Budget updatedBudget = budget.get();
        updatedBudget.setBudget_limit(budgetData.getBudget_limit());
        updatedBudget.setDate(budgetData.getDate());
        updatedBudget.setCategory(budgetData.getCategory());
        budgetRepository.save(updatedBudget);
        return new ResponseEntity<> (updatedBudget, HttpStatus.OK);
    }
}