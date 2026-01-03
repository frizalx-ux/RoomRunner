# Welcome to RoomRunner

## Project info

A real-world object platformer game where you jump across your furniture!

## How can I run this code?

**Use your preferred IDE**

Clone this repo and push changes. The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Create .env file with your Supabase credentials
# For Windows PowerShell:
@"
VITE_SUPABASE_URL=https://fukemjnwdbhhllcqzilw.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1a2Vtam53ZGJoaGxsY3F6aWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNzY2MzUsImV4cCI6MjA4Mjk1MjYzNX0.dKTOZ1cb7LnV7LSXFYM74GHJ5x0PbRFynncSp6Yj_ss
VITE_SUPABASE_PROJECT_ID=fukemjnwdbhhllcqzilw
"@ | Out-File -FilePath .env -Encoding utf8

# For Mac/Linux:
cat > .env << EOF
VITE_SUPABASE_URL=https://fukemjnwdbhhllcqzilw.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1a2Vtam53ZGJoaGxsY3F6aWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNzY2MzUsImV4cCI6MjA4Mjk1MjYzNX0.dKTOZ1cb7LnV7LSXFYM74GHJ5x0PbRFynncSp6Yj_ss
VITE_SUPABASE_PROJECT_ID=fukemjnwdbhhllcqzilw
EOF

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (backend)

## How can I deploy this project?

### Local Development
Run `npm run dev` and open http://localhost:8080

### Cloud Deployment (GCP Cloud Run)
1. Build Docker image: `docker build -t roomrunner .`
2. Push to container registry
3. Deploy to Cloud Run

## Author

frizaltech - @riskybanana
