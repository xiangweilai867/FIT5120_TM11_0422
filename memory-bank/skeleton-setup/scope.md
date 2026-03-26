# Project Skeleton Implementation
This task is to set up the project skeleton including both front-end (React Native app) and back-end (FastAPI).

## React Native App
The overall UI theme and design of the application should follow the reference images shown in `./uiux-reference/`. However the exact elements and their positions DOES NOT have to follow those shown in the images. Instead, they should be as user friendly as possible to users accessing the application on their phones. The UI design should be child friendly with large buttons, clear colors, big text. Placeholders can be used when/where an image should be; indicate them clearly. This section describes the features and functionalities that the mobile app should have.

### Overall Layout
- Drawer which opens from the right of the screen to navigate between different pages in the app. This will be the primary method of navigating through the app.
- The home page should show the daily tracker (refer to `uiux-reference\tracker-page-example-1.png`). This is the default page of the app.
- The next main page of the app should be the food scanner (refer to `uiux-reference\scan-example-1.png`). This page should allow the user to open the camera to snap a photo of their meal or choose an existing picture from their device (the OS might natively support obtaining an image from the camera or gallery). After obtaining the image, the app should upload this image to the back-end server to be processed. The back-end server shall return some health information and potential alternatives as a response which should be displayed to the user in a results page (refer to `uiux-reference\scan-result-example-1.png`).

## FastAPI Back-end
The back-end server should be implemented using FastAPI. It will be hosted on render.com, therefore ensure that it has all the appropriate configurations. The back-end should expose a REST API to serve the mobile app. This sectino describes the features and functionalities that the back-end server should have.

### API
- The back-end should be able to receive an image sent from the mobile app at a POST endpoint `/scan`. This image should then be forwarded to Gemini as part of a prompt template. The goal is to obtain nutritional information about the food captured in the image, along with any healthier alternatives if the food is deemed unhealthy. The response from Gemini should then be converted into an appropriate JSON response which is sent back to the mobile app.
- The server should also cache the response from Gemini for each image in PostgreSQL database so that if the same image is uploaded again, the server will simply return the cached response. This cache should impose a TTL of 1 day for each record.
