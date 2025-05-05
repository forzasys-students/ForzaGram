// components/EventCard.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, LayoutAnimation, Platform, UIManager, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { FontAwesome } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VideoScreen'>;


interface Props {
  assetId: number;
  from: number;
  to: number;
  eventType: string;
  scorer?: string;
  keeper?: string;
  imageLogo?: string;
  assist?: string | null;
  team?: string;
  gametime?: number;
  teamId?: string;
  homeTeamId?: string;
  visitingTeamId?: string;
  shotType?: string;
  result?: string;
  substitution_in?: string;
  substitution_out?: string;
}

export default function EventCard({
  assetId,
  from,
  to,
  eventType,
  scorer,
  keeper,
  assist,
  team,
  gametime,
  imageLogo,
  teamId,
  homeTeamId,
  visitingTeamId,
  shotType,
  result,
  substitution_in,
  substitution_out,
}: Props) {
  const navigation = useNavigation<NavigationProp>();
  const [expanded, setExpanded] = useState(false);
  const matchMinute = gametime != null
    ? `${Math.floor(gametime / 60)}'`
    : '0\'';
  const handlePress = () => {
    navigation.navigate('VideoScreen', {
      assetId,
      from,
      to,
    });
  };

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  }

  const Substitution = ({ substitution_in, substitution_out, align }: { substitution_in?: string; substitution_out?: string, align: string }) => {
    const alignment = align === 'left' ? 'flex-start' : 'flex-end';
    const playerInArrow = align === 'left' ? 'arrow-right' : 'arrow-left';
    const playerOutArrow = align === 'left' ? 'arrow-left' : 'arrow-right';
    return (
      <View style={{ alignSelf: alignment, flexDirection: 'column', }}>

        <View style={{ flexDirection: 'row', justifyContent: alignment, marginBottom: 2 }}>
          {align === 'left' && <FontAwesome name={playerInArrow} size={13} color="green" style={{ paddingRight: 10, alignSelf: alignment, top: 2 }} />}
          <Text style={[styles.detailsText, { fontSize: 14, color: 'green' }]}>
            {substitution_in}
          </Text>
          {align === 'right' && <FontAwesome name={playerInArrow} size={13} color="green" style={{ paddingLeft: 10, alignSelf: alignment, bottom: 2 }} />}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: alignment, marginBottom: 5 }}>
          {align === 'left' && <FontAwesome name={playerOutArrow} size={13} color="red" style={{ paddingRight: 10, alignSelf: alignment, top: 2 }} />}
          <Text style={[styles.detailsText, { fontSize: 14, color: 'red' }]}>
            {substitution_out}
          </Text>
          {align === 'right' && <FontAwesome name={playerOutArrow} size={13} color="red" style={{ paddingLeft: 10, alignSelf: alignment, bottom: 2 }} />}

        </View>
      </View>

    );
  }

  //console.log('her is the log ' + imageLogo);
  //console.log('assitId ' + assetId)
  //console.log(teamId, homeTeamId, visitingTeamId);
  //console.log(substitution_in, substitution_out);
  return (

    //   _                          
    //  | |__   ___  _ __ ___   ___ 
    //  | '_ \ / _ \| '_ ` _ \ / _ \
    //  | | | | (_) | | | | | |  __/
    //  |_| |_|\___/|_| |_| |_|\___|


    <View style={[styles.card, { alignSelf: teamId === visitingTeamId ? 'flex-end' : teamId === undefined ? 'center' : 'flex-start' }]}>
      <View style={styles.eventDetials}>
        <View style={styles.eventTypeAndTime}>
          {teamId === homeTeamId ? (
            <>

              {/* Event type and match minute */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Text style={styles.minute}>{matchMinute}</Text>

                {/* Event Icon or Label */}
                {eventType.toLowerCase() === 'goal' ? (
                  <View style={{ paddingHorizontal: 10 }}>
                    <FontAwesome
                      name="futbol-o"
                      size={13}
                      color={shotType?.toLowerCase() === 'own goal' ? 'red' : 'black'}
                    />
                  </View>
                ) : eventType.toLowerCase() === 'yellow card' ? (
                  <View style={styles.yellowCard} />
                ) : eventType.toLowerCase() === 'red card' ? (
                  <View style={styles.redCard} />
                ) : eventType.toLowerCase() === 'medical treatment' ? (
                  <View style={{ paddingHorizontal: 10 }}>
                    <FontAwesome name="medkit" size={15} color="red" />
                  </View>
                ) : eventType.toLowerCase() === 'substitution' ? (
                  <View style={{ paddingHorizontal: 10 }}>
                    <Substitution
                      substitution_in={substitution_in}
                      substitution_out={substitution_out}
                      align="left"
                    />
                  </View>
                ) : (
                  <Text style={{
                    fontSize: 13,
                    color: '#1d51a3',
                    fontWeight: 'bold',
                    paddingHorizontal: 15,
                    alignSelf: 'flex-start'
                  }}>
                    {eventType.toUpperCase()}
                  </Text>
                )}
              </View>


              {/*event section*/}
              <View style={{ alignSelf: 'flex-start', flexDirection: 'column' }}>

                {/* In case a player name is included in the event*/}
                {scorer != null ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>


                    {/* Button to show a video of the event */}
                    <TouchableOpacity onPress={handlePress}>
                      <View style={[eventType.toLowerCase() === 'goal' ? styles.eventButtonGoal : styles.eventButton, { marginRight: 8 }]}>
                        <Text>
                          <FontAwesome name="play" size={13} color="black" />
                          
                          {/* In case it's a goal, show the new score */}
                          {eventType.toLowerCase() === 'goal' && (
                            <>
                              {' '}{result?.split('-')[0]} -
                              <Text style={{ fontWeight: 'bold', color: '#1d51a3' }}> {result?.split('-')[1]}</Text>
                            </>
                          )}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Player name */}
                    <Text style={[styles.detailsText, { textAlign: 'left' }]}>{scorer}</Text>
                  </View>
                ) : (

                  // Button to show a video of the event in a case a scorer doesn't exist

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <TouchableOpacity onPress={handlePress}>
                      <View style={[styles.eventButton]}>
                        <FontAwesome name="play" size={13} color="black" />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}

                {(assist || (shotType && shotType !== 'standard')) && (
                  <Text style={styles.detailsTextInn}>
                    {shotType && shotType !== 'standard' && (
                      <Text
                        style={[
                          styles.detailsTextInn,
                          { color: shotType.toLowerCase() === 'own goal' ? 'red' : '#000' }
                        ]}
                      >
                        {shotType.charAt(0).toUpperCase() + shotType.slice(1)}
                      </Text>
                    )}
                    {assist && (
                      <>
                        {shotType && shotType !== 'standard' && ', '}
                        Assist by:{' '}
                        <Text style={styles.detailsTextInn}>
                          {assist.charAt(0).toUpperCase() + assist.slice(1)}
                        </Text>
                      </>
                    )}
                  </Text>
                )}
              </View>


            </>



            //   __ ___      ____ _ _   _ 
            //  / _` \ \ /\ / / _` | | | |
            // | (_| |\ V  V / (_| | |_| |
            //  \__,_| \_/\_/ \__,_|\__, |
            //                      |___/ 

          ) : teamId === visitingTeamId ? (
            <>

              {/*event section*/}
              <View style={{ alignSelf: 'flex-end', flexDirection: 'column', top: 2 }}>

                {/* In case a player name is included in the event*/}
                {scorer != null ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>



                    {/* Player name */}
                    <Text style={[styles.detailsText, { textAlign: 'right' }]}>{scorer}</Text>

                    {/* Button to show a video of the event */}
                    <TouchableOpacity onPress={handlePress}>
                      <View style={[eventType.toLowerCase() === 'goal' ? styles.eventButtonGoal : styles.eventButton, { marginLeft: 7 }]}>
                        <Text>
                          <FontAwesome name="play" size={13} color="black" />

                          {/* In case it's a goal, show the new score */}
                          {eventType.toLowerCase() === 'goal' && (
                            <>
                              {' '}{result?.split('-')[0]} -
                              <Text style={{ fontWeight: 'bold', color: '#1d51a3' }}> {result?.split('-')[1]}</Text>
                            </>
                          )}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (

                  // Button to show a video of the event in a case a scorer doesn't exist
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <TouchableOpacity onPress={handlePress}>
                      <View style={[styles.eventButton]}>
                        <FontAwesome name="play" size={13} color="black" />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}

                {/* In case of a goal, include the type and the player the assist made by*/}
                {(assist || (shotType && shotType !== 'standard')) && (
                  <Text style={[styles.detailsTextInn, { marginBottom: assist || shotType ? 2 : 0 }]}>
                    {shotType && shotType !== 'standard' && (
                      <Text
                        style={[
                          styles.detailsTextInn,
                          { color: '#000', textAlign: 'right' },
                        ]}
                      >
                        {shotType.charAt(0).toUpperCase() + shotType.slice(1)}
                      </Text>
                    )}
                    {assist && shotType && shotType !== 'standard' && ', '}
                    {assist && (
                      <Text>
                        Assist by:{' '}
                        <Text style={styles.detailsTextInn}>
                          {assist.charAt(0).toUpperCase() + assist.slice(1)}
                        </Text>
                      </Text>
                    )}
                  </Text>
                )}
              </View>

              {/* Event type and match minute */}
              <View style={{ flexDirection: 'row', height: 15 }}>

                {/*In case of a goal*/}
                {eventType.toLowerCase() === 'goal' ? (
                  <View style={{ paddingHorizontal: 15, alignSelf: 'flex-end', top: 2 }}>
                    <FontAwesome
                      name="futbol-o"
                      size={13}
                      color={shotType?.toLowerCase() === 'own goal' ? 'red' : 'black'}
                    />
                  </View>
                )
                  // In case of a yellow card
                  : eventType.toLowerCase() === 'yellow card' ? (
                    <View style={styles.yellowCard} />
                  )
                    // In case of a red card
                    : eventType.toLowerCase() === 'red card' ? (
                      <View style={styles.redCard} />
                    )

                      // In case of a medical treatment
                      : eventType.toLowerCase() === 'medical treatment' ? (
                        <View style={{ paddingHorizontal: 15, alignSelf: 'flex-end', top: 2 }}>
                          <FontAwesome
                            name="medkit"
                            size={15}
                            color="red"
                          />
                        </View>
                      )

                        // In case of a substitution
                        : eventType.toLowerCase() === 'substitution' ? (
                          <View style={{ paddingHorizontal: 15, alignSelf: 'flex-end', top: 2 }}>
                            <Substitution substitution_in={substitution_in} substitution_out={substitution_out} align='right' />
                          </View>
                        )
                          : (
                            <Text style={{ fontSize: 13, color: '#1d51a3', fontWeight: 'bold', paddingHorizontal: 15, alignSelf: 'flex-end' }}>
                              {eventType.toUpperCase()}
                            </Text>
                          )}
                <Text style={styles.minute}>{matchMinute}</Text>
              </View>
            </>
          ) : (
            <>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flex: 1, height: 1, backgroundColor: '#1d51a3', marginRight: 10 }} />
                <Text style={{ fontSize: 13, color: '#1d51a3', fontWeight: 'bold', alignSelf: 'center' }}>{eventType.toUpperCase()}</Text>
                <Text style={styles.minute}>{' '}
                {parseInt(matchMinute, 10) <= 60 
                  ? `45 + ${Math.floor(parseInt(matchMinute, 10) ) - 45}'`
                  : `90 + ${Math.floor(parseInt(matchMinute, 10)) - 90}'`}</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: '#1d51a3', marginLeft: 10 }} />
                </View>
            </>
          )}
        </View>
      </View>
      <View >
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 8,
    marginHorizontal: 5,
    marginVertical: 4,
  },
  eventDetials: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTypeAndTime: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  minute: {
    fontSize: 13,
    color: '#1d51a3',
    fontWeight: 'bold',
  },
  eventButton: {
    borderWidth: 1.5,
    borderColor: '#1d51a3',
    borderRadius: 18,
    padding: 4,
    paddingHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#9bbdf2',
  },
  eventButtonGoal: {
    borderWidth: 1.5,
    borderColor: '#1d51a3',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginLeft: 8,
    backgroundColor: '#9bbdf2',
  },
  yellowCard: {
    width: 13,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#ffdd00",
    borderWidth: 0.5,
    borderColor: "#000",
    marginHorizontal: 15,
  },
  redCard: {
    width: 13,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#eb4034",
    borderWidth: 0.5,
    borderColor: "#000",
    marginHorizontal: 15,
  },
  detailsDown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailsText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  detailsTextInn: {
    fontSize: 13,
    fontWeight: 'condensed'
  }
});


