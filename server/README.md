# Reiki Develop Server

## Database Setup

This project requires MongoDB. The database is configured to have the following collections:

- Users
- News
- Partners
- Portfolios
- Settings
- Teams
- Services
- Testimonials
- Clients
- FAQs
- Contacts

## Seeding the Database

To initialize your database with sample data, you can use the provided seed script. This will create all necessary collections and populate them with initial data.

### Prerequisites

1. Make sure MongoDB is running
2. Ensure your `.env` file contains the `MONGO_URI` variable pointing to your MongoDB instance

### Running the Seed Script

```bash
# Navigate to the server directory
cd server

# Run the seed script
node seed.js
```

### What the Seed Script Creates

- An admin user (username: admin, password: admin123)
- Sample news articles
- Sample partners
- Sample portfolio items
- Website settings
- Team members
- Services
- Testimonials
- Clients
- FAQs
- Sample contact form submissions

## Database Synchronization

To synchronize your local development database with the production database, you can use the provided synchronization script.

### Prerequisites

1. Make sure your `.env` file contains both `MONGO_URI_DEV` and `MONGO_URI_PROD` variables
2. Ensure you have access to both databases

### Running the Synchronization Script

```bash
# Navigate to the server directory
cd server

# Make the script executable (first time only)
chmod +x sync-db.sh

# Run the synchronization script
./sync-db.sh
```

Alternatively, you can run the script directly with Node:

```bash
node scripts/directSync.js
```

### What the Synchronization Script Does

- Connects to your local development database
- Retrieves all data from all collections
- Connects to the production database
- Updates existing documents or creates new ones in the production database
- Provides a summary of created and updated documents

## Important Notes

- The seed script will delete all existing data in these collections before creating new data
- All image paths in the seed data are placeholders and should be updated with actual image paths
- You should change the admin password after first login for security reasons
- Always backup your production database before running the synchronization script

## Database Schema

Each collection follows a specific schema as defined in the `models` directory. Refer to the individual model files for detailed field information.