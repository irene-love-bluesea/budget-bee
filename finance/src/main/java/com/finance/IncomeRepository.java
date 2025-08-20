package com.finance;

import com.finance.domain.Income;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {

    @Query("SELECT i FROM Income i WHERE i.user.id = :userId AND i.date = CURRENT_DATE ORDER BY i.id DESC") // Ensure date is being handled
    List<Income> findDailyIncomeByUserId(Long userId);

    @Query("SELECT i FROM Income i WHERE i.user.id = :userId AND i.date BETWEEN :startDate AND :endDate ORDER BY i.date DESC, i.id DESC")
    List<Income> findIncomeByUserIdAndDateRange(Long userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user.id = :userId")
    Optional<BigDecimal> getTotalIncomeByUserId(Long userId);

    Optional<Income> findByIdAndUserId(Long id, Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Income i WHERE i.id = :incomeId AND i.user.id = :userId")
    int deleteByIdAndUserId(@Param("incomeId") Long incomeId, @Param("userId") Long userId);

    @Query("SELECT i FROM Income i WHERE i.user.id = :userId ORDER BY i.date DESC, i.id DESC")
    List<Income> findLatestIncomesByUserId(@Param("userId") Long userId, Pageable pageable);

}