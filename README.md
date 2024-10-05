# Authentication API Documentation

This API provides authentication services through **JWT-based token authentication** and **OTP-based phone and email verification**. It supports user registration, login, sending OTPs, and verifying email addresses. Below are the available endpoints and their details.

## Base URL

[https://vh24-bytesmashers-neurons-2.onrender.com](https://vh24-bytesmashers-neurons-2.onrender.com)

## Endpoints

### 1. Phone-based OTP Authentication

#### 1.1 Request OTP for Phone Signup

- **Endpoint:** `POST /signup/phone/request-otp`
- **Purpose:** Sends an OTP to the user's phone number for verification.

**Request:**
json
```
{
  "phoneNumber": "+1234567890"
}
Success Response (200):
```
json
```
{
  "status": "success",
  "message": "OTP sent to the provided phone number."
}
```
Failure Response (400):

json
```
{
  "status": "error",
  "message": "Invalid phone number or OTP generation failed."
}
```
1.2 Verify OTP for Phone Signup
Endpoint: POST /signup/phone/verify-otp
Purpose: Verifies the OTP entered by the user for phone number signup.
Request:

json
 ```
{
  "phoneNumber": "+1234567890",
  "otp": "123456"
}
```
Success Response (200):

json
 ```
{
  "status": "success",
  "message": "Phone number verified successfully."
}
```
Failure Response (400):

json
 ```
{
  "status": "error",
  "message": "Invalid OTP or OTP expired."
}
```
2. Email-based OTP Authentication
2.1 Register for OTP (Email-based)
Endpoint: POST /register-for-otp
Purpose: Registers a user for OTP-based email authentication.
Request:

json
 ```
{
  "email": "user@example.com"
}
```
Success Response (200):

json
 ```
{
  "status": "success",
  "message": "User registered for OTP."
}
```
Failure Response (400):

json
 ```
{
  "status": "error",
  "message": "Registration failed. Email might be invalid."
}
```
2.2 Request OTP for Email Verification
Endpoint: POST /request-otp
Purpose: Sends an OTP to the registered email address for verification.
Request:

json
 ```
{
  "email": "user@example.com"
}
```
Success Response (200):

json
 ```
{
  "status": "success",
  "message": "OTP sent to the provided email address."
}
```
Failure Response (400):

json
 ```
{
  "status": "error",
  "message": "Failed to send OTP. Email might be invalid."
}
```
2.3 Verify OTP for Email Verification
Endpoint: POST /verify-otp
Purpose: Verifies the OTP entered by the user for email verification.
Request:

json
 ```
{
  "email": "user@example.com",
  "otp": "123456"
}
```
Success Response (200):

json
 ```
{
  "status": "success",
  "message": "Email verified successfully."
}
```
Failure Response (400):

json
 ```
{
  "status": "error",
  "message": "Invalid OTP or OTP expired."
}
```
3. General Authentication
3.1 User Registration
Endpoint: POST /register
Purpose: Registers a new user.
Request:

json
 ```
{
  "email": "user@example.com",
  "password": "yourPassword",
  "name": "John Doe"
}
```
Success Response (200):

json
 ```
{
  "status": "success",
  "message": "User registered successfully."
}
```
Failure Response (400):

json
 ```
{
  "status": "error",
  "message": "Registration failed. Email might already exist."
}
```
3.2 User Login
Endpoint: POST /login
Purpose: Logs in an existing user.
Request:

json
 ```
{
  "email": "user@example.com",
  "password": "yourPassword"
}
```
Success Response (200):

json
 ```
{
  "status": "success",
  "token": "JWT_TOKEN"
}
```
Failure Response (400):

json
 ```
{
  "status": "error",
  "message": "Login failed. Invalid credentials."
}
```
4. Token-based Authentication (JWT)
4.1 Middleware for Authenticated Routes
Purpose: Protects routes by verifying JWT tokens in the request header.
Request Header:

json
 ```
{
  "x-auth-token": "JWT_TOKEN"
}
```
Success Response (200):

json
 ```
{
  "status": "success",
  "message": "Token is valid."
}
```
Failure Response (401):

json
 ```
{
  "status": "error",
  "message": "No token, authorization denied."
}
```
5. Email Verification
5.1 Verify Email with Token
Endpoint: GET /verify-email
Purpose: Verifies the user's email using the token sent in the verification link.
Request:

bash
 
GET /verify-email?token=YOUR_VERIFICATION_TOKEN
Success Response (200):

json
 ```
{
  "status": "success",
  "message": "Email verified successfully."
}
```
Failure Response (400):

json
 ```
{
  "status": "error",
  "message": "Invalid verification link."
}
```
Status Codes
Status Code	Description
200	Success
400	Bad Request (Invalid Input or Parameters)
401	Unauthorized (Invalid Authentication Credentials)
404	Not Found (Endpoint does not exist)
500	Internal Server Error
css

 # Test Cases for Authentication System

This project contains an HTML table-based representation of test cases for an *Authentication System. The test cases cover functionalities like **Account Creation, **Login (Email & Password, OTP, Email OTP)*, and other general system actions like password reset and logout.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [How to Use](#how-to-use)
- [Test Case Structure](#test-case-structure)
- [Contributing](#contributing)
- [License](#license)

## Project Description

This project serves as a reference for the key test cases required to validate the functionalities of an authentication system. It organizes test cases into tables for different sections such as *Account Creation, **Login, and **General Test Cases*.

The key modules and test cases covered are:
- *Account Creation*
- *Email & Password Login*
- *OTP Login*
- *Email OTP Login*
- *General Test Cases* like reset password and logout.

Each section contains several test cases along with descriptions, expected outcomes, and placeholders for test results.

## Features

- *Organized Table Layout*: Each test case is organized in a structured table.
- *Multiple Authentication Methods*:
  - Account creation
  - Email & password login
  - OTP login
  - Email OTP login
- *Clean and Readable*: Easy to understand and expand with more test cases.
- *Lightweight*: Simple HTML and CSS, no external dependencies.

## How to Use

1. *Clone the repository*:

    bash
    git clone https://github.com/your-username/authentication-test-cases.git
    

2. *Open the HTML file*:
   - Navigate to the project directory and open the index.html file in any web browser.

3. *Add or Edit Test Cases*:
   - You can add more test cases by editing the HTML file, under each section (Account Creation, Login, etc.).

4. *Use for Documentation*:
   - You can use this as a test case documentation template or modify it according to your testing requirements.

## Test Case Structure

Each test case is structured as follows:

| Column           | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| *Test Case ID*  | A unique identifier for each test case.                                     |
| *Test Case Description* | A brief explanation of what is being tested.                             |
| *Expected Result* | The expected outcome when the test is run.                                    |
| *Status*        | A field to indicate whether the test passed or failed after execution.       |

### Example Test Case:

#### *Account Creation Test Cases*

| Test Case ID | Test Case Description                                | Expected Result                                      | Status |
|--------------|------------------------------------------------------|------------------------------------------------------|--------|
| TC-AC-001    | Verify successful account creation with valid data    | Account should be created successfully               |        |
| TC-AC-002    | Verify account creation with existing email           | Should display an error message for duplicate email  |        |

## Contributing

If you'd like to contribute to this project, feel free to submit pull requests. Here's how to get started:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-name).
3. Make your changes.
4. Commit your changes (git commit -m 'Add feature').
5. Push to the branch (git push origin feature-name).
6. Create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

This markdown should be suitable for a GitHub README file, improving readability while keeping all key information intact. Would you like to further customize the styling or content for your README?
