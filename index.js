import express from "express";

const app = express();
app.use(express.json());

const API_KEY = "test-key-123";

// Middleware to check API key
app.use((req, res, next) => {
  if (req.headers["x-api-key"] !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// MCP info
app.get("/mcp/info", (req, res) => {
  res.json({ name: "Test MCP Server", version: "1.0.0" });
});

// MCP execute
app.post("/mcp/execute", (req, res) => {
  res.json({ received: req.body });
});

// MCP SSE
app.get("/mcp/sse", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });
  res.flushHeaders();

  res.write(`data: {"message": "MCP stream active"}\n\n`);

  const interval = setInterval(() => {
    res.write(`data: {"ping": ${Date.now()}}\n\n`);
  }, 5000);

  req.on("close", () => {
    clearInterval(interval);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`MCP server running on port ${port}`));
