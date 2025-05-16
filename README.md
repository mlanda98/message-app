# message-app

A simple full-stack messaging application that allows users to sign up, customize their profiles, and send messages to other users.

---

📌 Features
- user authentication (signup, login, logout)
- send and receive messages
- Customize your user profile
- backend built with REST API architecture
- Note: This app uses request-response via REST API, so messages are fetched manually rather than updated in real-time

---

🛠️ Tech Stack
- Frontend: react.js
- Backend: node.js with Express.js
- Database: PostgreSQL via Prisma ORM
- Architecture: monorepo with separate frontend and backend folders
- Authentication: JWT



---

💻 Run It Locally
- Clone the repository
  `git clone https://github.com/mlanda98/message-app.git`
- Backend:

```
  cd backend
  npm install
  npx prisma migrate dev
  npm run dev

```
- Frontend:

```
  cd frontend
  npm install
  npm start
  
```
- Open your browser to `http://localhost:3000`

---

📬 Contact
- Email: mlandae16@gmail.com
