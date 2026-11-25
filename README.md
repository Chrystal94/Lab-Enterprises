# LAB Enterprises

A static website with a Node.js API for events and portal applications.

## Run locally

Requires Node.js 18 or newer. From the repository root, set an administrator password and start the server:

```bash
export ADMIN_PASSWORD="$(openssl rand -base64 32)"
npm start
```

On Windows PowerShell:

```powershell
$env:ADMIN_PASSWORD = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
npm start
```

Open `http://localhost:3000`. The admin login email defaults to `abdulsalamlukman644@outlook.com`; set `ADMIN_EMAIL` to change it. The server will refuse to start unless `ADMIN_PASSWORD` is set to at least 16 characters. Never commit secrets into the repository.

## Configuration

- `PORT` — server port (default: `3000`; hosting providers usually set this)
- `ADMIN_EMAIL` — administrator email (default: `abdulsalamlukman644@outlook.com`)
- `ADMIN_PASSWORD` — required unique secret, at least 16 characters
- `LAB_DATA_FILE` — JSON data file path (default: `./data/site-data.json`)

Data currently uses a JSON file. For production, use persistent disk storage or migrate to a managed database; ephemeral hosting filesystems may erase data during redeploys.

## Deploy on Render

The included `render.yaml` defines a Node web service. Connect this repository in Render, add a unique `ADMIN_PASSWORD` (at least 16 characters) as a secret environment variable in the Render dashboard, then deploy. Do not put that value in `render.yaml` or Git. Configure persistent storage for `data/site-data.json` before collecting real application data.

## Other Node hosts

Use Node.js 18 or newer, set the repository root as the working directory, set `ADMIN_PASSWORD` in the host's secret/environment-variable settings, then use `npm start` as the start command. To run locally, clone the repo and run the commands above. I cannot start a process on your computer or publish the app to a hosting account from this repository connection.
