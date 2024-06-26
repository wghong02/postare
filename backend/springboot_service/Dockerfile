# Start with a base image containing Java runtime
FROM openjdk:24-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the packaged JAR file into the container
COPY build/libs/PostPlaceSpringService-0.0.1-SNAPSHOT.jar /app/PostPlaceSpringService.jar

# Expose the port on which your Spring Boot application will run
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "PostPlaceSpringService.jar"]
