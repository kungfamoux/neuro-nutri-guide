# NeuroNutri Guide

## Overview

NeuroNutri Guide is a cutting-edge platform that combines medical data analysis with machine learning to provide personalized nutrition and lifestyle recommendations for stroke prevention and recovery. The application helps users assess their stroke risk and receive tailored dietary advice based on their health profile.

## Features

- **Personalized Stroke Risk Assessment**: Input health metrics to receive a personalized stroke risk evaluation
- **Nutritional Analysis**: Get detailed analysis of your current nutrition intake
- **Personalized Recommendations**: Receive customized dietary and lifestyle recommendations
- **Progress Tracking**: Monitor your health metrics and improvements over time

## Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **UI Library**: Shadcn UI components
- **State Management**: React Context API
- **Routing**: React Router
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (Python)
- **Machine Learning**: scikit-learn, imbalanced-learn
- **Data Processing**: pandas, numpy

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Python (3.9 or later)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/neuro-nutri-guide.git
   cd neuro-nutri-guide
   ```

2. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up the backend**
   ```bash
   cd ../backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
neuro-nutri-guide/
├── frontend/               # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── App.tsx         # Main application component
│   └── ...
│
├── backend/                # Backend FastAPI application
│   ├── app/
│   │   ├── models/         # Data models
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI application entry point
│   └── ...
└── ...
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
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

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6a2b9298-fcc4-4322-bef1-cbf6d44d7abe) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
