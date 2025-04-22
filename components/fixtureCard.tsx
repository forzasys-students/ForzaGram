import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface FixtureCardProps {
  team1: string;
  team2: string;
  date: string;
  logo1: string;
  logo2: string;
}

export default function fixtureCard({
  team1,
  team2,
  date,
  logo1,
  logo2,
}: FixtureCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: logo1 }} style={styles.logo} />
        <Text style={styles.team}>{team1}</Text>
        <Text style={styles.vs}>vs</Text>
        <Text style={styles.team}>{team2}</Text>
        <Image source={{ uri: logo2 }} style={styles.logo} />
      </View>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 40,
    height: 40,
  },
  team: {
    fontSize: 16,
    fontWeight: "bold",
  },
  vs: {
    fontSize: 16,
    color: "#888",
  },
  date: {
    marginTop: 5,
    fontSize: 14,
    color: "#555",
  },
});