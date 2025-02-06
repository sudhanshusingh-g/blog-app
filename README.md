# Simple MERN Blogging App

## Overview
This is a feature-rich blogging platform built using the MERN stack (MongoDB, Express.js, React, Node.js). The app allows users to securely create, manage, and interact with blog posts while performing CRUD operations. Additionally, users can engage with other posts through likes, comments, and shares.

## Features
- **User Authentication:** Secure signup, login, and session management.
- **CRUD Operations:** Create, read, update, and delete blog posts.
- **Social Engagement:**
  - Comment on posts.
  - Like and share other users' posts.
- **RESTful API:** Backend communication follows RESTful conventions.

## Tech Stack
- **Frontend:** React.js with modern hooks and state management
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT) for secure access
- **Styling:** CSS / Component Libraries (if applicable)

## Installation
### Prerequisites
- Node.js installed
- MongoDB set up and running

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```

3. Configure environment variables by creating `.env` files for both server and client:
   - For the backend (`.env` file):
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     ```

4. Run the development servers:
   ```bash
   # In the root directory, start the backend
   npm run dev
   
   # Open a new terminal for the client
   cd client
   npm start
   ```

5. Visit `http://localhost:3000` to access the app.

## API Endpoints
- **POST** `/api/auth/register`: Register a new user
- **POST** `/api/auth/login`: Log in an existing user
- **POST** `/api/posts`: Create a new post
- **GET** `/api/posts`: Fetch all posts
- **PUT** `/api/posts/:id`: Update a post
- **DELETE** `/api/posts/:id`: Delete a post
- **POST** `/api/posts/:id/comment`: Add a comment
- **POST** `/api/posts/:id/like`: Like a post

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the project.
2. Create a new branch (`git checkout -b feature-branch-name`).
3. Commit changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch-name`).
5. Create a pull request.

## License
This project is licensed under the [MIT License](LICENSE).

---
Happy Coding!

