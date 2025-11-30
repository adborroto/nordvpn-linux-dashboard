const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 4722;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

function runCommand(cmd) {
  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        resolve({ ok: false, output: stderr || stdout || error.message });
      } else {
        resolve({ ok: true, output: stdout });
      }
    });
  });
}

app.get("/api/status", async (req, res) => {
  const result = await runCommand("sudo nordvpn status");
  res.json(result);
});

app.post("/api/connect", async (req, res) => {
  const { country } = req.body || {};
  const target = country
    ? `sudo nordvpn connect ${country}`
    : "sudo nordvpn connect";
  const result = await runCommand(target);
  res.json(result);
});

app.post("/api/disconnect", async (req, res) => {
  const result = await runCommand("sudo nordvpn disconnect");
  res.json(result);
});

app.get("/api/ipinfo", async (req, res) => {
  const result = await runCommand("curl -s https://ipinfo.io/json");
  res.setHeader("Content-Type", "application/json");
  try {
    res.send(JSON.parse(result.output));
  } catch (e) {
    res
      .status(500)
      .json({ ok: false, error: "Failed to parse ipinfo", raw: result.output });
  }
});

app.listen(PORT, () => {
  console.log(`NordVPN dashboard running on port ${PORT}`);
});
