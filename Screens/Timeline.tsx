// Timeline.tsx
import React, { useEffect, useState, useNa } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '../navigation/RootNavigator';
import EventCard from '../components/EventCard';

type TimelineRouteProp = RouteProp<RootStackParamList, 'Timeline'>;

const initialLayout = { width: Dimensions.get('window').width };


export default function Timeline() {
  const route = useRoute<TimelineRouteProp>();
  const { gameid } = route.params;

  const [matchInfo, setMatchInfo] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startOf1stHalfMs, setStartOf1stHalfMs] = useState<number | null>(null);
  const navigation = useNavigation<TimelineRouteProp>();


  useEffect(() => {
    const loadTimelineData = async () => {
      try {
        const matchRes = await fetch(`https://api.forzasys.com/allsvenskan/game/${gameid}`);
        const matchJson = await matchRes.json();
        setMatchInfo(matchJson);

        const startTime = new Date(matchJson.start_of_1st_half).getTime();
        setStartOf1stHalfMs(startTime);

        const eventRes = await fetch(`https://api.forzasys.com/allsvenskan/game/${gameid}/events`);
        const eventJson = await eventRes.json();

        const eventsData = eventJson?.events || [];
        eventsData.sort((a, b) => {
          const aTime = a?.playlist?.events?.[0]?.from_timestamp || 0;
          const bTime = b?.playlist?.events?.[0]?.from_timestamp || 0;
          return aTime - bTime;
        });

        setEvents(eventsData);
      } catch (err) {
        console.error('Error loading timeline data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTimelineData();
  }, [gameid]);

  if (loading || !startOf1stHalfMs) {
    return <LoadingIndicator />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MatchHeader matchInfo={matchInfo} />
      {/* <View style={{ marginVertical: 20, alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#1d51a3',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
          }}
          onPress={() => navigation.navigate('Lineup', { gameid })}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>View Lineup</Text>
        </TouchableOpacity>
      </View> */}
      {events.map((event, index) => (
        <EventItem key={index} event={event} matchInfo={matchInfo} />
      ))}
    </ScrollView>
  );
}

const LoadingIndicator = () => (
  <View style={styles.centered}>
    <ActivityIndicator size="large" color="#1d51a3" />
    <Text>Loading timeline...</Text>
  </View>
);

const MatchHeader = ({ matchInfo }: { matchInfo: any }) => (
  <View >
    <View style={styles.header}>
      <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{matchInfo.home_team.short_name}</Text>
      <Image source={{ uri: matchInfo.home_team.logo_url }} style={styles.logo} />

      <Text style={styles.score}>
        {matchInfo.home_team_goals} - {matchInfo.visiting_team_goals}
      </Text>
      <Image source={{ uri: matchInfo.visiting_team.logo_url }} style={styles.logo} />
      <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{matchInfo.visiting_team.short_name}</Text>
    </View>
    <View style={styles.matchInfo}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1d51a3' }}>Stadium: {matchInfo.stadium_name}</Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1d51a3' }}>Toutnement: {matchInfo.tournament_name}</Text>
    </View>
  </View>
);


let Logo = ({ matchInfo }: { matchInfo: any }) => {
  return matchInfo.visiting_team.logo_url;
};


const EventItem = ({ event, matchInfo }: { event: any; matchInfo: any }) => {
  const subEvent = event?.playlist?.events?.[0];
  const assetId = subEvent?.video_asset_id;
  const from = subEvent?.from_timestamp;
  const to = subEvent?.to_timestamp;
  const gametime = event?.game_time;
  const tag = event?.tag;
  const eventType = tag?.action;
  const scorer = tag?.scorer?.value || tag?.player?.value || undefined;
  const keeper = tag?.keeper?.value || tag?.player?.value || undefined;
  const assist = tag?.['assist by']?.value ?? null;
  const team = tag?.team?.value ?? undefined;
  const imageLogo = team === matchInfo.home_team.name
    ? matchInfo.home_team.logo_url
    : matchInfo.visiting_team.logo_url;
  const homeTeam = matchInfo.home_team.name
  const visitingTeam = matchInfo.visiting_team.name
  // console.log("🧩 Event debug:", JSON.stringify(event, null, 2))
  //console.log( 'Here is console log ' + homeTeam + '  VVSSS  ' + visitingTeam)
  //console.log( 'Improtenet Info ' + JSON.stringify(event))
  if (!assetId || !from || !to || !eventType) return null;

  return (
    <EventCard
      assetId={assetId}
      from={from}
      to={to}
      eventType={eventType}
      scorer={scorer}
      keeper={keeper}
      assist={assist}
      team={team}
      gametime={gametime}
      imageLogo={imageLogo}
      homeTeam={homeTeam}
      visiting_team={visitingTeam}
    />

  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 60,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',

  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
  score: {
    fontSize: 24,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 12,
    paddingBottom: 12,
    fontWeight: 'bold',
    borderRadius: 40,
    backgroundColor: '#c0c0c0'
  },
  matchInfo: {
    padding: 12,
    backgroundColor: '#f5f5f5',
  }
});
