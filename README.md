
# **System Design Document**

## 1. **Introduction**

This document describes the system design for the real-time chat application backend, outlining its architecture, components, and setup. The backend is responsible for managing user authentication, real-time messaging, group chats, and handling data storage in a secure and scalable manner. This system was designed to support seamless real-time communication between users with robust security measures.

---

## 2. **System Architecture**

### 2.1 **High-Level Architecture**

The backend is a **RESTful API** powered by **Node.js** and **Express.js**, using **Socket.io** for real-time messaging. The core components are as follows:

- **Client-Side (Frontend)**: The chat client, either a web or mobile application, sends requests to the backend API to retrieve or update data and opens WebSocket connections for real-time communication.
  
- **Backend (Server)**: A Node.js server that processes API requests, manages authentication using **JWT**, handles WebSocket connections with **Socket.io**, and interacts with the database.

- **Database (MongoDB)**: The backend communicates with MongoDB to store user profiles, message history, group information, and other chat-related data.

---

### 2.2 **Component Diagram**
```
[ Client (Browser/Mobile App) ]
        |
        |     RESTful API (HTTP)
        |
[ Backend (Node.js + Express.js) ] ------ [ Socket.io (WebSocket) ]
        |
        |     CRUD Operations (Messages, Users, Groups)
        |
[ Database (MongoDB) ]
```

---

### 2.3 **API Design**

The backend exposes the following key endpoints:

1. **/api/auth/** - Handles user authentication (login, registration, etc.).
2. **/api/messages/** - Manages real-time messages, including sending and fetching.
3. **/api/groups/** - Allows users to create, join, or leave group chats.
4. **/api/users/** - Fetches user information and handles profile updates.

---

## 3. **Technology Stack**

### 3.1 **Node.js** 
Chosen for its **event-driven, non-blocking I/O model**, which is ideal for handling real-time messaging. Node.js is highly scalable and well-suited for web applications requiring real-time updates.

### 3.2 **Express.js**
A lightweight web framework for Node.js that simplifies routing and middleware handling, making it easier to create and manage RESTful APIs. It’s fast, minimalistic, and ideal for web applications that require efficiency and scalability.

### 3.3 **Socket.io**
Used to establish WebSocket connections for **bi-directional, real-time communication**. It's essential for chat applications to allow instant messaging between users, ensuring low latency and a smooth user experience.

### 3.4 **MongoDB**
A **NoSQL database** chosen for its flexibility in storing unstructured data like messages and user information. MongoDB allows efficient querying, horizontal scaling, and stores JSON-like documents, which is perfect for the real-time nature of this application.

### 3.5 **JWT (JSON Web Tokens)**
Used for **authentication**. JWT provides a secure way to verify the identity of users by issuing signed tokens after login or registration. It’s lightweight and suitable for stateless authentication, making it ideal for RESTful APIs.

### 3.6 **bcrypt.js**
Implemented for **password hashing**, ensuring secure storage of passwords. **bcrypt** is chosen due to its ability to generate a salt for each password and its slow hashing speed, which protects against brute-force attacks.

---

## 4. **Dependencies and Libraries**

- **Node.js**: The JavaScript runtime environment.
- **Express.js**: A web application framework for Node.js.
- **Socket.io**: For real-time WebSocket communication.
- **MongoDB & Mongoose**: MongoDB is the database, and **Mongoose** is an ODM (Object Data Modeling) library for MongoDB to manage data schema.
- **JWT (jsonwebtoken)**: For token-based authentication.
- **bcrypt.js**: For password hashing.
- **dotenv**: To manage environment variables.
  
### Installation of Dependencies:
Once the repository is cloned, you can install all dependencies by running:

```bash
npm install
```

This will automatically install all the required libraries listed in the `package.json` file.

---

## 5. **Data Flow Diagram**

### 5.1 User Registration & Login Flow:

1. **Client-side sends registration data** (username, email, password) via a POST request to `/api/auth/register`.
2. **Backend validates input** and hashes the password using **bcrypt.js**.
3. **User data is stored** in MongoDB.
4. Upon successful registration, the **JWT token is issued** and returned to the client.

5. For login, the client sends credentials to `/api/auth/login`, the backend verifies them, and a **JWT token** is returned if successful.

### 5.2 Real-Time Messaging Flow:

1. Users connect to the backend via **Socket.io**.
2. The client emits a message event (e.g., `sendMessage`), which is captured by the backend.
3. The backend processes the event and sends the message to all connected clients or the intended recipient using **Socket.io**.
4. The message is then stored in MongoDB for persistence.

---

## 6. **How to Set Up and Run the Backend**

### 6.1 **Prerequisites**
- **Node.js**: Ensure you have Node.js installed. You can download it from [Node.js Official Site](https://nodejs.org/).
- **MongoDB**: You need MongoDB either installed locally or hosted on a cloud service like MongoDB Atlas.

### 6.2 **Clone the Repository**
```bash
git clone https://github.com/anishiit/chat-backend.git
```

### 6.3 **Install Dependencies**
Navigate to the cloned project directory:
```bash
cd chat-backend
npm install
```

### 6.4 **Environment Setup**
Create a `.env` file in the root directory and configure the following variables:
```bash
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```
Example `.env` file:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=mysecretkey
```

### 6.5 **Run the Backend**
Start the server:
```bash
npm start
```
The backend will run on `http://localhost:5000`.

---

## 7. **Why These Technologies?**

- **Node.js** was chosen for its ability to handle multiple client requests efficiently and non-blocking I/O operations, making it perfect for real-time applications.
- **Express.js** simplifies the creation of RESTful APIs and manages middleware effectively, speeding up the development process.
- **Socket.io** is essential for real-time, event-based communication, allowing users to send and receive messages with low latency.
- **MongoDB** provides flexible data storage for chat messages and user profiles, with scalability as a key benefit.
- **JWT** enables stateless, secure user authentication, minimizing the need for storing session information server-side.
- **bcrypt.js** ensures password security by hashing passwords with a salt, protecting against common attacks.

---

## 8. **Conclusion**

This system design provides a scalable, efficient, and secure backend for a real-time chat application. With the use of modern technologies such as Node.js, Express, Socket.io, and MongoDB, the architecture is designed to support real-time communication, user authentication, and group management efficiently.

For any questions or contributions, feel free to submit issues or pull requests to the repository.

--- 

