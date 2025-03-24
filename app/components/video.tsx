import React, { useRef, useState, useEffect } from "react";
import { View, Text, Image, Platform, TouchableOpacity, Dimensions, ImageBackground, StatusBar } from "react-native";
import { Video } from "expo-av";
import { Asset } from 'expo-asset';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';


const teamLogos: { [key: string]: any } = {
  "FK Värnamo": require("./images/FK Värnamo.png"),
  "Landskrona BoIS": require("./images/Landskrona BoIS.png"),
  "AIK": require("./images/AIK.png"),
  "Halmstads BK": require("./images/Halmstads BK.png"),
  "Djurgårdens IF": require("./images/Djurgårdens IF.png"),
  "IFK Norrköping": require("./images/IFK Norrköping.png"),
  "Malmö FF": require("./images/Malmö FF.png"),
  "IF Brommapojkarna": require("./images/IF Brommapojkarna.png"),
  "GAIS": require("./images/GAIS.png"),
  "IK Sirius": require("./images/IK Sirius.png"),
  "Kalmar FF": require("./images/Kalmar FF.png"),
  "BK Häcken": require("./images/BK Häcken.png"),
  "Mjällby AIF": require("./images/Mjällby AIF.png"),
  "IFK Göteborg": require("./images/IFK Göteborg.png"),
  "IFK Värnamo": require("./images/IFK Värnamo.png"),
  "IF Elfsborg": require("./images/IF Elfsborg.png"),
  "Västerås SK": require("./images/Västerås SK.png"),
  "Hammarby IF": require("./images/Hammarby IF.png"),
  "Allsvensken": require("./images/Allsvenskan.png"),
  "goal": 'futbol-o',
  "shot": 'tencent-weibo',
  // Add other teams as needed
};

interface VideoPlayerProps {
  videoUri: string;
  team1: string;
  team2: string;
  season: string;
  event: string;
  isActive: boolean;
}

export default function VideoPlayer({ videoUri, team1, team2, season, event, isActive }: VideoPlayerProps) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Todo later

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
      setIsPaused(true);
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync();
      setIsPaused(false);
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
        backgroundColor: "#000",
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          position: "absolute",
          top: 0,
          left: 0,
        }}
        resizeMode="cover" // Ensures the video covers the entire screen properly
        isLooping
        useNativeControls={false}
      />

      <View
        style={{
          position: "absolute",
          bottom: 30,
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={{
          marginBottom: 10,
          height: 40,
          width: '60%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',

        }}>
          <Text style={{
            fontSize: 16,
            color: '#fff',
          }}>
            Sign in with Facebook
          </Text>
        </LinearGradient> */}
        <LinearGradient colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.05)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={{
            flex: 1,
            flexDirection: "row",
            padding: 10,
            alignItems: "center",
            marginBottom: 20,
            overflow: "hidden",

          }}>

          <ImageBackground
            source={teamLogos['Allsvensken']} 
            style={{
              position: "absolute",
              width: "110%", // Zoom effect
              height: "135%",
              opacity: 0.2, // Makes it blend into the background
              marginLeft: -60, // Center the image
            }}
            imageStyle={{ resizeMode: "contain" }} // Ensures full coverage
          />
          <View style={{ marginLeft: 5, flexDirection: "row" }}>
            <Image source={teamLogos[team1]} style={{ width: 60, height: 60, margin: 5, resizeMode: 'contain' }} />
            <View style={{ justifyContent: "center", alignItems: "center", }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff", backgroundColor: "#1d51a3", padding: 5, borderRadius: 9 }}>0 - 4</Text>
            </View>
            <Image source={teamLogos[team2]} style={{ width: 60, height: 60, margin: 5, resizeMode: 'contain' }} />
          </View>

        </LinearGradient>
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            marginRight: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >

          <View style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 5
          }}>
            {(event === 'goal' || event === 'shot') && (<FontAwesome name={teamLogos[event]} size={20} color='black' />)}
            {(event === 'yellow card') && (
              <View style={{ width: 13, height: 20, borderRadius: 3, backgroundColor: '#ffdd00', borderWidth: 0.5, borderColor: '#000' }} />
            )}
          </View>
          <Text style={{ fontSize: 16, color: "#ddd", paddingLeft: 10 }}>
            {event.toUpperCase()}

          </Text>
        </View>
        <View
          style={
            {
              flexDirection: 'row',
              marginLeft: 10,
            }
          }>
          <FontAwesome name='play-circle' size={20} color='white' />
          <Text style={{ color: 'white', fontSize: 15, textAlign: 'center', marginBottom: 10, marginLeft: 10, textDecorationLine: 'underline' }}>Watch more of {team1} vs {team2} - {season}</Text>
        </View>
      </View>



      {(!isPlaying && isPaused) && (
        <View
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: [{ translateX: -25 }, { translateY: -25 }], // Half of image width and height
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
