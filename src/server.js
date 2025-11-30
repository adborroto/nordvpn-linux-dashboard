const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 4722;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

function runCommand(cmd) {
  console.log(`[COMMAND] Executing: ${cmd}`);
  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(`[ERROR] Command failed: ${cmd}`);
        console.log(`[ERROR] Error: ${error.message}`);
        console.log(`[ERROR] Output: ${stderr || stdout || error.message}`);
        resolve({ ok: false, output: stderr || stdout || error.message });
      } else {
        console.log(`[SUCCESS] Command succeeded: ${cmd}`);
        console.log(`[OUTPUT] ${stdout.trim()}`);
        resolve({ ok: true, output: stdout });
      }
    });
  });
}

app.get("/api/status", async (req, res) => {
  console.log(`[API] GET /api/status - Request received`);
  const result = await runCommand("nordvpn status");
  console.log(
    `[API] GET /api/status - Response: ${result.ok ? "OK" : "FAILED"}`
  );
  res.json(result);
});

app.post("/api/connect", async (req, res) => {
  const { country } = req.body || {};
  console.log(
    `[API] POST /api/connect - Request received${
      country ? ` (country: ${country})` : ""
    }`
  );
  const target = country ? `nordvpn connect ${country}` : "nordvpn connect";
  const result = await runCommand(target);
  console.log(
    `[API] POST /api/connect - Response: ${result.ok ? "OK" : "FAILED"}`
  );
  res.json(result);
});

app.post("/api/disconnect", async (req, res) => {
  console.log(`[API] POST /api/disconnect - Request received`);
  const result = await runCommand("nordvpn disconnect");
  console.log(
    `[API] POST /api/disconnect - Response: ${result.ok ? "OK" : "FAILED"}`
  );
  res.json(result);
});

app.get("/api/ipinfo", async (req, res) => {
  console.log(`[API] GET /api/ipinfo - Request received`);
  const result = await runCommand("curl -s https://ipinfo.io/json");
  res.setHeader("Content-Type", "application/json");
  try {
    const ipInfo = JSON.parse(result.output);
    console.log(`[API] GET /api/ipinfo - Response: OK`);
    res.send(ipInfo);
  } catch (e) {
    console.log(`[API] GET /api/ipinfo - Response: FAILED (parse error)`);
    console.log(`[ERROR] Parse error: ${e.message}`);
    res
      .status(500)
      .json({ ok: false, error: "Failed to parse ipinfo", raw: result.output });
  }
});

app.listen(PORT, () => {
  console.log(`NordVPN dashboard running on port ${PORT}`);
});
