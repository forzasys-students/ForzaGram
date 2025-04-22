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

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        // Fetch fixture IDs from Google Sheets
        const sheetResponse = await fetch(googleSheetsDataUrl);
        const sheetData = await sheetResponse.json();
        const fixtureIds = sheetData.values.map((row) => row[4]);

        // Fetch fixture details for each ID
        const fixturePromises = fixtureIds.map((gameid) =>
          fetch(`https://api.xyz.com/${gameid}/info`).then((res) => res.json())
        );
        const fixtureDetails = await Promise.all(fixturePromises);

        setFixtures(fixtureDetails);
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {fixtures.map((fixture, index) => (
        <View>
            <Text>
                {fixture.home_team} - {fixture.visiting_team}
            </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});