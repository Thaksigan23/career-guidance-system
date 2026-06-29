# Career Guidance Backend (Final Real Code)

## Setup

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:
   ```
   npm install
   ```
3. Create the database & tables:
   - Run `schema.sql` in your MySQL (phpMyAdmin / MySQL Workbench) or:
     ```
     mysql -u root -p < schema.sql
     ```
4. Start server (development):
   ```
   npm run dev
   ```
5. API will be available at `http://localhost:5000/api`

## Notes
- JWT secret must be set in `.env`
- The project uses ESM modules (`type: "module"`) in package.json
- Controllers and routes are pre-wired
