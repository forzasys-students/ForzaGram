import React, { useEffect, useState, useRef } from "react";
import { View, Text, Button, FlatList, Dimensions } from "react-native";
import VideoPlayer from "./components/video"; 

const pagesize = 10;
const googlesheetsdataurl = "https://sheets.googleapis.com/v4/spreadsheets/15sgdpVXsUMZdmxRdpfuFMc2pj4csPElt2dI7u5P9ROk/values/A2:F?key=AIzaSyCcADeLUsyye03WViRsMDviXjYOsmm-6eY";


interface VideoData {
  id: string;
  season: string;
  event: string;
  team1: string;
  team2: string;
  gameid: string;
  uri: string;
}

export default function VideoFeed() {
  const [videodata, setVideodata] = useState([]);
  const [filteredvideos, setFilteredvideos] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [displaydata, setDisplaydata] = useState([]);
  const [page, setPage] = useState(1);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    fetch(googlesheetsdataurl)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.values.map((item, index) => ({
          id: index.toString(),
          season: item[0],
          event: item[1],
          team1: item[2],
          team2: item[3],
          gameid: item[4],
          uri: item[5],
        }));
        setVideodata(formattedData);
        setDisplaydata(formattedData.slice(0, pagesize));
      });
  }, []);

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

  useEffect(() => {
      if (selectedFilter) {
        const filteredData = videodata.filter((videodata) => videodata.event === selectedFilter);
        setFilteredvideos(filteredData);
      } else {
        setFilteredvideos([]);
      }
    }, [selectedFilter, videodata]);

  return (
    <View style={{ flex: 1 }}>
      {/* <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
        <Button title="All" onPress={() => setSelectedFilter(null)} />
        <Button title="Event X" onPress={() => setSelectedFilter('goal')} />
        <Button title="Event Y" onPress={() => setSelectedFilter('event_y')} />
      </View>       */}
      <FlatList
        data={displaydata}
        keyExtractor={(item) => item.id}
        snapToInterval={Dimensions.get("window").height}
        decelerationRate="fast"
        pagingEnabled
        onEndReached={loadmore}
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={onViewableItemsChanged.current}
        renderItem={({ item, index }) => (
          <VideoPlayer
            videoUri={item.uri}
            team1={item.team1}
            team2={item.team2}
            season={item.season}
            event={item.event}
            isActive={index === currentVideoIndex} 
          />
        )}
      />
    </View>
  );
}
