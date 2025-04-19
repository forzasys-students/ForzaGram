import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Text,
  Platform,
} from 'react-native';
import { Video } from 'expo-av';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type VideoScreenRouteProp = RouteProp<RootStackParamList, 'VideoScreen'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function VideoScreen() {
  const route = useRoute<VideoScreenRouteProp>();
  const { assetId, from, to, gameid } = route.params;

  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const videoUrl = `https://api.forzasys.com/allsvenskan/playlist.m3u8/${assetId}:${from}:${to}/Manifest.m3u8`;

  const togglePause = async () => {
    const status = await videoRef.current?.getStatusAsync();
    if (status?.isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPaused(true);
    } else {
      await videoRef.current.playAsync();
      setIsPaused(false);
    }
  };
  const goBackToTimeline = () => {
    if (gameid) {
      navigation.navigate('Timeline', { gameid });
    } else {
      navigation.goBack(); // fallback if no gameid
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <TouchableOpacity
        onPress={goBackToTimeline}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Back to Timeline</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.videoWrapper}
        activeOpacity={1}
        onPress={togglePause}
      >
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode="cover"
          useNativeControls={false}
          shouldPlay
          isLooping={false}
        />
        {isPaused && (
          <View style={styles.playIcon}>
            <Text style={{ color: '#fff', fontSize: 32 }}>▶️</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoWrapper: {
    flex: 1,
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
  },
  playIcon: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
