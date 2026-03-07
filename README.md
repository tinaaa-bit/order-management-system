# Order Management System

A full-stack **Order Management System** built using **Spring Boot, React, and PostgreSQL**.  
The application provides secure **JWT authentication** and **role-based access control** for Admins and Users to manage orders efficiently.

---

## Features

### Authentication
- User signup and login
- Secure authentication using JWT tokens
- Role-based access control (ADMIN / USER)

### User Features
- View profile information
- Create new orders
- View order history
- Delete own orders

### Admin Features
- View all users
- Delete users
- View all orders
- Delete orders
- Dashboard statistics:
    - Total users
    - Total orders

---

## Tech Stack

### Backend
- Java
- Spring Boot
- Spring Security
- JWT Authentication
- JPA / Hibernate
- Maven

### Frontend
- React
- JavaScript
- Semantic UI
- CSS

### Database
- PostgreSQL

---

## Architecture

The backend follows a layered architecture:

Controller → Service → Repository → Database

This structure keeps the project modular, maintainable, and scalable.

Main backend modules:

- auth
- user
- order
- security
- rest

---

## API Endpoints

### Authentication
POST /auth/login  
POST /auth/signup

### Users
GET /api/users  
DELETE /api/users/{username}

### Orders
GET /api/orders  
POST /api/orders  
DELETE /api/orders/{orderId}

### Public APIs
GET /public/numberOfUsers  
GET /public/numberOfOrders

---

## Project Structure

```
order-management-system
│
├── order-api        (Spring Boot Backend)
│   ├── controller
│   ├── service
│   ├── repository
│   ├── security
│
├── order-ui         (React Frontend)
│   ├── components
│   ├── admin
│   ├── user
│   ├── auth
│
└── PostgreSQL Database
```

---

## Setup Instructions

## 1. Clone the Repository

```
git clone https://github.com/tinaaa-bit/order-management-system.git
```

---


## 2. Database Setup (PostgreSQL)

This project uses **PostgreSQL** as the database.

Before running the backend, create a database and user that match the configuration in `application.yml`.

### 2.1. Install PostgreSQL
Download and install PostgreSQL from:

https://www.postgresql.org/download/

---

### 2.2. Create Database

Open PostgreSQL (psql or pgAdmin) and run:

```sql
CREATE DATABASE ordersdb;
```

---

### 2.3. Create Database User

```sql
CREATE USER orderuser WITH PASSWORD 'orderpass';
```

---

### 2.4. Grant Permissions

```sql
GRANT ALL PRIVILEGES ON DATABASE ordersdb TO orderuser;
```

---

### 2.5. Application Configuration

The backend uses the following database configuration:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ordersdb
    username: orderuser
    password: orderpass
```

Hibernate is configured to automatically create/update tables:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update
```

This means the required tables will be **created automatically when the backend starts**.

---



## 3. Run Backend

Navigate to backend folder:

```
cd order-api
```

Run Spring Boot:

```
./mvnw spring-boot:run
```

Backend will run on:

```
http://localhost:8080
```

---

## 4. Run Frontend

Navigate to frontend folder:

```
cd order-ui
```

Install dependencies:

```
npm install
```

Run React app:

```
npm start
```

Frontend will run on:

```
http://localhost:3000
```
