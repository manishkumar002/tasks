require("dotenv").config({ path: "./backend/.env" });
const http = require("http");
const app = require("./backend/app");
const connectDB = require("./backend/config/db");

const PORT = process.env.PORT || 8080;

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});
