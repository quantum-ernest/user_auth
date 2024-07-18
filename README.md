# User Authentication System

This project implements a user authentication system where users can register, login, and manage their profiles.
The system supports login via OTP (One-Time Password) sent to the user's email as well as traditional username and
password login. The frontend is built with React.js, and the backend is powered by Django and Django Rest Framework.
## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack and Architecture](#tech-stack-and-architecture)
3. [Backend](#backend)
   - [Tech Stack](#tech-stack)
   - [Models](#models)
   - [API Endpoints](#api-endpoints)
4. [Frontend](#frontend)
   - [Tech Stack](#tech-stack-frontend)
   - [Components](#components)
5. [Setup and Installation](#setup-and-installation)
6. [Usage](#usage)

## Project Overview

This project implements a user authentication system with the following features:
- User registration with a unique username, email, and password.
- Login using an OTP sent to the user's email.
- Login using a username and password.
- Profile management where users can update their full name and bio.
- Secure handling of user data and authentication.

## Tech Stack and Architecture

### Backend

#### Tech Stack

- **Django**: Web framework for building the backend application.
- **Django Rest Framework**: For building RESTful APIs.
- **PostgreSQL**: Database engine.
- **pydantic_settings**: For environment variable validation.
- **gunicorn**: WSGI HTTP Server for UNIX.
- **django.core.mail**: For sending OTP emails.
- **Redis**: For storing OTPs with expiration.

#### Models

- **CustomUser**: Extends Django's AbstractUser model.
  - Fields: `username`, `email`, `password`, etc.
- **Profile**: Stores additional user information.
  - Fields: `user_id` (foreign key to CustomUser), `full_name`, `bio`.

#### API Endpoints

- **User Registration**: `POST /users/`
  - Registers a new user.
- **Generate OTP**: `POST /generate-otp/`
  - Sends an OTP to the user's email.
- **Login with OTP**: `POST /login/`
  - Logs in a user using the OTP.
- **Login with Username and Password**: `POST /login/username/`
  - Logs in a user using their username and password.
- **Profile Management**: `GET /profile/<user_id>/`, `PUT /profile/<user_id>/`
  - Retrieve and update user profile.

### Frontend

#### Tech Stack

- **React.js**: JavaScript library for building user interfaces.
- **React Router**: For routing and navigation.
- **CSS**: For styling the components.

#### Components

- **AuthForm**: Handles switching between login and signup forms.
- **LoginForm**: Manages login via OTP and username/password.
- **SignUpForm**: Manages user registration.
- **Profile**: Displays and allows updates to the user profile.


## Setup and Installation

### Backend

1. Clone the repository:
   ```sh
   git clone https://github.com/quantum-ernest/user_auth.git
   cd user_auth/api/
2. Install Dependencies: Make sure to setup Redis and Postgresql
    ```sh
   pip install -r requirements.txt
3. Create .env file from user_auth/api/env.example.txt
4. Run migrations:
    ```sh
   python manage.py migrate
5. Start dev server:
    ```sh
   python manage.py runserver

### Frontend

1. Navigate to the front directory:
    ```sh
   cd user_auth/front/
2. Install dependencies
    ```sh
   npm install
3. Start dev server
    ```sh
   npm start
