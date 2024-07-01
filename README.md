# Postare

Postare is a full stack web app project that allows creative minds to post their thoughts and lifestyles in a shared space. It allows users to inspire each other to create, share and build their unique posts on the website. The website if deployed here [http://3.133.130.137:3000/].

## Technologies Used

- Frontend: Next.js, React, Chakra UI
- Backend: Spring Boot, Go
- Database: PostgreSQL
- Deployment: AWS (EC2, ECR, RDS)

## Features

- Secured user signup, login, and logout functionalities with Spring Security.
- Enable users to create, edit, and delete their posts.
- Implement a search functionality to find posts by keywords.
- Offer personalized recommendations based on user activity and preferences.
- Allow users to like, comment, and share posts.
- Enable users to customize their profiles with profile pictures, bios, and other personal details.
- Ensure the application is responsive and works well on various devices and screen sizes.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js
- npm or yarn
- Java Development Kit (JDK)
- Go
- Docker

### Installation

1. Clone the repository

   ```sh
   git clone https://github.com/wghong02/postare
   ```

2. Install npm packages

   ```sh
   npm install
   ```

3. Install Java dependencies using Gradle

   ```sh
   ./gradlew build
   ```

4. Start the development server

   backend:

   ```sh
   cd backend/springboot_service
   ./gradlew bootRun
   ```

   ```sh
   cd backend/go_service
   go run main.go
   ```

   frontend:

   ```sh
   cd frontend
   npm run dev
   ```
