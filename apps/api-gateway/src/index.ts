import express from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes";

const app = express();
const PORT = process.env.GATEWAY_PORT || 8000;

// Security and utility middleware
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());

// Request tracer middleware
app.use((req, res, next) => {
  const traceId = req.headers["x-trace-id"] || `trace-${Math.random().toString(36).substr(2, 9)}`;
  req.headers["x-trace-id"] = traceId;
  res.setHeader("x-trace-id", traceId);
  console.log(`[GATEWAY] [${new Date().toISOString()}] ${req.method} ${req.path} - Trace ID: ${traceId}`);
  next();
});

// Gateway Status Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "EAOS API Gateway",
    uptime: process.uptime(),
    version: "1.0.0"
  });
});

// Route Mount
app.use("/api/v1", router);

// Error Handling Middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const traceId = req.headers["x-trace-id"];
  console.error(`[GATEWAY ERROR] Trace: ${traceId} - ${err.stack}`);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    traceId
  });
});

app.listen(PORT, () => {
  console.log(`[EAOS API GATEWAY] Cluster Gateway online and listening on port ${PORT}`);
});
