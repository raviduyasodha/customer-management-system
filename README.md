# Customer Management System

## Prerequisites
- Java 17
- Node.js 16+
- MySQL/MariaDB (XAMPP default)
- Maven 3.6+

## Database Setup
1. Create the database:
   ```sql
   CREATE DATABASE customer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Run the DDL and DML scripts:
   ```bash
   mysql -u root -P 4406 customer_db < sql/ddl.sql
   mysql -u root -P 4406 customer_db < sql/dml.sql
   ```

## Backend Setup
1. Configure `application.properties` in `backend/src/main/resources/` with your DB credentials.
2. Start the backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The backend will run at `http://localhost:8080`.

## Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the frontend:
   ```bash
   npm start
   ```
   The frontend will run at `http://localhost:3000`.

## Features
- CRUD for Customers
- Multiple Mobile Numbers and Addresses
- Bulk Import via Excel (.xlsx)
- Unit Tests for Service Layer

## Excel Bulk Upload Format
Columns (in order, first row is header):
1. **Name** (e.g., John Doe)
2. **Date of Birth** (e.g., 1990-01-01)
3. **NIC Number** (e.g., 901234567V)
