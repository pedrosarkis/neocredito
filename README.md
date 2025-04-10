# GitHub Repository Manager

This project is a full-stack application that allows you to search for GitHub users, view and export their repositories, and import them for storage and visualization.

## Project Structure

- **Frontend**: React application for the user interface
- **Backend**: Node.js API server with a clean architecture
- **Worker**: Background processor for repository data
- **Database**: MariaDB for data persistence
- **Message Queue**: RabbitMQ for asynchronous processing

## Features

- Search for GitHub users
- View and export user repositories to CSV
- Import repositories into the database
- Process repositories in the background using a message queue
- View and filter stored repositories

## Prerequisites

- Docker and Docker Compose
- Git
- Bash shell (for running the startup script)
- Optional: GitHub API token for higher rate limits

## Running the Project

### Using the Script (Recommended)

The easiest way to run the project is using the provided script:

```bash
# Make the script executable (if needed)
chmod +x run.sh

# Run the script
./run.sh
```

### Manual Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd github-repository-manager
```

2. Optional: Set a GitHub API token for higher rate limits:
```bash
export GITHUB_TOKEN=your_github_token_here
```

3. Start the application:
```bash
docker-compose down --remove-orphans
docker-compose build
docker-compose up -d
```

## Accessing the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001/api
- **RabbitMQ Management UI**: http://localhost:15672 (guest/guest)
- **MariaDB**: localhost:3306 (root/root)

## API Endpoints

### GitHub User Operations

- `GET /api/github/users/search?username=<username>` - Search for a GitHub user
- `GET /api/github/users/repositories?username=<username>` - Get repositories for a GitHub user
- `GET /api/github/users/repositories/export?username=<username>` - Export repositories as CSV

### Repository Operations

- `POST /api/repositories/import` - Import repositories from JSON
- `GET /api/repositories?owner=<owner>` - Get stored repositories, optionally filtered by owner

## Development

### Backend

The backend is built using a clean architecture approach with TypeScript. Key components:

- **Domain Layer**: Core business logic with entities and repository interfaces
- **Application Layer**: Use cases that orchestrate domain operations
- **Infrastructure Layer**: Database, API, and message queue implementations
- **Adapters**: Connect infrastructure to domain through interfaces
- **Presentation Layer**: Controllers and routes for HTTP requests

### Frontend

The frontend is built with React and TypeScript. Key components:

- **Services**: API client functions for backend communication
- **Components**: UI components for search, display, and import
- **Screens**: Main application screens (Search and Import)

## Troubleshooting

If you encounter issues:

1. Check the logs:
```bash
docker-compose logs -f
```

2. Ensure all services are running:
```bash
docker-compose ps
```

3. Restart the services:
```bash
docker-compose restart
```

4. Start fresh:
```bash
docker-compose down -v
docker-compose up -d
```

## License

ISC 