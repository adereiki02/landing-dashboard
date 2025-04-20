# CORS Fix Instructions

## Problem

Your website at `https://www.reikidevs.com` is experiencing CORS (Cross-Origin Resource Sharing) errors when trying to access the backend API at `https://reikidevs-official-production.up.railway.app`. This is because the backend is configured to only allow requests from `https://reikidevs-official.vercel.app`.

## Solution

You need to update the CORS configuration on your backend server to allow requests from your new domain. Here are the steps:

### 1. Update the server.js file

Replace the current CORS configuration in `server/server.js` with the following:

```javascript
app.use(cors({
  origin: [config.frontendUrl, 'https://www.reikidevs.com', 'https://reikidevs.com'],
  credentials: true
}));
```

This will allow requests from both your original domain and your new domain.

### 2. Update the config.js file

Update the `frontendUrl` configuration in `server/config/config.js` to include a default value:

```javascript
// Frontend URL
frontendUrl: process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL_PROD || 'https://reikidevs-official.vercel.app'
  : process.env.FRONTEND_URL_DEV || 'http://localhost:3000',
```

### 3. Update Environment Variables

If you're using Railway.app for hosting, update the `FRONTEND_URL_PROD` environment variable to include your new domain:

```
FRONTEND_URL_PROD=https://reikidevs-official.vercel.app,https://www.reikidevs.com,https://reikidevs.com
```

Or, if you prefer, you can set it to just your new domain:

```
FRONTEND_URL_PROD=https://www.reikidevs.com
```

### 4. Deploy the Changes

Deploy these changes to your backend server on Railway.app.

## Alternative Solution

If you can't update the backend immediately, you can set up a proxy server that will forward requests from your frontend to your backend. This can be done using services like Cloudflare Workers or by setting up a simple proxy server using Node.js.

## Testing

After deploying the changes, test your website to ensure that the API requests are working correctly. You should no longer see CORS errors in the browser console.