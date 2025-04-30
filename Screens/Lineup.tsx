import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    Image,
    ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';

interface Player {
    id: number;
    name: string;
    shirt_number: number;
}

interface Team {
    name: string;
    logo_url: string;
    players: Player[];
}

type LineupRouteProp = RouteProp<RootStackParamList, 'Lineup'>;

const Lineup: React.FC = () => {
    const route = useRoute<LineupRouteProp>();
    const { gameid } = route.params;
    const [homeTeam, setHomeTeam] = useState<Team | null>(null);
    const [visitingTeam, setVisitingTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchLineup = async () => {
            try {
                const response = await fetch(`https://api.forzify.com/allsvenskan/game/${gameid}/players`);
                const data = await response.json();

                setHomeTeam(data.home_team);
                setVisitingTeam(data.visiting_team);
            } catch (error) {
                console.error('Failed to fetch lineup:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLineup();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.screen}>
                <ActivityIndicator size="large" color="#0066cc" />
            </SafeAreaView>
        );
    }

    const startersHome = homeTeam?.players.slice(0, 11) || [];
    const subsHome = homeTeam?.players.slice(11) || [];

    const startersAway = visitingTeam?.players.slice(0, 11) || [];
    const subsAway = visitingTeam?.players.slice(11) || [];

    return (
        <SafeAreaView style={styles.screen}>
            <Text style={styles.title}>Match Lineup</Text>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Teams logos and names */}
                <View style={styles.headerRow}>
                    <View style={styles.teamHeader}>
                        {homeTeam && (
                            <>
                                <Image source={{ uri: homeTeam.logo_url }} style={styles.logo} />
                                <Text style={styles.teamName}>{homeTeam.name}</Text>
                            </>
                        )}
                    </View>
                    <View style={styles.teamHeader}>
                        {visitingTeam && (
                            <>
                                <Image source={{ uri: visitingTeam.logo_url }} style={styles.logo} />
                                <Text style={styles.teamName}>{visitingTeam.name}</Text>
                            </>
                        )}
                    </View>
                </View>

                {/* Starters */}
                <Text style={styles.sectionTitle}>Starters</Text>
                {startersHome.map((homePlayer, index) => (
                    <View key={homePlayer.id + '-starter'} style={styles.row}>
                        <View style={styles.playerCard}>
                            <Text style={styles.playerNumber}>{homePlayer.shirt_number}</Text>
                            <Text style={styles.playerName}>{homePlayer.name}</Text>
                        </View>
                        <View style={styles.playerCard}>
                            {startersAway[index] && (
                                <>
                                    <Text style={styles.playerNumber}>{startersAway[index].shirt_number}</Text>
                                    <Text style={styles.playerName}>{startersAway[index].name}</Text>
                                </>
                            )}
                        </View>
                    </View>
                ))}

                {/* Subs */}
                <Text style={styles.sectionTitle}>Subs</Text>
                {subsHome.map((homeSub, index) => (
                    <View key={homeSub.id + '-sub'} style={styles.row}>
                        <View style={styles.playerCard}>
                            <Text style={styles.playerNumber}>{homeSub.shirt_number}</Text>
                            <Text style={styles.playerName}>{homeSub.name}</Text>
                        </View>
                        <View style={styles.playerCard}>
                            {subsAway[index] && (
                                <>
                                    <Text style={styles.playerNumber}>{subsAway[index].shirt_number}</Text>
                                    <Text style={styles.playerName}>{subsAway[index].name}</Text>
                                </>
                            )}
                        </View>
                    </View>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#222',
    },
    container: {
        paddingBottom: 30,
        paddingHorizontal: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        alignItems: 'center',
    },
    teamHeader: {
        alignItems: 'center',
        flex: 1,
    },
    logo: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    teamName: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 5,
        color: '#444',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 15,
        color: '#666',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    playerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        width: '48%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    playerNumber: {
        backgroundColor: '#0066cc',
        color: '#fff',
        fontWeight: 'bold',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginRight: 10,
        fontSize: 14,
        minWidth: 30,
        textAlign: 'center',
    },
    playerName: {
        fontSize: 16,
        color: '#333',
        flexShrink: 1,
    },
});

export default Lineup;



// import React from 'react';
// import {
//     SafeAreaView,
//     StyleSheet,
//     Text,
//     View,
//     Image,
//     ScrollView,
// } from 'react-native';

// const dummyMatch = {
//     home_team: {
//         name: 'Home FC',
//         logo_url: 'https://via.placeholder.com/60',
//         formation: {
//             name: '4-3-3',
//             positions: ['GK', 'RB', 'CB', 'CB', 'LB', 'CM', 'CM', 'CM', 'RW', 'CF', 'LW'],
//         },
//         players: [
//             { id: 1, name: 'Home GK', shirt_number: 1, position: 'GK' },
//             { id: 2, name: 'Home LB', shirt_number: 2, position: 'RB' },
//             { id: 3, name: 'Home CB1', shirt_number: 3, position: 'CB' },
//             { id: 4, name: 'Home CB2', shirt_number: 4, position: 'CB' },
//             { id: 5, name: 'Home RB', shirt_number: 5, position: 'LB' },
//             { id: 6, name: 'Home CM1', shirt_number: 6, position: 'CM' },
//             { id: 7, name: 'Home CM2', shirt_number: 7, position: 'CM' },
//             { id: 8, name: 'Home CM3', shirt_number: 8, position: 'CM' },
//             { id: 9, name: 'Home LW', shirt_number: 9, position: 'RW' },
//             { id: 10, name: 'Home CF', shirt_number: 10, position: 'CF' },
//             { id: 11, name: 'Home LW', shirt_number: 11, position: 'LW' },
//         ],
//     },
//     visiting_team: {
//         name: 'Away United',
//         logo_url: 'https://via.placeholder.com/60',
//         formation: {
//             name: '4-3-3',
//             positions: ['GK', 'RB', 'CB', 'CB', 'LB', 'CM', 'CM', 'CM', 'RW', 'CF', 'LW'],
//         },
//         players: [
//             { id: 12, name: 'Away GK', shirt_number: 1, position: 'GK' },
//             { id: 13, name: 'Away LB', shirt_number: 2, position: 'RB' },
//             { id: 14, name: 'Away CB1', shirt_number: 3, position: 'CB' },
//             { id: 15, name: 'Away CB2', shirt_number: 4, position: 'CB' },
//             { id: 16, name: 'Away RB', shirt_number: 5, position: 'LB' },
//             { id: 17, name: 'Away CM1', shirt_number: 6, position: 'CM' },
//             { id: 18, name: 'Away CM2', shirt_number: 7, position: 'CM' },
//             { id: 19, name: 'Away CM3', shirt_number: 8, position: 'CM' },
//             { id: 20, name: 'Away LW', shirt_number: 9, position: 'LW' },
//             { id: 21, name: 'Away RW', shirt_number: 10, position: 'CF' },
//             { id: 22, name: 'Away CF', shirt_number: 11, position: 'CF' },
//         ],
//     },
// };

// const Lineup: React.FC = () => {
//     const renderRow = (players: any[], reverse = false) => (
//         <View style={[styles.row, reverse && { flexDirection: 'row-reverse' }]}>
//             {players.map(renderPlayer)}
//         </View>
//     );

//     const getPlayers = (team: any, positions: string[]) =>
//         positions.flatMap((pos) =>
//             team.players.filter((p: any) => p.position === pos)
//         );

//     const group = {
//         top: ['RW', 'CF', 'LW'],
//         mid: ['CM'],
//         back: ['RB', 'CB', 'LB'],
//         gk: ['GK'],
//     };

//     return (
//         <SafeAreaView style={styles.screen}>
//             <Text style={styles.title}>Match Lineup (4-3-3)</Text>

//             <ScrollView contentContainerStyle={styles.pitch} showsVerticalScrollIndicator={false}>

//                 {/* VISITING TEAM (TOP, MIRRORED) */}
//                 <Image source={{ uri: dummyMatch.visiting_team.logo_url }} style={styles.logo} />
//                 <Text style={styles.teamName}>{dummyMatch.visiting_team.name}</Text>

//                 {renderRow(getPlayers(dummyMatch.visiting_team, group.gk), true)}
//                 {renderRow(getPlayers(dummyMatch.visiting_team, group.back), true)}
//                 {renderRow(getPlayers(dummyMatch.visiting_team, group.mid), true)}
//                 {renderRow(getPlayers(dummyMatch.visiting_team, group.top), true)}

//                 <View style={styles.centerLine} />

//                 {/* HOME TEAM (BOTTOM) */}
//                 {renderRow(getPlayers(dummyMatch.home_team, group.top))}
//                 {renderRow(getPlayers(dummyMatch.home_team, group.mid))}
//                 {renderRow(getPlayers(dummyMatch.home_team, group.back))}
//                 {renderRow(getPlayers(dummyMatch.home_team, group.gk))}

//                 <Text style={styles.teamName}>{dummyMatch.home_team.name}</Text>
//                 <Image source={{ uri: dummyMatch.home_team.logo_url }} style={styles.logo} />
//             </ScrollView>

//         </SafeAreaView>
//     );
// };

// const renderPlayer = (player: any) => (
//     <View key={player.id} style={styles.playerBubble}>
//         <Text style={styles.shirtNumber}>{player.shirt_number}</Text>
//         <Text style={styles.playerText}>{player.name}</Text>
//     </View>
// );

// const styles = StyleSheet.create({
//     screen: {
//         flex: 1,
//         backgroundColor: '#e7f0ec',
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginTop: 10,
//         marginBottom: 10,
//         color: '#222',
//     },
//     pitch: {
//         backgroundColor: '#39a86b',
//         borderColor: '#fff',
//         borderWidth: 2,
//         borderRadius: 20,
//         paddingVertical: 20,
//         paddingHorizontal: 10,
//         justifyContent: 'space-between',
//     },
//     row: {
//         flexDirection: 'row',
//         justifyContent: 'space-evenly',
//         marginVertical: 8,
//         flexWrap: 'wrap',
//     },
//     playerBubble: {
//         alignItems: 'center',
//         backgroundColor: '#fff',
//         paddingVertical: 6,
//         paddingHorizontal: 12,
//         borderRadius: 50,
//         marginHorizontal: 4,
//         marginBottom: 4,
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//         elevation: 3,
//     },
//     shirtNumber: {
//         fontWeight: 'bold',
//         fontSize: 14,
//         backgroundColor: '#007bff',
//         color: '#fff',
//         paddingHorizontal: 8,
//         paddingVertical: 2,
//         borderRadius: 12,
//         marginBottom: 2,
//     },
//     playerText: {
//         fontSize: 13,
//         color: '#333',
//         textAlign: 'center',
//     },
//     teamName: {
//         textAlign: 'center',
//         fontSize: 18,
//         fontWeight: '600',
//         marginVertical: 4,
//         color: '#fff',
//     },
//     logo: {
//         width: 50,
//         height: 50,
//         alignSelf: 'center',
//         marginVertical: 4,
//     },
//     centerLine: {
//         height: 1,
//         backgroundColor: '#fff',
//         marginVertical: 10,
//     },
// });

// export default Lineup;
