# User Profile Feature
This file describes the user profile feature, its functionalities, and its design.

The user profile feature of the app should be entirely stored locally on the app, no user data should be saved on the backend server.

## Data
The user profile feature should store information such as the following:
- User-entered information:
    - username
        - A name entered by the user for the profile.
        - Max 16 character, alphanumeric only.
    - avatarId
        - One of a set of enum values indicating which avatar they have chosen.
        - Possible values: ['apple', 'broccoli', 'carrot']
    - age
        - Integer representing the age of the user.
        - Range from 1 to 99.
- Generated data:
    - User high score per game (there's only meal-maker for now, refactor the game code to store and retrieve high score from here)
        - A map of game -> high score.
        - Scores will be positive integers only.
    - A general points score
        - A total accumulated points counter.
        - Separate from game high scores (will be integrated into other features of the app later).
        - Positive integer only.

## Features

### Profile Creation
Upon opening of the app, if a user profile does not exist, show a user creation page. This page should collect the user-entered information mentioned above. The username should be via a text box, avatarId should be a carousel scrolling UI element showing images of different avatars (use placeholders for now), age should be a vertical carousel ranging from 1 to 99. At the bottom of the page should be a 'Create' button. All fields must be filled and validated. If validation of any field fails, display a simple error message at the respective field. Newly created profile should be saved locally in the app ONLY. There should also be an option to skip the profile creation.

### Profile Page
The profile page should show the user-entered information. There should also be a button at the bottom labelled 'Delete Profile' to delete the user profile and prompt the creation of a new profile. If a user profile does not exist, the page should show a button to create a profile.

### Profile Button
A profile button should be present on the top right of the main page of each tab (Goal, Scan, Stories, Hero World). The profile button should be a round image. Clicking on the profile button should navigate the user to a profile page. The image shown will be related to the avatarId but not exactly the same image.

