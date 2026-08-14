
## Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Configure environment variables

Create/update `backend/.env`:

```env
PORT=8080
MONGO_URL=mongodb://127.0.0.1:27017/task
JWT_SECRET=7fK9vQ2mX8#pL4zR6@wN3sT1!yU5cB0$dE9hG2jM
JWT_EXPIRES=7d
CLIENT_URL=http://localhost:5173
```

### 4. Start MongoDB

Make sure MongoDB is running locally:

```bash
sudo systemctl start mongod
# or
mongod
```

### 5. Run the application
**Development (both server & client):**
```bash
npm run dev:all
```
**Or run separately:**

```bash
# Terminal 1 — Backend
npm run dev
# Terminal 2 — Frontend
npm run dev
```

### 6. Open in browser
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8080](http://localhost:8080)
