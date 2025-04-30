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
import { RouteProp, useRoute } from '@react-navigation/native';
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
      }));

    return (
      <EventList events={topEvents} />
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
    return <LoadingIndicator />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <MatchHeader matchInfo={matchInfo} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={{ flex: 1 }}
      />
    </View>
  );
}


const LoadingIndicator = () => (
  <View style={styles.centered}>
    <ActivityIndicator size="large" color="#1d51a3" />
    <Text>Loading timeline...</Text>
  </View>
);

const MatchHeader = ({ matchInfo }: { matchInfo: any }) => (
  <View>
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
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1d51a3' }}>
        Stadium: {matchInfo.stadium_name}
      </Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1d51a3' }}>
        Tournament: {matchInfo.tournament_name}
      </Text>
    </View>
  </View>
);

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

  if (!assetId || !from || !to || !eventType) return null;

  const imageLogo = team && matchInfo
    ? (team === matchInfo.home_team.name ? matchInfo.home_team.logo_url : matchInfo.visiting_team.logo_url)
    : undefined;

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
      homeTeam={matchInfo?.home_team.name}
      visiting_team={matchInfo?.visiting_team.name}
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontWeight: 'bold',
    borderRadius: 40,
    backgroundColor: '#c0c0c0',
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
