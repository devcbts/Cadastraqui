# System Modules

## Abstract

- `@types`: This directory contains TypeScript type declarations
- `env`: May contain files related to the configuration of environment variables that the system uses.
- `errors`: Likely contains classes or functions to handle errors and exceptions.
- `http`: This module might include abstractions for handling HTTP protocols, such as HTTP clients or server configurations.
- `controllers`: Contains the logic to connect incoming requests with model operations and server responses. Typical in MVC architectures, where they define the interaction logic between model and view.
  - `admin`: Specific logic for admin functions.
  - `candidates`: Likely manages logic for candidate and legal responsible.
  - `entities`: May manage CRUD operations and business logic for different domain entities.
  - `legal-responsible`: Functions for handling operations related to legal guardians.
  - `social-assistant`: Similar to other controllers but for social assistants.
  - `users`: Manages user logic, like authentication and profile management.
- `middlewares`: Code that runs in between the request and the response, like authentication and authorization functions.
  - `verify-jwt.ts`: Middleware to verify JSON Web Tokens, used in authentication.
  - `verify-role.ts`: Middleware to verify user roles, probably for access control.
- `services`: Contains services that encapsulate business logic and interaction with databases or other services.
  - `download-file.ts`: Service for downloading files.
  - `get-file.ts`: Service for retrieving a specific file.
  - `get-files.ts`: Service for retrieving multiple files.
  - `send-mail.ts`: Service for sending emails.
  - `upload-file.ts`: Service for uploading files.
- `lib`: Libraries or utilities that can be shared across different parts of the application.
  - `axios.ts`: Likely a utility for making HTTP requests with the Axios library.
  - `multer.ts`: Utility for handling file uploads.
  - `prisma.ts`: Utility for interacting with the database, using the Prisma ORM.
  - `s3.ts`: Utility for interacting with Amazon S3, an object storage service.
  
 - `app.ts`: The main entry point of the application or central app configuration.
 - `server.ts`: Server configuration, like starting and stopping the server, setting ports, etc.


## App Module
The  `app.ts`  file is the main entry point of the application. It sets up the Fastify application, registers plugins, and defines routes and error handling.

1.  **Fastify Application Setup**:  It's used here to create the main application instance.
    
2.  **Plugin Registration**: Several plugins are registered to the Fastify application, including  `fastifyJwt`  for handling JSON Web Tokens,  `fastifyCookie`  for handling cookies,  `fastifyMultipart`  for handling multipart/form-data, and  `fastifyCors`  for handling Cross-Origin Resource Sharing (CORS).
    
3.  **Routes Registration**: The routes for different parts of the application are registered here. Each set of routes is associated with a **specific prefix**, such as `/candidates` for candidate routes, `/entities` for entity routes, etc. This is very important, because a `/info` route inside the **candidates** module will have an request route of `/candidates/info`, for example. 
    
4.  **Middleware**: Middleware functions like  `morgan`  for logging and  `verifyJWT`  for JWT verification are used.
    
5.  **Error Handling**: An error handler is set up to handle any errors that occur during the processing of requests. It specifically checks for instances of  `ZodError`  (a validation error) and handles them separately.
    
7.  **Authentication**: Routes for authentication-related actions like session creation, password reset, and logout are defined.
## Controllers Modules
Inside all the controllers folders you will find an `register.ts` for handling the registration of each role, and a `routes.ts` , witch contains all the routes inside of each module.
### Users
This module is responsible for managing user authentication within the application. It interacts directly with the User Table in the database and provides a set of functionalities tailored to handle various user-related tasks.


1.  **User Authentication**: Handles the authentication process for each user type, ensuring secure access to the application.
    
2.  **Password Management**: Provides routes for changing the user's password, enhancing the security and privacy of user data.
    
3.  **Logout Functionality**: Manages the process of securely logging out users from the application, ensuring that sessions are properly terminated.
    
4.  **Profile Picture Management**: Handles the uploading and updating of user profile pictures, allowing users to personalize their profiles.
    
### Admin
This module is designed to provide administrative functionalities within the application. It interacts with various tables in the database, including Candidates, Entities, and Announcements, providing a comprehensive overview and management capabilities for these data points.

1.  **Candidate Overview**: Allows the admin to view all registered candidates, providing a comprehensive list and details of each candidate.
    
2.  **Entity Management**: Admins have the ability to view all entities registered within the system. They can also register new entity matrices as needed, providing flexibility in managing the entities involved in the application.
    
3.  **Announcement Monitoring**: This feature enables admins to view all announcements made within the system. It provides a complete overview of all active and past announcements.

### Candidates
This module is designed to cater to the needs of the candidates within the application. It provides a wide range of functionalities, allowing candidates to manage their personal information, family group details, social conditions, and applications for announcements. The **USER** candidate has to be 18 or above to be able to register.


1.  **Personal and Family Information Registration**: Candidates can register and update their personal information and details about their family group. This comprehensive data collection ensures a thorough understanding of the candidate's background.
    
2.  **Social Condition Registration**: This feature allows candidates to register their social conditions. This information is crucial as it is used in the announcement evaluation process.
    
3.  **Application Management**: Candidates have the ability to apply for various announcements. They can manage their applications and track their progress.
    
4.  **Solicitations Management**: Candidates can view and respond to solicitations from the social assistant, ensuring effective communication and prompt action on any requests or requirements.
    
5.  **Application Progress Tracking**: This feature provides candidates with the ability to track the progress of each of their applications, keeping them informed about their status and any updates.
    


### Legal-Responsible


This module is designed to cater to the needs of the legal guardians within the application. It provides a wide range of functionalities, similar to the candidate module, but with the added capability of managing multiple candidates simultaneously.

1. **Multi-Candidate Management**: Legal responsibles can manage the information and applications of multiple candidates at a time. This feature is particularly useful for responsibles who are responsible for several candidates.

2. **Personal and Family Information Registration**: Legal responsibles can register and update their personal information and details about their family group. This comprehensive data collection ensures a thorough understanding of the guardian's background and the candidates they are responsible for.

3. **Social Condition Registration**: This feature allows legal responsibles to register the social conditions of their candidates. This information is crucial as it is used in the announcement evaluation process.

4. **Application Management**: Legal responsibles have the ability to apply for various announcements on behalf of their candidates. They can manage these applications, track their progress, and update information as needed.

5. **Solicitations Management**: Legal responsibles can view and respond to solicitations from the social assistant on behalf of their candidates, ensuring effective communication and prompt action on any requests or requirements.

6. **Application Progress Tracking**: This feature provides legal responsibles with the ability to track the progress of each of their candidates' applications, keeping them informed about their status and any updates.

The legal responsible uses **almost all the same routes as the candidate**, because the logic for registering the social information is basically the same.

### Entities

This module is designed to cater to the needs of the entities within the application. It provides a wide range of functionalities, allowing entities to manage their announcements, subsidiaries, social assistants, and directors.

1. **Announcement Management**: Entities have the ability to create and manage the entire announcement process. This includes creating new announcements, updating existing ones, and tracking the progress of each announcement.

2. **Subsidiary Registration**: Entities can register their subsidiaries within the system. This allows for a better organization for the announcements, because the subsidiaries can host some of the vacancies offered.

3. **Social Assistant and Director Registration**: Entities can register their social assistants and directors. This ensures that all key personnel are accounted for within the system.

4. **Entity Matrix Registration**: The registration of the entity matrix is handled by the system admin. 


### Social-Assistant

This module is designed to cater to the needs of the social assistants within the application. It provides a wide range of functionalities, allowing social assistants to manage candidate applications, make solicitations, write reports, and approve or reject applications.

1. **Application Review**: Social assistants have the ability to view and review candidate applications. This includes accessing detailed information about each application and the candidate's social details.

2. **Solicitation Creation**: Social assistants can create solicitations for candidates. This feature allows them to request additional information or actions from the candidates.

3. **Report Writing**: Social assistants can write detailed reports about the candidates and their applications. This feature allows them to document their observations and findings for future reference.

4. **Application Approval/Rejection**: Social assistants have the authority to approve or reject candidate applications. This feature allows them to control the outcome of each application based on their assessments.

5. **Access to Social Details**: Social assistants are the only users, besides the candidates themselves, who can view the social details registered by the candidates.

## Middlewares
The middlewares act before the request get to the function at the api endpoint. For now, there are two middlewares in this project.
1. `verify-jwt` : It´s an authentication middleware, it ensures that the auth token in the request is valid. This middleware filter the requests by the users that are logged in the server.
2. `verify-role`: Verify the role of the user in the request, it ensures that the type of user who´s getting access to the API endpoint is the desirable one.
## Services
General services for the plataform, such as file handling and mail service. For the file handling services, it uses the AWS S3 functions registered in lib.

## Libraries

1. **Axios.ts**: This file contains the setup for Axios, a popular, promise-based HTTP client that allows the application to make HTTP requests to external resources. It's used for handling API requests and responses.

2. **Prisma.ts**: This file sets up Prisma, an open-source database toolkit. It's used for object-relational mapping (ORM), enabling the application to interact with the database using JavaScript objects and methods.

3. **Multer.ts**: This file contains the setup for Multer, a middleware for handling `multipart/form-data`, which is primarily used for uploading files. Although it's not currently in use, it can be utilized in the future for file upload functionalities.

4. **S3.ts**: This file sets up the Amazon Simple Storage Service (S3) client. It provides functionalities for uploading and downloading files to and from AWS S3. The S3 service is a scalable object storage for data archiving, backup and recovery, and analytics.

These libraries are encapsulated within the 'lib' folder of the project. They are designed to provide a set of reusable functionalities that can be used across different parts of the application.

