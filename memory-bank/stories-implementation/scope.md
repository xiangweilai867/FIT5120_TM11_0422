# Stories System
This task is to implement a short story section of the app. This section will show a collection of short stories to the user. Each story will consist of pages of story text, a cover image, an image for each page of text, and an audio track for each page. These stories are pre-generated and stored in the server as static files. The mobile app should retrieve the data when needed by calling back-end endpoints.

## Front-end
A new section called 'Stories' should be added to the app drawer. When the stories section is opened, the app should fetch the list of stories from the server, along with a cover image for each story. Once the data successfully retrieved, the UI should show a carousel component to display all the stories available. Each card in the carousel should show the cover image of the story and the title of the story. Refer to `uiux-reference\story-menu-example-1.jpeg` for the layout.

Upon the user selecting a story, the app should fetch the files for the story from the server. The app should show a vertically scrolling page which will display the story text and the corresponding image for each page.  Refer to `uiux-reference\story-example-1.jpeg` for the layout. There should be a button labelled 'listen' to start playing the audio track for the current track. When the audio track for the current page has finished, the UI should scroll to the next page and start playing the audio track for the next page. The audio track should stop playing if the user navigates away from the story.

## Back-end
A new set of endpoints for the story related features should be added. These endpoints should return the appropriate story files from local storage (create a folder structure to store these files). The maximum number of stories that will be stored in the server will be 10. The endpoints should require the same authentication mechanism as the other existing endpoints.
