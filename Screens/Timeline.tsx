import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { RootStackParamList } from '../navigation/RootNavigator';
import EventCard from '../components/EventCard';
type TimelineRouteProp = RouteProp<RootStackParamList, 'Timeline'>;
const initialLayout = { width: Dimensions.get('window').width };
const FILTER_OPTIONS = ['all', 'goals', 'cards', 'setpieces'] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

export default function Timeline() {
  const route = useRoute<TimelineRouteProp>();
  const { gameid } = route.params;
  const [matchInfo, setMatchInfo] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');
  const navigation = useNavigation<TimelineRouteProp>();
  const routes = [
    { key: 'top', title: 'Top Events' },
    { key: 'full', title: 'Full Events' },
  ];

  useEffect(() => {
    const loadTimelineData = async () => {
      try {
        const matchRes = await fetch(`https://api.forzasys.com/allsvenskan/game/${gameid}`);
        const matchJson = await matchRes.json();
        setMatchInfo(matchJson);
        const eventRes = await fetch(`https://api.forzasys.com/allsvenskan/game/${gameid}/events?count=99999`);
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

  const filterEvents = (list: any[], filter: FilterOption) => {
    return list.filter(event => {
      const action = event?.tag?.action?.toLowerCase() || '';
      const onTarget = event?.tag?.['on target']?.value?.toLowerCase() || '';
      if (filter === 'goals') return action.includes('goal');
      if (filter === 'cards') return action.includes('yellow') || action.includes('red');
      if (filter === 'setpieces') return (
        action.includes('corner') || action.includes('penalty') ||
        action.includes('free kick')
      );
      return true;
    });
  };

  const renderTopEvents = () => {
    const topEvents = filterEvents(events, 'goals')
      .concat(events.filter(event => {
        const action = event?.tag?.action?.toLowerCase() || '';
        const onTarget = event?.tag?.['on target']?.value?.toLowerCase() || '';
        return action === 'shot' && onTarget === 'yes';
      }))
      .sort((a, b) => (a.game_time || 0) - (b.game_time || 0)); // Sort by game time (minute)

    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {topEvents.length > 0
          ? topEvents.map((event, index) => (
            <EventItem key={index} event={event} matchInfo={matchInfo} />
          ))
          : <Text style={styles.noEventsText}>No Top Events</Text>}
      </ScrollView>
    );
  };

  const renderFullEvents = () => {
    const filteredEvents = filterEvents(events, selectedFilter);
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <FilterBar selected={selectedFilter} onChange={setSelectedFilter} />
        {filteredEvents.length > 0
          ? filteredEvents.map((event, index) => (
            <EventItem key={index} event={event} matchInfo={matchInfo} />
          ))
          : <Text style={styles.noEventsText}>No Events Available</Text>}
      </ScrollView>
    );
  };

  const getGoalScorers = () => {
    const goals = filterEvents(events, 'goals');
    return goals.map(goal => {
      const scorer = goal?.tag?.scorer?.value || 'Unknown Scorer';
      const teamId = goal?.tag?.team?.id || 'Unknown Team ID';
      const shotType = goal?.tag?.['shot type']?.value || 'Unknown Shot Type';
      const gameTime = goal?.game_time;
      return { scorer, teamId, shotType, gameTime };
    });
  };

  const renderScene = SceneMap({
    top: renderTopEvents,
    full: renderFullEvents,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#1d51a3', height: 3 }}
      style={{ backgroundColor: 'black' }}
      renderLabel={({ route, focused }) => (
        <Text style={{
          color: focused ? '#1d51a3' : '#888',
          fontWeight: focused ? 'bold' : 'normal',
          fontSize: 16,
        }}>
          {route.title}
        </Text>
      )}
    />
  );

  if (loading) {
    return <LoadingIndicator testID="loading-indicator" />;
  }

  if (!matchInfo) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 16, color: '#999' }}>
          Error Failed to load match data.
        </Text>
      </View>
    );
  }
  

  return (
    <View style={{ flex: 1, backgroundColor: '#ebebeb' }}>
      <MatchHeader matchInfo={matchInfo} getGoalScorers={getGoalScorers} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={{ flex: 1, margin: 10, borderRadius: 15, overflow: 'hidden', backgroundColor: '#fff' }}
      />
    </View>
  );
}


const LoadingIndicator = ({ testID }: { testID?: string }) => (
  <View style={styles.centered} testID={testID}>
    <ActivityIndicator size="large" color="#1d51a3" />
    <Text>Loading timeline...</Text>
  </View>
);

const MatchHeader = ({ matchInfo, getGoalScorers }: { matchInfo: any; getGoalScorers: () => { scorer: string; teamId: string; shotType: string; gameTime: number }[] }) => {
  const navigation = useNavigation<TimelineRouteProp>();
  return (
    <View>
      <View style={styles.header}>
        <View style={{ alignItems: 'center' }}>
          <Image source={{ uri: matchInfo.home_team.logo_url }} style={styles.logo} />
          <Text style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>
            {matchInfo.home_team.short_name}
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.score}>
            {matchInfo.home_team_goals} - {matchInfo.visiting_team_goals}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', top: 3, color: '#262626' }}>
            {matchInfo.date}
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>

          <Image source={{ uri: matchInfo.visiting_team.logo_url }} style={styles.logo} />
          <Text style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>{matchInfo.visiting_team.short_name}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 27, backgroundColor: '#f5f5f5' }}>
        <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 15 }}>
          {getGoalScorers()
            .filter(goal => goal.teamId === matchInfo.home_team.id)
            .map((goal, index) => (
              <Text
                key={index}
                style={{
                  fontSize: 10,
                  fontWeight: 'bold',
                  color: '#000',
                  marginBottom: 5,
                }}
              >
                {goal.shotType.toLowerCase() === 'own goal'
                  ? `${goal.scorer} (OG) ${Math.floor(goal.gameTime / 60)}'`
                  : `${goal.scorer} ${Math.floor(goal.gameTime / 60)}'`}
              </Text>
            ))}
        </View>
        <View>
          <FontAwesome name="futbol-o" size={12} color="black" />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-start', paddingLeft: 12 }}>
          {getGoalScorers()
            .filter(goal => goal.teamId === matchInfo.visiting_team.id)
            .map((goal, index) => (
              <Text
                key={index}
                style={{
                  fontSize: 10,
                  fontWeight: 'bold',
                  color: '#000',
                  marginBottom: 5,
                }}
              >
                {goal.shotType.toLowerCase() === 'own goal'
                  ? `${goal.scorer} (OG) ${Math.floor(goal.gameTime / 60)}'`
                  : `${goal.scorer} ${Math.floor(goal.gameTime / 60)}'`}
              </Text>
            ))}
        </View>
      </View>

      {/* This section is the same as the above, only that it makes the scorer names not duplicated. */}
      {/* <View style={{ flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 27, backgroundColor: '#f5f5f5' }}>
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
      {Object.entries(
        getGoalScorers()
        .filter(goal => goal.teamId === matchInfo.home_team.id)
        .reduce((acc, goal) => {
          const key = goal.shotType.toLowerCase() === 'own goal' ? `${goal.scorer} (OG)` : goal.scorer;
          if (!acc[key]) acc[key] = [];
          acc[key].push(Math.floor(goal.gameTime / 60));
          return acc;
        }, {} as Record<string, number[]>)
      ).map(([scorer, times], index) => (
        <Text
        key={index}
        style={{
          fontSize: 12,
          fontWeight: 'bold',
          color: '#000',
          marginBottom: 5,
        }}
        >
        {`${scorer} ${times.map(time => `${time}'`).join(', ')}`}
        </Text>
      ))}
      </View>
      <View>
      <FontAwesome name="futbol-o" size={12} color="black" />
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
      {Object.entries(
        getGoalScorers()
        .filter(goal => goal.teamId === matchInfo.visiting_team.id)
        .reduce((acc, goal) => {
          const key = goal.shotType.toLowerCase() === 'own goal' ? `${goal.scorer} (OG)` : goal.scorer;
          if (!acc[key]) acc[key] = [];
          acc[key].push(Math.floor(goal.gameTime / 60));
          return acc;
        }, {} as Record<string, number[]>)
      ).map(([scorer, times], index) => (
        <Text
        key={index}
        style={{
          fontSize: 12,
          fontWeight: 'bold',
          color: '#000',
          marginBottom: 5,
        }}
        >
        {`${scorer} ${times.map(time => `${time}'`).join(', ')}`}
        </Text>
      ))}
      </View>
    </View> */}



      {/* <View style={styles.matchInfo}> */}
        {/* <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#1d51a3',
              textAlign: 'center',
              marginVertical: 10,
            }}
            onPress={() => {
              // Assuming you have a navigation prop or useNavigation hook
              // Replace 'Lineup' with the actual route name for the lineup screen
              navigation.navigate('Lineup', { gameid: matchInfo.id });
            }}
          >
            View Lineup
          </Text>
        </View> */}
        {/* <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1d51a3' }}>
          Stadium: {matchInfo.stadium_name}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1d51a3' }}>
          Tournament: {matchInfo.tournament_name}
        </Text>
      </View> */}
    </View>
  );
}

const EventList = ({ events }: { events: any[] }) => (
  <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
    {events.length > 0
      ? events.map((event, index) => (
        <EventItem key={index} event={event} matchInfo={null} />
      ))
      : <Text style={styles.noEventsText}>No Top Events</Text>}
  </ScrollView>
);

const FilterBar = ({ selected, onChange }: { selected: string; onChange: (value: any) => void }) => (
  <View style={styles.filterBar}>
    {FILTER_OPTIONS.map(option => (
      <Text
        key={option}
        style={[
          styles.filterOption,
          selected === option && styles.selectedFilterOption
        ]}
        onPress={() => onChange(option)}
      >
        {option.toUpperCase()}
      </Text>
    ))}
  </View>
);

const EventItem = ({ event, matchInfo }: { event: any; matchInfo: any }) => {
  if (!event?.tag?.action) {
    console.warn('Skipping invalid event:', event);
    return null;
  }

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
  const shotType = tag?.['shot type']?.value || undefined;
  const team = tag?.team?.value ?? undefined;
  const teamId = tag?.team?.id ?? undefined;
  const result = event?.score ?? undefined;
  const substitution_in = tag?.['player in']?.value || undefined;
  const substitution_out = tag?.['player out']?.value || undefined;


  if (!assetId || !from || !to || !eventType) return null;

  const imageLogo = team && matchInfo
    ? (team === matchInfo.home_team.name ? matchInfo.home_team.logo_url : matchInfo.visiting_team.logo_url)
    : undefined;

  return (
    <EventCard
      matchInfo={matchInfo}
      assetId={assetId}
      from={from}
      to={to}
      eventType={eventType}
      scorer={scorer}
      keeper={keeper}
      assist={assist}
      team={team}
      teamId={teamId}
      gametime={gametime}
      imageLogo={imageLogo}
      homeTeam={matchInfo?.home_team.name}
      visiting_team={matchInfo?.visiting_team.name}
      homeTeamId={matchInfo?.home_team.id}
      visitingTeamId={matchInfo?.visiting_team.id}
      shotType={shotType}
      result={result}
      substitution_in={substitution_in}
      substitution_out={substitution_out}
    />
  );
};


const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 10,
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
  score: {
    fontSize: 55,
    fontWeight: 'bold',
    bottom: 8,
    color: '#292929',
  },
  matchInfo: {
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  noEventsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  filterOption: {
    fontSize: 14,
    color: '#666',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  selectedFilterOption: {
    color: '#1d51a3',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
