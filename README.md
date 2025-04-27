# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).


## Workflow

```mermaid
flowchart TD
    %% User Workflow
    Start([User Opens App]) --> VideoFeed[Video Feed Screen]
    
    %% Video Feed Main Flow
    VideoFeed --> FilterContent{Filter Content?}
    FilterContent -- "Yes" --> SelectFilter[Select Category Filter]
    SelectFilter --> ShowFiltered[Display Filtered Videos]
    FilterContent -- "No" --> BrowseVideos[Browse Default Videos]
    
    %% Video Interaction
    BrowseVideos --> VideoInteraction{Interact with Video?}
    ShowFiltered --> VideoInteraction
    
    VideoInteraction -- "Swipe Videos" --> NextVideo[View Next Video]
    NextVideo --> VideoInteraction
    
    VideoInteraction -- "Tap Match Info" --> GoToTimeline[Go to Match Timeline]
    VideoInteraction -- "Watch Full" --> PlayFullVideo[Watch Full Video in Player]
    
    %% Timeline Flow
    GoToTimeline --> ViewTimeline[View Match Timeline]
    ViewTimeline --> TimelineInteraction{Timeline Interaction}
    
    TimelineInteraction -- "Tap Event" --> ViewEvent[View Event Details]
    ViewEvent --> WatchEvent[Watch Event Video Clip]
    TimelineInteraction -- "Browse Fixtures" --> GoToFixtures[Go to Fixtures Screen]
    
    %% Fixtures Flow
    GoToFixtures --> ViewFixtures[View Match Fixtures]
    ViewFixtures --> FixtureInteraction{Fixture Interaction}
    FixtureInteraction -- "Select Match" --> MatchDetails[View Match Details]
    MatchDetails --> GoToTimeline
    
    %% Data Source
    VideoFeed -- "Loads Content" --> GoogleSheets[(Google Sheets API)]
    
    %% Styling
    classDef screen fill:#f9f9f9,stroke:#333,stroke-width:2px
    classDef interaction fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef action fill:#fff8e1,stroke:#ff8f00,stroke-width:2px
    classDef dataSource fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px
    
    class VideoFeed,ViewTimeline,PlayFullVideo,ViewFixtures screen
    class VideoInteraction,TimelineInteraction,FixtureInteraction interaction
    class NextVideo,GoToTimeline,ViewEvent,WatchEvent,GoToFixtures,MatchDetails action
    class GoogleSheets dataSource
``` 

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
