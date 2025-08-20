package com.finance;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finance.domain.Budget;
import com.finance.domain.SavingGoal;

public interface SavingGoalRepository extends JpaRepository<SavingGoal, Long> {
    @Query("SELECT s FROM SavingGoal s WHERE s.user.id = :userId")
    List<SavingGoal> findSavingGoalByUserId(@Param("userId") Long userId);
    
    Optional<SavingGoal> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT s FROM SavingGoal s WHERE s.user.id = :userId AND s.saving_name = :saving_name")
    Optional<Budget> findBySavingNameAndUserId(@Param("userId") Long userId, @Param("saving_name") String saving_name);

}