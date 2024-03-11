![CultureConnect in stylised font as the app logo](https://github.com/karisan31/CultureConnect/blob/main/assets/images/CultureConnectLogo.png)

<p align="center">
  <a href="https://www.youtube.com/watch?v=XQNYzcSXUvs">
    <img src="/assets/images/VideoThumbnail.png" alt="Application Presentation">
  </a>
</p>

Click the thumbnail above to watch the application presentation

CultureConnect is a community-focused hybrid application for iOS & Android. It provides a platform on which users can host culture-based events.

## Technology Stack:

As a team, we wanted to push ourselves to learn new technologies and broaden our understanding of app development.

This app was built using:

- TypeScript
- React Native
- Supabase (Open-source alternative to Firebase)
- MapView & Postcodes.io

Features:

- Secure login / sign-up.
- View and filter events based on current location/postcode.
- Maps integration with interactive callout markers.
- Ability to attend/cancel attendance to events.
- A live messenger feature to talk to event hosts.
- My events page where you can track events (hosted and attending).
- Be able to host new events with calendar and time picker inputs.
- Profile page with edit profile capabilities and a sign-out button.

## If you wish to explore this application yourself:

1. Clone the Repository

In the terminal on your device, cd into the directory where you wish to keep this repository, then,

`git clone https://github.com/JoravarSinghPunia/CultureConnect-Application.git`

Or, if you have already forked this repo, copy the HTTPS link from the green 'Code' dropdown and replace the URL.

2. Install the necessary dependencies

Before working with the repository, you're going to need to install npm to your newly downloaded repo by typing the following command into your terminal while inside the git repository

`npm install`

3. Access the database

Create a folder named .env and insert the following:-

EXPO*PUBLIC_SUPABASE_URL= \_insert your Supabase url*

EXPO*PUBLIC_SUPABASE_ANON_KEY=\_insert your Supabase anon key*

See [this](https://docs.expo.dev/guides/using-supabase/) for more information.

NOTE: Make sure to add .env to your git ignore as env files usually contain sensitive information and should not be put in version control\*

4. Set up your device

iOS emulator: Follow this [link](https://apps.apple.com/us/app/xcode/id497799835?mt=12) to install Xcode

Android emulator: Follow this [link](https://developer.android.com/studio) to install Android Studio on Linux, Ubuntu or Windows

Expo Go app: Install the 'Expo Go' app on any mobile device to view directly.

5. Run app

Once you have cloned the repository and installed all of the necessary dependencies, you will need to deploy your app using the following command

`npm start`

Follow the terminal directions to view the app on an emulator of your choice, or scan the QR code on your mobile to open the Expo Go app.
