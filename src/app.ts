import express from "express";
import cors, { CorsRequest, CorsOptions } from "cors";
import apiRouter from "./routes";
const app = express();

app.use(
  cors(
    (
      req: CorsRequest,
      callback: (error: Error | null, options: CorsOptions) => void
    ) => {
      const host = req.headers["host"];
      const origin = req.headers["origin"] || "";

      if (!host || !origin) {
        callback(null, { credentials: false, origin: false });
        return;
      }
      callback(null, { credentials: true, origin: true });
    }
  )
);

app.get("/health", async (_, res) => {
  return res.send(new Date().toISOString() + " health check");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

process.on("uncaughtException", (err) => {
  console.error("Uncaughted Exception!");
  console.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", promise, "Reason：", reason);
});

export default app;
