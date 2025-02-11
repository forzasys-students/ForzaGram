import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Video } from "expo-av";

export default function VideoPlayer({ videoUri, team1, team2, season, event, isActive }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.playAsync();
        setIsPlaying(true);
      } else {
        videoRef.current.pauseAsync();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const togglePlayPause = async () => {
    const status = await videoRef.current.getStatusAsync();
    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={togglePlayPause}
      style={{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      }}
    >
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="contain"
        isLooping
        useNativeControls={false}
      />
      <View
        style={{
          position: "absolute",
          bottom: 50,
          left: 20,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {team1} VS {team2}
        </Text>
        <Text style={{ fontSize: 16 }}>
          {season} - {event}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
