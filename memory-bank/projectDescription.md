# Problem Statement
Childhood obesity has reached alarming levels in Malaysia's urban areas (where), with 2.85 million children aged 5-19 classified as overweight or living with obesity in 2025. School-aged children (who) are particularly vulnerable to developing long-term health complications including diabetes, cardiovascular diseases, and psychological issues due to poor dietary habits established during formative years (why). Despite growing awareness of healthy eating, many children continue consuming processed foods, sugary beverages, and high-calorie snacks available in school canteens and nearby outlets (what), often influenced by aggressive marketing, peer pressure, and limited nutrition education (why). By implementing comprehensive nutrition education programs, improving school food environments, and engaging parents in healthy meal planning (how), we can empower children to make informed food choices and develop lifelong healthy eating habits. How might schools and communities work together to create supportive environments that nurture healthy eating behaviors and reduce childhood obesity rates among urban Malaysian children?

# Project Overview
The name of the project is NutriHealth. The main product is a mobile application tailored for children between the age of 7 to 12 with the aim of ultimately improving their health through nutritional behaviors.

## High-level System Architecture
This project will consist of the following main components:
- Mobile application written in React Native (focused on Android).
    - A child-friendly mobile application which serves as the primary interface in which the users will interact with the system.
- Back-end server written with FastAPI.
    - A back-end server which will handle requests from the mobile app.
    - Hosted on render.com
- PostgreSQL database.
    - A RDBMS to store data about the users.
    - Managed instance provided by render.com
- Gemini AI API integration with the back-end server.
    - Provider of AI-powered functionalities.
    - Provided by Google.

## Project Folder Structure
This repository contains all the code related to the project.
- `nutri-health-app` contains the React Native code for the mobile application.
- `memory-bank` contains information for AI agents.
- `uiux-reference` contains resources and references related to the UI/UX of the application.
- `nutri-health-api` contains the code for the back-end server and database.
