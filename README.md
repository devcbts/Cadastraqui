

# Project Folder Structure

  

Folder structure for MVC (Model-View-Controller) project using Prisma, PostgreSQL, Node.js,Fastify.js and Jest. This structure promotes modularity and maintainability of the application.

  

## Folder Structure and Descriptions

  

-  **src/http/controllers/**: Controllers for handling HTTP requests.

-  **src/http/middlewares**: Middlewares for the HTTP requests.

-  **src/http/services**: General services for the plataform, such as file handling and mail service .

-  **src/lib/**: General purpose functions for the services in the plataform, such as AWS, Prisma, Axios, etc .
- **src/env/**:  Parse the .env to the server
- **src/errors/**: Error messages for the HTTP requests. Do not include the HTTP status code

  

## Database Setup (Dockerized PostgreSQL)

  

1. Install Docker: Instructions [here](https://docs.docker.com/get-docker/).

  

2. Database Configuration: Create a `.env` file in the project root and specify database connection details. For example:

  

```env

DATABASE_URL=postgresql://username:password@localhost:5432/mydatabase

docker run --name my-postgres-db -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres:latest
``` 

3. Database Migrations: Apply Prisma migrations to create the database schema and tables. Run the following commands:

```bash

npx prisma db push

```
4. To start the service, navigate to the directory containing the  `docker-compose.yml`  file and run the following command in the terminal:

```bash
docker-compose  up
 ```
 5. You can also use Docker Desktop to run the project container

## Getting Started

  

1.  **Clone this repository.**

  

```bash

git clone https://github.com/your-username/your-project.git

cd your-project

```

2. Follow the "Database Setup" steps mentioned above.

  

3. Install dependencies using npm or yarn.

```bash

npm install

# OR

yarn install

```

4. Set up your database connection in .env .

```env

DATABASE_URL=postgresql://docker:docker@localhost:5432/cadastraqui

```

5. Run your application using npm or yarn.

```bash

npm start

# OR

yarn start

```
# Code patterns

## Route Creation

All the server´s modules are declared in the **src/app.ts** file. Inside of each module you can find a similar pattern as the example bellow:

```ts
export async function roleRoutes (app : FastifyInstance) {

	app.get("/some-route", {onRequest : [verifyJWT]}, routeGetFunction) 
	app.post("/some-route", {onRequest : [verifyJWT]}, routePostFunction)
	app.patch("/some-route", {onRequest : [verifyJWT]}, routePatchFunction)
	app.delete("/some-route", {onRequest : [verifyJWT]}, routeDeleteFunction)
}
``` 
The ``app.action`` function take three arguments. First a string, which contains the route to the function. After that, comes a middleware, that in this case, for all the routes that require some form of authentication, it´ll be the ``verifyJWT`` middleware. And at the end we have the function that will be called when the route is acessed.

## CRUD code

Take as example the following code: 
```ts
const  ItemSchema = z.object({
id:  z.string(),
name:  z.string(),
description:  z.string(),
})

export  async  function  createItem(request: FastifyRequest, reply: FastifyReply) 
{
	const { name, description } = ItemSchema.parse(request.body)
	try {
		const user_id = request.user.sub

		// Generic role (can be an candidate, entity, etc)
		const role = await prisma.roleTable.findUnique({
		where: {user_id}
		})
		// if the request user does not exists in the selected table
		if (!role){
			throw new Error();
		}
		const  newItem = await  prisma.item.create({
		data: { name, description },
		})
		return  reply.status(201).send(newItem)

	} catch (err: any) {

		if (err instance of Error){
			return reply.status(401).send({message: err.message})
		}
			
		return  reply.status(500).send({ message:  err.message })
	}
}
```
The code uses Zod to validade the **body** or the **params** of the request. Also the request and reply are formatted by the Fastify Framework. 

When no errors ocurr, the code will do an action (`create`, `update`, `get`, `delete`) in the database using **prisma** .

# Testing

## How to test the api endpoints
	
1. Use an api testing app (Postman or Insomnia)
2. Create a new request
3. Put the url and the correct request method.

If you want to test api endpoints that require authentication, you have to do the following:

1. Identify the type of user role allowed by the endpoint
2. Log as this role
3. Get the authorization token returned by the response
4. Use this authorization token in all the following requests


