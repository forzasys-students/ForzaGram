import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Timeline from "../Screens/Timeline";
import IndexScreen from "@/Screens/Videofeed";
import VideoScreen from "@/Screens/VideoScreen";
import Fixtures from "../Screens/Fixtures";
import Lineup from '../Screens/Lineup';

export type RootStackParamList = {
  Index: undefined;
  Timeline: { gameid: string };
  VideoScreen: {
    assetId: number;
    from: number;
    to: number;
  }
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Index">
        {/** 👇 wrap these inside children (JSX!) */}
        <>
          <Stack.Screen
            name="Index"
            component={IndexScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Timeline"
            component={Timeline}
            options={{ title: 'Match Timeline' }}
          />
          <Stack.Screen
            name="VideoScreen"
            component={VideoScreen}
            options={{ title: 'Video Player', headerShown: false }}
          />
          <Stack.Screen
            name="Fixtures"
            component={Fixtures}
            options={{ title: 'All fixtures' }}
          />
        </>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
