# Stories Feature Modification
This task is to modify the stories feature of the system.

## Story Changes
Each story will contain a file named `text.json` which contains the text for each page of the story.
The file contains an array `pages` which elements contain two attributes `storyText` and `imagePrompt`, only `storyText` shall be used.
The story UI should be changed such that it is smooth scrolling between all the pages. There should only be one 'listen' button anchored to the top of the screen for the entire story. Clicking on the button should stop any currently playing audio file, and play the audio file for the page that is currently displayed.
For each page of a story, the text should be displayed first, followed by the corresponding image. The text should be retrieved from the `storyText` properties in the `text.json` file.
Refer to the file `uiux-reference/story-example-2.jpeg` for the desired UI.

## Bugs
1. Currently, the cover images for each story are not being shown correctly. They are not being resized to the appropriate size in each card in the carousel. Additionally, the carousel cards can be taller.
2. The story titles are being cut off in the carousel cards. Currently, when a story title occupies more than one line, the second line onwards is no longer visible.
3. Currently, pressing the back button while viewing a story navigates out of the story section of the app entirely. The expected behaviour is that pressing back while viewing a story should navigate back to the "choose a story" page.
