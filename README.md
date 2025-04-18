# MERN Stack Application

## Fixing Proxy Error for Portfolio Images

If you're experiencing proxy errors like `Could not proxy request /uploads/portfolio/fashion-ecommerce.jpg from localhost:3000 to http://localhost:5000/`, follow these steps:

1. Make sure the backend server is running on port 5000
2. Run the script to create sample portfolio images:
   ```bash
   npm run create-sample-images
   ```
3. Restart both the server and client applications

## Image Loading in Development vs Production

The application has been updated to handle image loading differently in development and production environments:

- In development: Images are loaded through the proxy from the local server
- In production: Images are loaded from the production server URL

This is handled automatically by the `getImageUrl` utility function.

## Starting the Application

You can start both the server and client using the following command:

```bash
npm run dev
```

Or you can start them manually:

```bash
# Terminal 1 - Start the server
cd server
npm run dev

# Terminal 2 - Start the client
cd client
npm start
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs both the client and server in development mode.

### `npm run create-sample-images`

Creates sample portfolio images in the server/uploads/portfolio directory.

### `npm run client`

Runs just the React client in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run server`

Runs just the backend server in development mode.

### `npm run prod`

Runs the server in production mode.

### `npm run sync-db`

Synchronizes the database schema.

### `npm run install-all`

Installs dependencies for the root project, client, and server.
