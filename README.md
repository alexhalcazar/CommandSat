# CommandSat

CommandSat is a web application that lets users explore satellites orbiting Earth and experience a simulated Mission Control environment. Users can send commands to satellites, receive live telemetry, and interact with the resulting data, providing an educational and engaging way to understand satellite operations.

## Prerequisites

- Node.js (20.19+ or 22.12+)
- npm (comes with Node)
- N2YO account and API key

## Installation

1. Clone the Repository and install dependencies:

```bash
git clone https://github.com/alexhalcazar/CommandSat.git
cd CommandSat
npm install
```

## Running the Application

This project has a **backend** and **frontend** that must be run separately.

### 1. Start the backend

```bash
cd backend
npm install
npm start
```

For more details, see the backend README: [CommandSat Backend](./backend/README.md)

### 2. Start the frontend (in a new terminal)

```bash
cd frontend
npm install
npm start
```

For more details, see the frontend README: [CommandSat Frontend](./frontend/README.md)

## Usage

Using your browser, navigate to your local frontend server [localhost](http://localhost:5173/).  
To view satellites currently above your location, click the button with the **satellite icon**.

> Note: This feature requires an N2YO API key configured in your environment variables.

## Authors

Alex Alcazar
