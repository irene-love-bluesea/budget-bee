package com.finance;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finance.domain.Budget;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId")
    List<Budget> findBudgetByUserId(@Param("userId") Long userId);

    Optional<Budget> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.category = :category")
    Optional<Budget> findByCategoryAndUserId(@Param("userId") Long userId, @Param("category") String category);
}