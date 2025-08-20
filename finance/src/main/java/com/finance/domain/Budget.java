package com.finance.domain;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "budget")
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate Date;
    private String category;
    private BigDecimal budget_limit;
    private BigDecimal spent;
    private String icon;
    
    @ManyToOne(fetch = FetchType.LAZY) // Or FetchType.EAGER if necessary
    @JoinColumn(name = "user_id", nullable = false) // Foreign key to the User entity
    @JsonBackReference
    private User user;

    private Budget(){ }

    private Budget(String category, BigDecimal budget_limit, BigDecimal spent, String icon){
        this.category =category;
        this.budget_limit= budget_limit;
        this.spent = spent;
        this.icon = icon;
    }
    

    public long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return Date;
    }

    public void setDate(LocalDate date) {
        this.Date = date;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getSpent() {
        return spent;
    }

    public void setSpent(BigDecimal spent) {
        this.spent = spent;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BigDecimal getBudget_limit() {
        return budget_limit;
    }

    public void setBudget_limit(BigDecimal budget_limit) {
        this.budget_limit = budget_limit;
    }

}