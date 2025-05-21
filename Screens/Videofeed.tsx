import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewToken,
} from "react-native";
import 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../navigation/RootNavigator";

import VideoPlayer from "../components/video";
import FilterBar from "../components/FilterBar";

type VideoItem = {
  id: string;
  uri: string;
  season: string;
  team1: string;
  team2: string;
  event: string;
  score: string;
  team: string;
  gameid: string;
};

const pagesize = 10;
const googlesheetsdataurl = "https://sheets.googleapis.com/v4/spreadsheets/15sgdpVXsUMZdmxRdpfuFMc2pj4csPElt2dI7u5P9ROk/values/A2:G?key=AIzaSyCcADeLUsyye03WViRsMDviXjYOsmm-6eY";

const filterOptions = [
  { id: "1", label: "For You" },
  { id: "2", label: "Goal" },
  { id: "3", label: "Yellow Card" },
  { id: "4", label: "Shot" },
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Index'>;

export default function IndexScreen() {
  const navigation = useNavigation<NavigationProp>();
  const flatListRef = useRef<FlatList<VideoItem>>(null);
  const [videodata, setVideodata] = useState<VideoItem[]>([]);
  const [displaydata, setDisplaydata] = useState<VideoItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("1");
  const [page, setPage] = useState<number>(1);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClipsFromGame = async (gameid: string): Promise<VideoItem[]> => {
      try {
        const res = await fetch(`https://api.forzasys.com/allsvenskan/game/${gameid}/events?count=99999`);
        const data = await res.json();
        const clips: VideoItem[] = data.events
          .filter((event: any) => event.playlist?.video_url)
          .map((event: any, index: number) => ({
            id: `${gameid}-${event.id}-${index}`,
            uri: event.playlist.video_url,
            season: event.playlist.game?.tournament?.name || "Unknown",
            team1: event.playlist.game?.home_team?.name || "Home",
            team2: event.playlist.game?.visiting_team?.name || "Away",
            event: event.tag?.action?.toLowerCase() || "",
            score: event.score,
            team: event.tag?.team?.value || "",
            gameid: gameid
          }));
        return clips;
      } catch (err) {
        console.error(`Error fetching events for game ${gameid}:`, err);
        return [];
      }
    };

    const loadGameData = async () => {
      try {
        const response = await fetch(googlesheetsdataurl);
        const sheetData = await response.json();
        const rawValues = sheetData.values as string[][];
        const gameIds: string[] = [...new Set(rawValues.map((item) => item[4]).filter(Boolean))];
        const allClips = await Promise.all(gameIds.map(fetchClipsFromGame));
        const flattened = allClips.flat();
        const ids = flattened.map(item => item.id);
        const hasDuplicates = new Set(ids).size !== ids.length;

        if (hasDuplicates) {
          const seen = new Set();
          const dupes = ids.filter(id => {
            if (seen.has(id)) return true;
            seen.add(id);
            return false;
          });
          console.warn("⚠️ Duplicate video IDs found:", dupes);
        }

        const shuffled = flattened.sort(() => 0.5 - Math.random());
        setVideodata(shuffled);
        setDisplaydata(shuffled.slice(0, pagesize));
      } catch (err) {
        console.error("Failed to load video feed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGameData();
  }, []);

  const applyFilter = (filterId: string) => {
    setSelectedFilter(filterId);
    let filtered: VideoItem[] = [];

    if (filterId === "1") {
      filtered = videodata;
    } else if (filterId === "2") {
      filtered = videodata.filter((video) => video.event.includes("goal"));
    } else if (filterId === "3") {
      filtered = videodata.filter((video) => video.event.includes("yellow card"));
    } else if (filterId === "4") {
      filtered = videodata.filter((video) => video.event.includes("shot"));
    }

    setDisplaydata(filtered.slice(0, pagesize));

    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: false });
    }
  };

  useEffect(() => {
    if (videodata.length > 0) {
      applyFilter(selectedFilter);
    }
  }, [selectedFilter]);

  const loadmore = () => {
    const filtered = selectedFilter === "1"
      ? videodata
      : videodata.filter((video) => {
          if (selectedFilter === "2") return video.event.includes("goal");
          if (selectedFilter === "3") return video.event.includes("yellow card");
          if (selectedFilter === "4") return video.event.includes("shot");
          return true;
        });

    const nextPage = page + 1;
    setPage(nextPage);
    setDisplaydata(filtered.slice(0, nextPage * pagesize));
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentVideoIndex(viewableItems[0].index || 0);
      }
    },
    []
  );

  const goToTimeline = (gameid: string) => {
    navigation.navigate('Timeline', { gameid });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading video feed...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filterBarContainer}>
        <FilterBar
          filters={filterOptions}
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />
      </View>
      <FlatList
        ref={flatListRef}
        data={displaydata}
        keyExtractor={(item, index) => item?.id?.toString?.() || `${index}`}
        snapToInterval={Dimensions.get("window").height}
        decelerationRate="fast"
        pagingEnabled
        onEndReached={loadmore}
        onEndReachedThreshold={0.5}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={true}
        onViewableItemsChanged={onViewableItemsChanged}
        renderItem={({ item, index }: { item: VideoItem; index: number }) => (
          <VideoPlayer
            videoUri={item.uri}
            team1={item.team1}
            team2={item.team2}
            season={item.season}
            event={item.event}
            isActive={index === currentVideoIndex}
            gameid={item.gameid}
            score={item.score}
            team={item.team}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  filterBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    zIndex: 100,
  },
});
