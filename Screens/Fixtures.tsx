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
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import fixtureCard from '../components/fixtureCard';

type FixturesRouteProp = RouteProp<RootStackParamList, 'Fixtures'>;

const googleSheetsDataUrl =
    "https://sheets.googleapis.com/v4/spreadsheets/15sgdpVXsUMZdmxRdpfuFMc2pj4csPElt2dI7u5P9ROk/values/A2:G?key=AIzaSyCcADeLUsyye03WViRsMDviXjYOsmm-6eY";

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
                const allGameIds = data.values.map((item: string[]) => item[4]);

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
                                    name:
                                        matchJson.home_team.name.length > 10
                                            ? matchJson.home_team.name.slice(0, 10) + '...'
                                            : matchJson.home_team.name,
                                },
                                visiting_team: {
                                    ...matchJson.visiting_team,
                                    name:
                                        matchJson.visiting_team.name.length > 10
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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                {fixtures.map((fixture, index) => (
                    // <View ... >
                    <TouchableOpacity
                        onPress={() => handleNavigateToTimeline(fixture.gameid)}
                        key={index}
                        style={[
                            styles.fixtureRow,
                            index !== 0 && styles.fixtureRowBorder,
                        ]}
                    >
                        {/* Left side: Home team */}
                        <View style={styles.teamLeft}>
                            <Image
                                source={{ uri: fixture.homeTeamLogo }}
                                style={styles.teamLogo}
                            />
                            <Text>{fixture.home_team.name}</Text>
                        </View>

                        {/* Center: Score */}
                        <View style={styles.scoreContainer}>
                            <Text style={styles.scoreText}>
                                {fixture.homeTeamGoals} - {fixture.visitingTeamGoals}
                            </Text>
                        </View>

                        {/* Right side: Visiting team */}
                        <View style={styles.teamRight}>
                            <Text style={styles.teamNameRight}>{fixture.visiting_team.name}</Text>
                            <Image
                                source={{ uri: fixture.visitingTeamLogo }}
                                style={styles.teamLogo}
                            />
                        </View>
                    </TouchableOpacity>
                    // </View>

                    //   <Text ... >vs</Text>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {},

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    container: {
        backgroundColor: '#fff',
        margin: 20,
        marginBottom: 60,
        borderRadius: 15,
        padding: 5,
    },

    fixtureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginHorizontal: 5,
        padding: 12,
        backgroundColor: '#fff',
    },

    fixtureRowBorder: {
        borderTopWidth: 1,
        borderColor: '#ccc',
    },

    teamLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    teamRight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    teamNameRight: {
        marginRight: 5,
    },

    teamLogo: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        marginRight: 5,
    },

    scoreContainer: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },

    scoreText: {
        fontWeight: 'bold',
    },
});
