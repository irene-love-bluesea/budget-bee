    package com.finance.domain;

    import jakarta.persistence.*;

    import java.math.BigDecimal;
    import java.time.LocalDate;
    import com.fasterxml.jackson.annotation.JsonBackReference;

    @Entity
    @Table(name = "expense")
    public class Expense {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private long id;
        private LocalDate date;
        private String category;
        private BigDecimal amount;
        private String icon;

        @ManyToOne(fetch = FetchType.LAZY) 
        @JoinColumn(name = "user_id", nullable = false) 
        @JsonBackReference
        private User user;

        
        private Expense(){ }

        private Expense(String category, BigDecimal amount){
            this.category=category;
            this.amount=amount;
        }
        

        public long getId() {
            return id;
        }

        public void setId(long id) {
            this.id = id;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public User getUser() {
            return user;
        }

        public void setUser(User user) {
            this.user = user;
        }
        
        
        public String getIcon() {
            return icon;
        }

        public void setIcon(String icon) {
            this.icon = icon;
        }

    }