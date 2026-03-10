# Product Requirement Document

# DevTinder - Product Requirement Document

## Objective and Purpose

- DevTinder is a platform where developers can come and connect with other developers from around the world.

## Scope

- We will be building Backend for our DevTinder app. This will be our first Microservice.
- We will focus on building efficient and Scalable backend

- later we will focus on Frontend Microservice

## Features and Requirement

### P1 category

- Create Account
- Login / signup
- Update profile
- Feed Page : See Other developers profile
- send Connection request(swipe right) or ignore(swipe left)
- see our matches
- see the request we have send/recieved

### P2 category

- RealTime Chat communication between users
- block / report user
- video chat
- sending email
- Notification

## User Stories OR use Cases

- I want to see where the level of competiton is going
- I want to interact with more knowlegable people and learn from them
- I want a healthy group of people who are very focused with their work
- I want to share / showcase my skill
- As a developer, I want to see profiles of other devs so I can find potential collaborators.

## Technical Requirement

- Nodejs
- Express
- Mongodb
- other libraries

## Design Requirement

- How cards should look
- theme of application
- Tailwind
- ....

## Success Metrics

## TimeLine

- 2 days


# 🚀 DevTinder Backend API

**Base URL**
```
http://localhost:5000/api
```

---

## Complete API Reference

| Module   | Method | Endpoint                         | Description                      | Auth | Request Body |
|----------|--------|----------------------------------|----------------------------------|------|--------------|
| Auth     | POST   | /auth/register                   | Register new user                | ❌   | { name, email, password } 
| Auth     | POST   | /auth/login                      | Login user                       | ❌   | { email, password } 
| Auth     | GET    | /auth/me                         | Get logged-in user               | ✅   |
| Profile  | GET    | /profile/:userId                 | Get user profile by ID           | ❌   | 
| Profile  | PUT    | /profile                         | Update logged-in profile         | ✅   | { bio, skills, gender , name , .....} 
| Requests | POST   | /requests/send/:userId           | Send connection request          | ✅   | 
| Requests | PUT    | /requests/accept/:requestId      | Accept connection request        | ✅   | 
| Requests | PUT    | /requests/reject/:requestId      | Reject connection request        | ✅   | 
| Requests | GET    | /requests/received               | Get received requests            | ✅   |
| Requests | GET    | /requests/sent                   | Get sent requests                | ✅   |
| Chat     | GET    | /chat/:connectionId              | Get chat messages                | ✅   | 
| Chat     | POST   | /chat/send                       | Send chat message                | ✅   | { connectionId, message } 
| Payment  | POST   | /payment/create-order            | Create payment order             | ✅   | { amount }
| Payment  | POST   | /payment/verify                  | Verify payment                   | ✅   | { paymentId, orderId, signature } 
| Upload   | POST   | /upload/profile-pic              | Upload profile picture           | ✅   | FormData (image file) 
|-------------------------------------------------------------------------------------------------------------------|