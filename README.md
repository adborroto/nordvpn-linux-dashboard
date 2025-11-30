# NordVPN Linux Dashboard

A web-based dashboard for managing NordVPN on Linux systems. This application provides a simple interface to check VPN status, connect, disconnect, and view IP information.

## Features

- Check NordVPN connection status
- Connect to NordVPN (with optional country selection)
- Disconnect from NordVPN
- View current IP information
- Web-based dashboard interface

## Prerequisites

- Node.js (v14 or higher)
- NordVPN CLI installed and configured on your Linux system
- Sudo access (required for NordVPN commands)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/adborroto/nordvpn-linux-dashboard.git
cd nordvpn-linux-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

The dashboard will be available at `http://localhost:4722` (or the port specified by the `PORT` environment variable).

## Docker

Build and run with Docker:

```bash
docker build -t nordvpn-dashboard .
docker run -p 8080:8080 --network host nordvpn-dashboard
```

Note: The container needs access to the host's NordVPN CLI. You may need to mount the NordVPN binary or run with `--privileged` flag depending on your setup.

## API Endpoints

### GET `/api/status`

Get the current NordVPN connection status.

**Response:**

```json
{
  "ok": true,
  "output": "Status: Connected\nCurrent server: ..."
}
```

### POST `/api/connect`

Connect to NordVPN.

**Request body (optional):**

```json
{
  "country": "United States"
}
```

**Response:**

```json
{
  "ok": true,
  "output": "Connecting to ..."
}
```

### POST `/api/disconnect`

Disconnect from NordVPN.

**Response:**

```json
{
  "ok": true,
  "output": "You are disconnected from NordVPN."
}
```

### GET `/api/ipinfo`

Get current IP information.

**Response:**

```json
{
  "ip": "xxx.xxx.xxx.xxx",
  "city": "...",
  "region": "...",
  "country": "...",
  ...
}
```

## Configuration

- `PORT`: Server port (default: 4722)

## License

ISC
