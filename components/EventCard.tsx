// components/EventCard.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, LayoutAnimation, Platform, UIManager, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { FontAwesome } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VideoScreen'>;


interface Props {
  assetId: any;
  from: any;
  to: any;
  eventType: any;
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

  const HomeTeamEvents = () => {
    return (
      <>

        {/* Event type and match minute */}
        <View style={styles.homeTeam_Event_and_Time}>
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

            // In case of a yellow card
          ) : eventType.toLowerCase() === 'yellow card' ? (
            <View style={styles.yellowCard} />

            // In case of a red card
          ) : eventType.toLowerCase() === 'red card' ? (
            <View style={styles.redCard} />

            // In case of a medical treatment
          ) : eventType.toLowerCase() === 'medical treatment' ? (
            <View style={{ paddingHorizontal: 10 }}>
              <FontAwesome
                name="medkit"
                size={15}
                color="red"
              />
            </View>

            // In case of a substitution
          ) : eventType.toLowerCase() === 'substitution' ? (
            <View style={{ paddingHorizontal: 10 }}>
              <Substitution
                substitution_in={substitution_in}
                substitution_out={substitution_out}
                align="left"
              />
            </View>
          ) : (

            // In case of other events than the ones mentioned above
            <Text style={[
              styles.otherEvent, {
                alignSelf: 'flex-start'
              }
            ]}>
              {eventType.toUpperCase()}
            </Text>
          )}
        </View>


        {/*event section*/}
        <View style={styles.homeTeamEventSection}>

          {/* In case a player name is included in the event*/}
          {scorer != null ? (
            <View style={[styles.scorer, { justifyContent: 'flex-start' }]}>


              {/* Button to show a video of the event */}
              <TouchableOpacity onPress={handlePress}>
                <View style={[eventType.toLowerCase() === 'goal' ? styles.eventButtonGoal : styles.eventButton, { marginRight: 7 }]}>
                  <Text>
                    <FontAwesome name="play" size={13} color="black" />

                    {/* In case it's a goal, show the new score */}
                    {eventType.toLowerCase() === 'goal' && (
                      <>

                        <Text style={styles.boldGoal}>{result?.split('-')[0]}</Text>{' '}-{' '}{result?.split('-')[1]}
                      </>
                    )}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Player name */}
              <Text style={[styles.playerName, { textAlign: 'left' }]}>{scorer}</Text>
            </View>
          ) : (

            // Buttons to other events than a goal

            <View style={styles.eventButtonPosition}>
              <TouchableOpacity onPress={handlePress}>
                <View style={[styles.eventButton]}>
                  <FontAwesome name="play" size={13} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Include the shot type in case of a shot.
           include the shot type and the player the assist made by in case of a goal*/}
          {(assist || (shotType && shotType !== 'standard')) && (
            <Text style={styles.eventDetails}>
              {shotType && shotType !== 'standard' && (
                <Text
                  style={[
                    styles.eventDetails,
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
                  <Text style={styles.eventDetails}>
                    {assist.charAt(0).toUpperCase() + assist.slice(1)}
                  </Text>
                </>
              )}
            </Text>
          )}
        </View>


      </>
    )
  }

  const VisitingTeamEvents = () => {
    return (
      <>
        {/*event section*/}
        <View style={styles.visitingTeamEventSection}>

          {/* In case a player name is included in the event*/}
          {scorer != null ? (
            <View style={[styles.scorer, { justifyContent: 'flex-end' }]}>



              {/* Player name */}
              <Text style={[styles.playerName, { textAlign: 'right' }]}>{scorer}</Text>

              {/* Button to show a video of the event */}
              <TouchableOpacity onPress={handlePress}>
                <View style={[eventType.toLowerCase() === 'goal' ? styles.eventButtonGoal : styles.eventButton, { marginLeft: 7 }]}>
                  <Text>
                    <FontAwesome name="play" size={13} color="black" />

                    {/* In case it's a goal, show the new score */}
                    {eventType.toLowerCase() === 'goal' && (
                      <>
                        {' '}{result?.split('-')[0]} -
                        <Text style={styles.boldGoal}> {result?.split('-')[1]}</Text>
                      </>
                    )}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (

            // Buttons to other events than a goal
            <View style={styles.eventButtonPosition}>
              <TouchableOpacity onPress={handlePress}>
                <View style={[styles.eventButton]}>
                  <FontAwesome name="play" size={13} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Include the shot type in case of a shot.
           include the shot type and the player the assist made by in case of a goal*/}
          {(assist || (shotType && shotType !== 'standard')) && (
            <Text style={[styles.eventDetails, { marginBottom: assist || shotType ? 2 : 0 }]}>
              {shotType && shotType !== 'standard' && (
                <Text
                  style={[
                    styles.eventDetails,
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
                  <Text style={styles.eventDetails}>
                    {assist.charAt(0).toUpperCase() + assist.slice(1)}
                  </Text>
                </Text>
              )}
            </Text>
          )}
        </View>

        {/* Event type and match minute */}
        <View style={styles.visitingTeam_Event_and_Time}>

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
                      <Substitution
                        substitution_in={substitution_in}
                        substitution_out={substitution_out}
                        align='right'
                      />
                    </View>
                  ) : (

                    // In case of other events than the ones mentioned above
                    <Text style={[
                      styles.otherEvent, {
                        alignSelf: 'flex-end',
                      }
                    ]}>
                      {eventType.toUpperCase()}
                    </Text>
                  )}

          {/* Match minute */}
          <Text style={styles.minute}>{matchMinute}</Text>
        </View>
      </>
    )
  }
  const NeutralEvents = () => {
    return (
      <>
        <View style={styles.neturalEventContainer}>
          <View style={styles.neutralEventLine} />
          <Text style={styles.neutralEventText}>
            {eventType.toLowerCase() === 'end phase' ? 'Half Time'
              : eventType.toLowerCase() === 'end of game' ? 'Full Time'
                : eventType.toUpperCase()}
          </Text>
          <Text style={styles.minute}>
            {' '}
            {eventType === 'end phase'
              ? `45 + ${Math.floor(parseInt(matchMinute, 10)) - 45}'`
              : `90 + ${Math.floor(parseInt(matchMinute, 10)) - 90}'`}
            {' '}
          </Text>
          <View style={styles.neutralEventLine} />
        </View>
      </>
    )
  }


  const Substitution = ({ substitution_in, substitution_out, align }: { substitution_in?: string; substitution_out?: string, align: string }) => {
    const alignment = align === 'left' ? 'flex-start' : 'flex-end';
    const playerInArrow = align === 'left' ? 'arrow-right' : 'arrow-left';
    const playerOutArrow = align === 'left' ? 'arrow-left' : 'arrow-right';
    return (
      <View style={{ alignSelf: alignment, flexDirection: 'column', }}>

        <View style={[styles.substitutionContainer, { justifyContent: alignment }]}>

          {/*Player in, and suitable arrow*/}
          {align === 'left' && <FontAwesome name={playerInArrow} size={13} color="green"
            style={styles.substitutionHomeArrow} />}

          {/* Player in name */}
          <Text style={[styles.playerName, styles.substitutionPlayerIn]}>
            {substitution_in}
          </Text>

          {align === 'right' && <FontAwesome name={playerInArrow} size={13} color="green"
            style={styles.substitutionVisitingArrow} />}
        </View>

        {/*Player out, and suitable arrow*/}
        <View style={[styles.substitutionContainer, { justifyContent: alignment }]}>
          {align === 'left' && <FontAwesome name={playerOutArrow} size={13} color="red"
            style={styles.substitutionHomeArrow} />}

          {/* Player out name */}
          <Text style={[styles.playerName, styles.substitutionPlayerOut]}>
            {substitution_out}
          </Text>

          {align === 'right' && <FontAwesome name={playerOutArrow} size={13} color="red"
            style={styles.substitutionVisitingArrow} />}

        </View>
      </View>

    );
  }

  // Return the component
  return (
    <View
      style={
        [styles.card,
        {
          alignSelf: teamId === visitingTeamId ? 'flex-end'
            : teamId === undefined ? 'center'
              : 'flex-start'
        }]}>
      <View style={styles.eventTypeAndTime}>
        {teamId === homeTeamId ? (
          <HomeTeamEvents />

        ) : teamId === visitingTeamId ? (
          <VisitingTeamEvents />

        ) : (
          <NeutralEvents />
        )}
      </View>
      <View >
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  homeTeamEventSection: {
    alignSelf: 'flex-start',
    flexDirection: 'column',
  },
  visitingTeamEventSection: {
    alignSelf: 'flex-end',
    flexDirection: 'column',
    top: 2,
  },
  homeTeam_Event_and_Time: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  visitingTeam_Event_and_Time: {
    flexDirection: 'row',
    height: 15
  },
  scorer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boldGoal: {
    fontWeight: 'bold',
    color: '#1d51a3',
  },
  eventButtonPosition: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  otherEvent: {
    fontSize: 13,
    color: '#1d51a3',
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  playerName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  eventDetails: {
    fontSize: 13,
    fontWeight: 'condensed'
  },

  neturalEventContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
  },
  neutralEventLine: {
    flex: 1, height: 1, backgroundColor: '#1d51a3', marginRight: 10
  },
  neutralEventText: {
    fontSize: 13, color: '#1d51a3', fontWeight: 'bold', alignSelf: 'center'
  },
  substitutionContainer: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  substitutionHomeArrow: {
    paddingRight: 10,
    alignSelf: 'flex-start',
    top: 2,
  },
  substitutionVisitingArrow: {
    paddingLeft: 10,
    alignSelf: 'flex-end',
    bottom: 2,
  },
  substitutionPlayerIn: {
    fontSize: 13,
    color: 'green',
    paddingLeft: 5,
  },
  substitutionPlayerOut: {
    fontSize: 13,
    color: 'red',
    paddingLeft: 5,
  },


});


