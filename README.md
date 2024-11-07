# Ice Bank

Application for IcePanel engineering interview task

## Table of Contents

1. [Description](#description)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Initial Setup](#initial-setup)
5. [Running the Projects](#running-the-projects)
    - [Option 1: Full Launch with Docker](#option-1-full-launch-with-docker)
    - [Option 2: Local Development Launch](#option-2-local-development-launch)
6. [Running the Backend Project](#running-the-backend-project)
7. [Running the Frontend Project](#running-the-frontend-project)
8. [Setting Up Minio](#setting-up-minio)
9. [User Registration](#user-registration)
10. [Running Backend E2E Tests](#running-backend-e2e-tests)
11. [Additional Commands](#additional-commands)
12. [Swagger Documentation](#swagger-documentation)
13. [Notes](#notes)

## Description

This repository contains two projects:

- **Backend**: Nest.js (`backend`)
- **Frontend**: Vue.js (`frontend`)

The projects use a database, Minio, and Redis Stack, which are set up with Docker Compose.

## Project Structure

- **backend/** - Nest.js application (backend).
- **frontend/** - Vue.js application (frontend).
- **architecture/** - project architecture documentation:
    - **datamodel.md** - data model description.
    - **endpoints.md** - API endpoint description.
- **stand-deploy/** - configuration for the demo environment.
- **.github/** - pipeline for building images.
- **docker-compose.yml** - Docker container configuration.
- **.env.example** - example environment configuration file.

## Prerequisites

- [pnpm](https://pnpm.io/installation) installed
- [Docker](https://www.docker.com/get-started) installed

## Initial Setup

1. Clone the repository and navigate to its directory:
   ```bash
   git clone https://github.com/xaosaki/ice-bank.git
   cd ice-bank
   ```

2. Copy the `.env.example` files and rename them to `.env`:
   ```bash
   cp .env.example .env  # in the root of the repository

   cd backend && cp .env.example .env  # for backend
   cd ..
   ```

3. Install dependencies for the backend and frontend projects using pnpm:
   ```bash
   # Backend
   cd backend && pnpm install
   cd ..

   # Frontend
   cd frontend && pnpm install
   cd ..
   ```

## Running the Projects

You have two options to run the projects: fully through Docker or for development purposes.

### Option 1: Full Launch with Docker

If you want to quickly see all components working, run all services using Docker Compose:

```bash
# Launch all Docker containers

docker compose up -d
```

This command will start the database, Minio, Redis Stack, as well as the Backend and Frontend applications.
After this, you'll only need to set up Minio as described in the [Setting Up Minio](#setting-up-minio) section,
and then restart the backend container using the following command:

```bash
docker compose restart app
```

### Option 2: Local Development Launch

For development, you can run only the required components.

1. Start the database, Minio, and Redis Stack using Docker Compose:
   ```bash
   docker compose up -d db minio redis
   ```

2. Then, run the Backend and Frontend using the instructions below.

## Running the Backend Project

The backend includes Swagger documentation available at `http://localhost:3007/api#/`.

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Start the server using pnpm:
   ```bash
   pnpm start:dev
   ```

The backend will be available at `http://localhost:3007`.

## Running the Frontend Project

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Start the project using Vite:
   ```bash
   pnpm dev
   ```

The frontend will be available at `http://localhost:5173`.

## Setting Up Minio

After launching the Docker containers, you need to perform the following steps to set up Minio:

1. Go to the Minio web interface at `http://localhost:9000`.
2. Log in using the credentials specified in the `.env` file.
3. Create a new bucket to be used by your application.
4. Create an access token to interact with Minio.
5. Put token and secret to the `.env` files.

## User Registration

To use the application functionality, you need to register users through the interface.
There is no need to manually create entries in the database; all necessary data will be created automatically upon registration.

## Running Backend E2E Tests

To run E2E tests for the backend (`test:e2e`), you need to start the test database. Use Docker Compose to launch the `db-test` database:

```bash
# Launch the test database
docker compose up -d db-test
```

After that, you can run the tests with the following command:
```bash
pnpm test:e2e
```

## Additional Commands

- **Stopping Docker containers**:
  ```bash
  docker compose down
  ```

- **Viewing container logs**:
  ```bash
  docker compose logs -f
  ```

## Swagger Documentation

Swagger documentation for the backend is available at `http://localhost:3007/api#/`.

## Notes

- Ensure that all dependencies are installed correctly before running the projects.
- If you make changes to the `.env` files, restart the projects to apply the new settings.
