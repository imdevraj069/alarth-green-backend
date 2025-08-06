# Alarth Green - Solar Request Tracker API

This is the backend for the Full Stack Developer Intern assignment. It's a RESTful API built with Node.js, Express, and MongoDB to manage a solar installation request workflow with role-based access control.

## ✨ Features

-   **JWT Authentication**: Secure endpoints using JSON Web Tokens.
-   **Role-Based Access Control (RBAC)**: Five distinct user roles (`Admin`, `Agent`, `Assigner`, `Installer`, `Reviewer`) with specific permissions.
-   **User Management**: Admins can create new users with specific roles.
-   **Request Workflow**: Complete lifecycle management for solar requests from creation to completion.
-   **Centralized Error Handling**: Consistent and predictable error responses.

## 🛠️ Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: JSON Web Token (JWT), bcryptjs for hashing
-   **Environment Variables**: dotenv
-   **CORS**: cors

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or higher)
-   [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd alarth-green-backend