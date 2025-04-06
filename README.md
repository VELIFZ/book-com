# Book E-Commerce Full Stack Application

A full-stack web application for buying and selling second-hand books, built with Flask backend API and React frontend.

## Project Structure

This project consists of two main components:

- **backend-book-ecom**: A Flask REST API with SQLAlchemy ORM and JWT authentication
- **frontend-book-ecom**: A React single-page application using Material-UI

## Backend Features

- RESTful API architecture
- JWT Authentication
- MySQL Database with SQLAlchemy ORM
- Advanced search capabilities
- User accounts & profiles
- Book listings with details
- Order management
- Reviews & Ratings
- Address management

## Frontend Features

- Modern UI with Material-UI components
- Responsive design
- User authentication flow
- Book browsing and search
- Seller and buyer interfaces
- Profile management
- Form validations
- Secure API communication

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.9+ 
- MySQL database

### Setup & Installation

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend-book-ecom

# Install dependencies
pip install -r requirements.txt

# Configure the database
# Edit .env file with your MySQL credentials

# Run migrations
flask db upgrade

# Start the backend server
flask run
```

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend-book-ecom/ecom-book-app

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

## API Endpoints

See the detailed API documentation in the backend README.md for a complete list of available endpoints.

## Configuration

### Backend Configuration

The backend uses environment variables for configuration. Create a `.env` file in the backend-book-ecom directory with the following variables:

```
SQLALCHEMY_DATABASE_URI=mysql+mysqlconnector://username:password@localhost/database_name
SQLALCHEMY_TRACK_MODIFICATIONS=False
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
FLASK_APP=app.py
FLASK_ENV=development
```

### Frontend Configuration

The frontend API service is configured in `src/api/bookApi.js` and `src/api/authApi.js`. By default, it connects to `http://localhost:5000` for the backend API.

## Running in Production

For production deployment:

### Backend

1. Use a production WSGI server like Gunicorn
2. Set `FLASK_ENV=production`
3. Use a proper database with backup and security measures

### Frontend

1. Build the production version: `npm run build`
2. Serve the static files with a web server like Nginx

## License

MIT License

## Acknowledgments

- Flask and SQLAlchemy for the powerful backend
- React and Material-UI for the beautiful frontend 