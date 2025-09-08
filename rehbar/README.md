## Run with Docker

You can run this project in a containerized environment using Docker and Docker Compose. This setup uses Node.js 18 (alpine) and Yarn 4.9.4 as specified in the Dockerfile.

### Build and Start the App

First, ensure Docker and Docker Compose are installed on your system.

To build and start the app:

```bash
docker compose up --build
```

This will build the image using `Dockerfile.dev` and start the service defined in `docker-compose.yml`.

### Ports

- The app will be available at [http://localhost:3000](http://localhost:3000) (port 3000 is exposed).

### Environment Variables

- If you have a `.env` file, you can enable it by uncommenting the `env_file: ./.env` line in `docker-compose.yml`.
- No required environment variables are specified by default, but you can add your own as needed for your setup.

### Special Configuration

- The Docker setup uses a multi-stage build for optimized production images and runs the app as a non-root user for security.
- Yarn cache is used during build for faster dependency installation.
- No external services (such as databases) are configured by default. If you add services, update `docker-compose.yml` accordingly.

For more details, see the provided `Dockerfile.dev` and `docker-compose.yml` files.