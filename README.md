# Project Folder Structure

Folder structure for MVC (Model-View-Controller) project using Prisma, PostgreSQL, Node.js,Fastify.js and Jest. This structure promotes modularity and maintainability of the application.

## Folder Structure and Descriptions

- **src/controllers/**: Controllers for handling HTTP requests.
- **src/models/**: Prisma models for defining database schema.
- **src/routes/**: Fastify.js route definitions.
- **src/use-cases/**: Use cases representing specific business operations (Core of the application).
- **src/repositories/**: Repository methods for database interactions.
- **tests/**: Test files corresponding to use cases.

## Database Setup (Dockerized PostgreSQL)

1. Install Docker: Instructions [here](https://docs.docker.com/get-docker/).

2. Database Configuration: Create a `.env` file in the project root and specify database connection details. For example:

   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/mydatabase
   docker run --name my-postgres-db -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres:latest
   
3. Database Migrations: Apply Prisma migrations to create the database schema and tables. Run the following commands:
  ```bash
   npx prisma db push
   ```

## Getting Started

1. **Clone this repository.**

   ```bash
   git clone https://github.com/your-username/your-project.git
   cd your-project
   ```
2.Follow the "Database Setup" steps mentioned above.

3. Install dependencies using npm or yarn.
  ```bash
   npm install
  # OR
  yarn install
   ```
4. Set up your database connection in .env.
  ```env
  DATABASE_URL=postgresql://username:password@localhost:5432/mydatabase
   ```
5. Run your application using npm or yarn.
  ```bash
  npm start
  # OR
  yarn start
   ```
6. Run tests using Jest framework.
  ```bash
  npm test
  # OR
  yarn test
