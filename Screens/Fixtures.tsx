import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import fixtureCard from '../components/fixtureCard';
import RootNavigator from '@/navigation/RootNavigator.js';

type FixturesRouteProp = RouteProp<RootStackParamList, 'Fixtures'>;

const googleSheetsDataUrl = "https://sheets.googleapis.com/v4/spreadsheets/15sgdpVXsUMZdmxRdpfuFMc2pj4csPElt2dI7u5P9ROk/values/A2:G?key=AIzaSyCcADeLUsyye03WViRsMDviXjYOsmm-6eY";

export default function Fixtures() {
    const [fixtures, setFixtures] = useState<Array<{
  gameid: string;
  home_team: { name: string; [key: string]: any };
  visiting_team: { name: string; [key: string]: any };
  homeTeamLogo: string;
  visitingTeamLogo: string;
  homeTeamGoals: any;
  visitingTeamGoals: any;
  start_of_1st_half: any;
}>>([]);

    const [loading, setLoading] = useState(true);
    const [games, setGames] = useState<{ id: string; gameid: string }[]>([]);
    const navigation = useNavigation<FixturesRouteProp>();


    useEffect(() => {
        fetch(googleSheetsDataUrl)
            .then((response) => response.json())
            .then((data) => {
                const allGameIds = data.values.map((item:string[]) => item[4]);

                // Step 2: Filter only unique gameids
                const uniqueGameIds = [...new Set(allGameIds)];
                console.log("✅ Unique Game IDs:", uniqueGameIds);

                // Step 3: Format for your loop
                const formattedData = uniqueGameIds.map((gameid, index): { id: string; gameid: string } => ({
                 id: index.toString(),
                 gameid: gameid as string,
            }));

                setGames(formattedData);
                const matchInfoPromises = formattedData.map((game) => {
                    const gameinfo = fetch(`https://api.forzasys.com/allsvenskan/game/${game.gameid}`)
                        .then((response) => response.json())
                        .then((matchJson) => {
                            return {
                                gameid: game.gameid,
                                home_team: {
                                    ...matchJson.home_team,
                                    name: matchJson.home_team.name.length > 10
                                        ? matchJson.home_team.name.slice(0, 10) + '...'
                                        : matchJson.home_team.name,
                                },
                                visiting_team: {
                                    ...matchJson.visiting_team,
                                    name: matchJson.visiting_team.name.length > 10
                                        ? matchJson.visiting_team.name.slice(0, 10) + '...'
                                        : matchJson.visiting_team.name,
                                },
                                homeTeamLogo: matchJson.home_team.logo_url,
                                visitingTeamLogo: matchJson.visiting_team.logo_url,
                                homeTeamGoals: matchJson.home_team_goals,
                                visitingTeamGoals: matchJson.visiting_team_goals,
                                start_of_1st_half: matchJson.start_of_1st_half,
                            };
                        });
                    return gameinfo;

                });
                Promise.all(matchInfoPromises).then((matchInfo) => {
                    setFixtures(matchInfo);
                    console.log(matchInfo);
                    setLoading(false);
                });
            });
    }, []);

    const handleNavigateToTimeline = (gameid: string) => {
        navigation.navigate("Timeline", { gameid: gameid });
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView style={{}}>
            <View style={{ backgroundColor: '#fff', margin: 20, marginBottom: 60, borderRadius: 15, padding: 5 }}>
                {fixtures.map((fixture, index) => (
                    // <View
                    //     key={index}
                    //     style={{
                    //         flexDirection: 'row',
                    //         alignItems: 'center',
                    //         justifyContent: 'space-between',
                    //         position: 'relative',
                    //         borderTopWidth: index === 0 ? 0 : 1,
                    //         borderColor: index === 0 ? 'transparent' : '#ccc',
                    //         marginHorizontal: 5,
                    //         padding: 10,
                    //         backgroundColor: '#fff',
                    //     }}
                    // >
                    <TouchableOpacity
                        onPress={() => handleNavigateToTimeline(fixture.gameid)}
                        key={index}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            borderTopWidth: index === 0 ? 0 : 1,
                            borderColor: index === 0 ? 'transparent' : '#ccc',
                            marginHorizontal: 5,
                            padding: 12,
                            backgroundColor: '#fff',
                        }}
                    >
                        {/* Left side: Home team */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Image
                                source={{ uri: fixture.homeTeamLogo }}
                                style={{
                                    width: 25,
                                    height: 25,
                                    marginRight: 5,
                                    resizeMode: 'contain',
                                }}
                            />
                            <Text>{fixture.home_team.name}</Text>
                        </View>

                        {/* Center: Score */}
                        <View style={{ flex: 0, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold' }}>
                                {fixture.homeTeamGoals} - {fixture.visitingTeamGoals}
                            </Text>
                        </View>

                        {/* Right side: Visiting team */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={{ marginRight: 5 }}>{fixture.visiting_team.name}</Text>
                            <Image
                                source={{ uri: fixture.visitingTeamLogo }}
                                style={{
                                    width: 25,
                                    height: 25,
                                    resizeMode: 'contain',
                                }}
                            />
                        </View>
                    </TouchableOpacity>

                    // </View>


                    /* VS - centered absolutely */
                    //   <Text
                    //     style={{
                    //       position: 'absolute',
                    //       left: '50%',
                    //       transform: [{ translateX: -10 }],
                    //       fontWeight: 'bold',
                    //       borderWidth: 1,
                    //       borderColor: '#ccc',
                    //       height: '100%',
                    //     }}
                    //   >
                    //     vs
                    //   </Text>
                    // </View>

                ))}
            </View>
        </ScrollView>
    );
}
