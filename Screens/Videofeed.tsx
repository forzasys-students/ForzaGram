import React, { useEffect, useState, useRef } from "react";
import { View, FlatList, Dimensions, TouchableOpacity, Text, StyleSheet } from "react-native";
import 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "@/navigation/RootNavigator";

import VideoPlayer from "../components/video"; 
import FilterBar from "../components/FilterBar";

const pagesize = 10;
const googlesheetsdataurl = "https://sheets.googleapis.com/v4/spreadsheets/15sgdpVXsUMZdmxRdpfuFMc2pj4csPElt2dI7u5P9ROk/values/A2:G?key=AIzaSyCcADeLUsyye03WViRsMDviXjYOsmm-6eY";

const filterOptions = [
  { id: "1", label: "For You" },
  { id: "2", label: "Goal" },
  { id: "3", label: "Yellow Card" },
  { id: "4", label: "Shot" },
  
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Index'>; // later for understanding 

export default function IndexScreen() {
  const navigation = useNavigation<NavigationProp>();
  const flatListRef = useRef<FlatList>(null);
  const [videodata, setVideodata] = useState([]);
  const [displaydata, setDisplaydata] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("1"); 
  const [page, setPage] = useState(1);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    fetch(googlesheetsdataurl)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.values.map((item, index) => ({
          id: index.toString(),
          season: item[0],
          event: item[1].toLowerCase(), 
          team1: item[2],
          team2: item[3],
          gameid: item[4],
          assedid: item[5],
          uri: item[6],
        }));
        setVideodata(formattedData);
        setDisplaydata(formattedData.slice(0, pagesize)); 
        //console.log(formattedData);
      });
  }, []);

  const applyFilter = (filterId) => {
    setSelectedFilter(filterId);
    let filteredVideos = [];
  
    if (filterId === "1") {
      filteredVideos = videodata;
    } else if (filterId === "2") {
      filteredVideos = videodata.filter((video) => video.event.includes("goal"));
    } else if (filterId === "3") {
      filteredVideos = videodata.filter((video) => video.event.includes("yellow card"));
    } else if (filterId === "4") {
      filteredVideos = videodata.filter((video) => video.event.includes("shot"));
    }
  
    setDisplaydata(filteredVideos);
  
    // 🔥 Scroll FlatList to the top after filter change
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: false });
    }
  };
  

  useEffect(() => {
    if (videodata.length > 0) {
      applyFilter(selectedFilter);
    }
  }, [selectedFilter, videodata]); 

  const loadmore = () => {
    if (page * pagesize >= videodata.length) return;
    setPage(page + 1);
    setDisplaydata(videodata.slice(0, (page + 1) * pagesize));
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentVideoIndex(viewableItems[0].index);
    }
  });

  const goToTimeline = (gameid: string) => {
    navigation.navigate('Timeline', { gameid });
  };
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
        keyExtractor={(item) => item.id}
        snapToInterval={Dimensions.get("window").height}
        decelerationRate="fast"
        pagingEnabled
        onEndReached={loadmore}
        onEndReachedThreshold={0.5}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={true}
        onViewableItemsChanged={onViewableItemsChanged.current}
        renderItem={({ item, index }) => (
          <VideoPlayer
            videoUri={item.uri}
            team1={item.team1}
            team2={item.team2}
            season={item.season}
            event={item.event}
            isActive={index === currentVideoIndex}
            gameid={item.gameid}

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
