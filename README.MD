# Auth Application - Backend Server

Welcome to the Blog Application backend server! This repository contains the backend server for a blog application built using Node.js and various associated tools. The app allows users to register, sign in, manage their profile, and create, update, and delete blog posts.

## Table of Contents

- [Auth Application - Backend Server](#auth-application---backend-server)
  - [Table of Contents](#table-of-contents)
  - [Technologies Used](#technologies-used)
  - [Features](#features)
    - [User Functionalities](#user-functionalities)
    - [Post Functionalities](#post-functionalities)
  - [Installation \& Setup](#installation--setup)
  - [API Endpoints](#api-endpoints)
  - [Contributing](#contributing)

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend server.
- **Express**: Web framework for Node.js to build APIs.
- **Mongoose**: ODM library for MongoDB to facilitate database interactions.
- **Bcryptjs**: Library for hashing passwords.
- **Cookie-parser**: Middleware for parsing cookies.
- **CORS**: Middleware to enable Cross-Origin Resource Sharing.
- **Joi**: Validation library for JavaScript to ensure data integrity.
- **Jsonwebtoken**: Library to issue and verify JSON Web Tokens (JWT).
- **Nodemailer**: Module to send emails for verification and password recovery.

## Features

### User Functionalities

- **Sign Up**: Users can create a new account, with verification codes sent to their email.
- **Sign In**: Users can log into their accounts securely.
- **Sign Out**: Users can log out from their accounts.
- **Send Verification Code**: A verification code is sent to the user's email upon signup.
- **Change Password**: Users can change their existing passwords.
- **Send Forgot Password Code**: A verification code is sent for password recovery.
- **Verify Forgot Password Code**: Users can verify their identity to reset their passwords.

### Post Functionalities

- **Get Posts**: Retrieve all posts available in the database.
- **Get Post by ID**: Retrieve a specific post by its unique identifier.
- **Create Post**: Users can create a new post supplying a title and description.
- **Update Post**: Users can modify their existing posts.
- **Delete Post**: Users can delete their posts.

## Installation & Setup

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MuGrahiman/Backend-Auth-Project.git
   ```
2. **Navigate into the project directory**:

   ```bash
   cd blog-backend-server
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Create a `.env` file** in the root directory and add the following configurations:

   ```
   PORT=your_port_here
   MONGODB_USER=your_mongodb_user_name
   MONGODB_PASS=your_mongodb_password
   MONGODB_CLUSTER=your_mongodb_cluster_name
   MONGODB_DB=your_mongodb_database_name
   TOKEN_SECRET=your_secret_token
   NODE_CODE_SENDING_EMAIL_ADDRESS=your_mail_address
   NODE_CODE_SENDING_EMAIL_PASSWORD=your_app_pass_key
   HMAC_VERIFICATION_CODE_SECRET=your_secret_code
   ```

5. **Start the server**:
   ```bash
   npm start
   ```

The server should now be running on the specified port.

## API Endpoints

Here's a summary of the available endpoints:
- **Test Endpoint**:
- 
  - `GET /`: Test your server.

- **User Endpoints**:

  - `POST /auth/sign-up`: Register a new user.
  - `POST /auth/sign-in`: Log user into account.
  - `POST /auth/sign-out`: Log user out.
  - `POST /auth/send-verification-code`: Send verification email.
  - `POST /auth/change-password`: Change the user's password.
  - `POST /auth/send-forgot-password-code`: Initiate forgot password process.
  - `POST /auth/verify-forgot-password-code`: Verify code for password reset.

- **Post Endpoints**:
  - `GET /posts/all-posts`: Retrieve all blog posts.
  - `GET /posts/single-post?_id=`: Retrieve a specific post by ID.
  - `POST /posts/create-post`: Create a new blog post.
  - `PUT /posts/update-post?_id=`: Update an existing post by ID.
  - `DELETE /posts/delete-post?_id=`: Delete an existing post by ID.

## Contributing

Contributions are welcome! If you have suggestions or enhancements, please fork the repository and create a pull request.

---

---

Thank you for checking out the Blog Application backend server! If you have any questions or feedback, feel free to reach out. Happy Coding!
