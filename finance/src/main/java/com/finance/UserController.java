package com.finance;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.finance.domain.Budget;
import com.finance.domain.SavingGoal;
import com.finance.domain.User;

@RestController

public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BalanceService balanceService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Optional<User>> getUser(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Signup method with password hashing
    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody User user) {
        // Check if the email is already taken
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save the new user with hashed password
        userRepository.save(user);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User loginRequest) {
        Map<String, Object> response = new HashMap<>();

        // Find the user by email
        Optional<User> existingUser = userRepository.findByEmail(loginRequest.getEmail());

        if (existingUser.isPresent()) {
            // Check if the password matches
            User user = existingUser.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                response.put("message", "Login successful");
                response.put("user", Map.of("id", user.getId(), "name", user.getName()));
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.put("message", "Invalid password");
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }
        } else {
            response.put("message", "User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<User> updateUser(@RequestBody User user, @PathVariable Long userId) {

        Optional<User> existingUser = userRepository.findById(userId);
        if (!existingUser.isPresent()) {
            return new ResponseEntity<> (HttpStatus.NOT_FOUND);
        }

        User userToUpdate = existingUser.get();
        userToUpdate.setEmail(user.getEmail());
        userToUpdate.setName(user.getName());

        userRepository.save(userToUpdate);
        return new ResponseEntity<>(userToUpdate,HttpStatus.OK);
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        Optional<User> existingUser = userRepository.findById(userId);
        if (existingUser.isPresent()) {
            userRepository.deleteById(userId);
            return new ResponseEntity<>("User deleted successfully.", HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
        }
    }

    // for downloading financial data
    @GetMapping("/user/{userId}/financial-data")
    public ResponseEntity<Map<String, Object>> getUserFinancialData(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        User user = userOpt.get();

        Map<String, Object> financialData = new HashMap<>();
        financialData.put("user", user);
        return new ResponseEntity<>(financialData, HttpStatus.OK);
    }


    //Get Current Balance
    @GetMapping("/balance/{userId}")
    public ResponseEntity<BigDecimal> getCurrentBalance(@PathVariable Long userId) {
        BigDecimal balance = balanceService.getCurrentBalance(userId);
        return new ResponseEntity<>(balance, HttpStatus.OK);
    }

}