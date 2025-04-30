import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Index">;

interface VideoPlayerProps {
  videoUri: string;
  team1: string;
  team2: string;
  event: string;
  isActive: boolean;
  gameid: string;
  season?: string;
}

export default function VideoPlayer({
  videoUri,
  team1,
  team2,
  season,
  event,
  isActive,
  gameid,
}: VideoPlayerProps) {
  const videoRef = useRef<any>(null);
  const [matchInfo, setMatchInfo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && isFocused) {
        videoRef.current.playAsync();
        setIsPlaying(true);
      } else {
        videoRef.current.pauseAsync();
        setIsPlaying(false);
      }
    }
  }, [isActive, isFocused]);

  useEffect(() => {
    const fetchMatchInfo = async () => {
      try {
        const res = await fetch(
          `https://api.forzasys.com/allsvenskan/game/${gameid}`
        );
        const matchJson = await res.json();
        setMatchInfo(matchJson);
      } catch (err) {
        console.error("Error loading match info:", err);
      }
    };

    fetchMatchInfo();
  }, [gameid]);

  const togglePlayPause = async () => {
    const status = await videoRef.current.getStatusAsync();
    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPaused(true);
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync();
      setIsPaused(false);
      setIsPlaying(true);
    }
  };

  const handleNavigateToTimeline = () => {
    navigation.navigate("Timeline", { gameid });
  };
  const handleNavigateToFixtures = () => {
    navigation.navigate("Fixtures", { gameid });
  };
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={togglePlayPause}
      style={{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: "#000",
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor="black" />

      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        resizeMode="cover"
        isLooping
        useNativeControls={false}
      />

      {isActive && (
        <View
          style={{
            position: "absolute",
            left: 215,
            bottom: 150,
            backgroundColor: "#1d51a3",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 30,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={handleNavigateToTimeline}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <FontAwesome
              name="clock-o"
              size={16}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: "white", fontWeight: "bold" }}>
              View Timeline
            </Text>

          </TouchableOpacity>
          

        </View>

      )}

      {/* Score and event overlay */}
      <View
        style={{
          position: "absolute",
          bottom: 30,
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <LinearGradient
          colors={[
            "rgba(255, 255, 255, 0.3)",
            "rgba(255, 255, 255, 0.05)",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flex: 1,
            flexDirection: "row",
            padding: 10,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          {matchInfo && (
            <>
              <ImageBackground
                // source={{ uri: matchInfo.home_team.logo_url }}
                source={require("./images/Allsvenskan.png")}
                style={{
                  position: "absolute",
                  width: "110%",
                  height: "135%",
                  opacity: 0.2,
                  marginLeft: -60,
                }}
                imageStyle={{ resizeMode: "contain" }}
              />

              <View style={{ marginLeft: 5, flexDirection: "row" }}>
                <Image
                  source={{ uri: matchInfo.home_team.logo_url }}
                  style={{
                    width: 60,
                    height: 60,
                    margin: 5,
                    resizeMode: "contain",
                  }}
                />
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#fff",
                      backgroundColor: "#1d51a3",
                      padding: 5,
                      borderRadius: 9,
                    }}
                  >
                    <Text>{matchInfo.home_team_goals} - {matchInfo.visiting_team_goals}</Text>
                  </Text>
                </View>
                <Image
                  source={{
                    uri: matchInfo.visiting_team.logo_url,
                  }}
                  style={{
                    width: 60,
                    height: 60,
                    margin: 5,
                    resizeMode: "contain",
                  }}
                />
              </View>
            </>
          )}
        </LinearGradient>

        <View
          style={{
            flexDirection: "row",
            padding: 10,
            marginRight: 10,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 5,
            }}
          >
            {event === "goal" || event === "shot" ? (
              <FontAwesome name="futbol-o" size={20} color="black" />
            ) : event === "yellow card" ? (
              <View
                style={{
                  width: 13,
                  height: 20,
                  borderRadius: 3,
                  backgroundColor: "#ffdd00",
                  borderWidth: 0.5,
                  borderColor: "#000",
                }}
              />
            ) : null}
          </View>
          <Text style={{ fontSize: 16, color: "#ddd", paddingLeft: 10 }}>
            {event.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Play Icon Overlay */}
      {!isPlaying && isPaused && (
        <View
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: [{ translateX: -25 }, { translateY: -25 }],
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("./images/play-icon.png")}
            style={{ width: 50, height: 50 }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}
