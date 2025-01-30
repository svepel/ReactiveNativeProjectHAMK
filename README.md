This is final project for the HAMK Cross-platform development with React Native (Summer 2024)

Overview: 
The Attendance List App is a React Native application designed for managing a list of people attending the events. It uses  SQLite for local data storage and provides a user-friendly interface for performing CRUD (Create, Read, Update, Delete) operations on the data. You can add person into a FlatList and update the person by click. When deleting a person by a long press, it shows an Alert having buttons Cancel, Archive and Ok. The Cancel button cancels the delete, Archive button saves (updates) the person data into the database with flag 'Drchived' and Ok button deletes the item. Added persons added into SQLite database. Deletion is deleting the person from the database, also.



# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

