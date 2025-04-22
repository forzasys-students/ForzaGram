import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import fixtureCard from '../components/fixtureCard';
import RootNavigator from '@/navigation/RootNavigator.js';

type FixturesRouteProp = RouteProp<RootStackParamList, 'Fixtures'>;

const googleSheetsDataUrl = "https://sheets.googleapis.com/v4/spreadsheets/15sgdpVXsUMZdmxRdpfuFMc2pj4csPElt2dI7u5P9ROk/values/A2:G?key=AIzaSyCcADeLUsyye03WViRsMDviXjYOsmm-6eY";

export default function Fixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);

   useEffect(() => {
      fetch(googleSheetsDataUrl)
        .then((response) => response.json())
        .then((data) => {
          const allGameIds = data.values.map((item) => item[4]);

      // Step 2: Filter only unique gameids
      const uniqueGameIds = [...new Set(allGameIds)];
      console.log("✅ Unique Game IDs:", uniqueGameIds);

      // Step 3: Format for your loop
      const formattedData = uniqueGameIds.map((gameid, index) => ({
        id: index.toString(),
        gameid,
      }));
          setGames(formattedData);
          const matchInfoPromises = formattedData.map((game) => {
            const gameinfo = fetch(`https://api.forzasys.com/allsvenskan/game/${game.gameid}`)
              .then((response) => response.json())
              .then((matchJson) => {
                return {
                  home_team: matchJson.home_team,
                  visiting_team: matchJson.visiting_team,
                  start_of_1st_half: matchJson.start_of_1st_half,
                };
              });
            return gameinfo;  

          });
          Promise.all(matchInfoPromises).then((matchInfo) => {
            setFixtures(matchInfo);
            console.log(matchInfo);
            setLoading(false);
          });
        });
    }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView >
      {fixtures.map((fixture, index) => (
        <View key={index} style={{ marginBottom: 20 }}>
            <Text>
                {fixture.home_team.name} - {fixture.visiting_team.name}
            </Text>
        </View>
      ))}
    </ScrollView>
  );
   }
