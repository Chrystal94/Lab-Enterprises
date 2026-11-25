# LAB Enterprises

A complete static website with a Node.js API for events and portal applications.

## Run locally

```bash
npm start
```

Open `http://localhost:3000`.

## Environment variables

- `PORT` — server port (default: `3000`)
- `ADMIN_EMAIL` — administrator email (default: `abdulsalamlukman644@outlook.com`)
- `ADMIN_PASSWORD` — administrator password (change before deployment; default: `change-me-now`)
- `LAB_DATA_FILE` — JSON data file path (default: `./data/site-data.json`)

Data is stored in JSON for zero-dependency hosting. For production, replace this with a managed database.

## Deploy

Deploy with Node 18 or newer and keep the repository root as the working directory. Start the process with `npm start`.

The included server serves every static HTML, CSS, JavaScript, and image file and provides the `/api/*` endpoints used by the website.
