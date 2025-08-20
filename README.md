# Personal Finance Tracker (Budget Bee)

#### Welcome to **Budget Bee**, a comprehensive personal finance tracker that empowers users to take control of their financial well-being. This application allows users to track expenses, manage budgets, set savings goals, and visualize their financial activities through a user-friendly dashboard.

## Members

1. Chell Hmue May - 6631503056
2. Eaindray Su Pan - 6631503057
3. Kay Khine Maw - 6631503060
4. Kyu Kyu Thin - 6631503063
5. Hsu Myat Thwe - 6631503120

## **Features**

### **1. Dashboard**

- Quick overview of income, expenses, and savings.
- Visual reports for weekly and monthly trends.

### **2. Expense Tracking**

- Record and categorize expenses by day, week, or month.
- Edit and delete expense records easily.

### **3. Income Management**

- Add and track all income sources.
- Filter records by different time periods.

### **4. Budget Management**

- Set spending limits for specific categories.
- View progress toward staying within budget.

### **5. Savings Goals**

- Define financial goals with deadlines and target amounts.
- Monitor progress toward achieving your goals.

### **6. Security**

- Secure user authentication with encrypted passwords.

### **7. Export Data**

- Download financial data as JSON files for offline access.

## URL to HOME PAGE

- https://finance-app-87242397968.us-central1.run.app

## URL TO BACK END

- https://finance-87242397968.us-central1.run.app/expense/monthly/{userId} (Listing Daily Expense)

- https://finance-87242397968.us-central1.run.app/budgets/{userId} (Listing Budget)

- https://finance-87242397968.us-central1.run.app/income/add/{userId} (Creating Income)

- https://finance-87242397968.us-central1.run.app/saving/add/{userId} (Creating Saving Goal)

- https://finance-87242397968.us-central1.run.app/expense/update/{userId} (Updating Expense)

- https://finance-87242397968.us-central1.run.app/budgets/{userId}/{id} (Updating Budget)

- https://finance-87242397968.us-central1.run.app/income/{userId}/{incomeId} (Deleting Income )

- https://finance-87242397968.us-central1.run.app/saving/{userId}/{id} (Deleting Saving Goal)

- https://finance-87242397968.us-central1.run.app/user/{userId} (Managing Related Entity - Deleting User and All related data)

- https://finance-87242397968.us-central1.run.app/user/{userId}/financial-data
- (Managing Related Entity - Downloading All data of User)

## **Technology Stack**

### **Frontend**

- **Framework**: React.js
- **Styling**: CSS, BootStrap
- **State Management**: React useState, useEffect

### **Backend**

- **Framework**: Spring Boot
- **Language**: Java
- **Database**: MySQL
- **Authentication**: Spring Security with BCrypt for password encryption
- **APIs**: RESTful APIs for CRUD operations

### **Deployment**

- **Frontend Hosting**: Google Cloud (React App)
- **Backend Hosting**: Google Cloud (Spring Boot App)
- **Containerization**: Docker for frontend and backend services
- **CI/CD**: Google Cloud Build

## **Usage**

1. **Sign Up**: Create an account and log in securely.
2. **Dashboard**: View your financial summary.
3. **Add Expenses and Income**: Categorize and manage records.
4. **Set Budgets**: Limit spending on specific categories.
5. **Track Savings**: Create savings goals and monitor progress.

## **Future Enhancements**

- Integration with bank accounts for real-time tracking.
- Advanced data visualization with charts.
- AI-based insights for better financial decisions.

---

## **Start managing your finances smarter with Budget Bee! 🐝**
