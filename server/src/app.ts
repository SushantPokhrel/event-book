import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as userRoutes } from "./routes/user.route.js";
import { router as eventRoutes } from "./routes/events.route.js";
import { router as bookingRoutes} from "./routes/booking.route.js"
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/booking", bookingRoutes);

app.get("/", (req, res) => {
  console.log("hi from server ");
  return res.send("hi from server ");
});
export default app;
