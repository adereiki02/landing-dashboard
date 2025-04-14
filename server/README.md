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

## Important Notes

- The seed script will delete all existing data in these collections before creating new data
- All image paths in the seed data are placeholders and should be updated with actual image paths
- You should change the admin password after first login for security reasons

## Database Schema

Each collection follows a specific schema as defined in the `models` directory. Refer to the individual model files for detailed field information.