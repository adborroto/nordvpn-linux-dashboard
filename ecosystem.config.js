module.exports = {
  apps: [
    {
      name: "nordvpn-linux-dashboard",
      script: "src/server.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        PORT: 4722,
      },
    },
  ],
};
