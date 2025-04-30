import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, LayoutAnimation, Platform, UIManager, Image} from 'react-native';
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
  imageLogo
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
 
  //console.log('her is the log ' + imageLogo);
  //console.log('assitId ' + assetId)
  return (
    
    <View style={styles.card}>
      <View style = {styles.eventDetials}>
        <View style={styles.eventTypeAndTime}>
            <Text style={styles.minute}>{matchMinute}</Text>
            <Text style= {{fontSize: 18,color: '#1d51a3', fontWeight : 'bold', paddingLeft: 15}}>{eventType.toUpperCase()}</Text> 
        </View>
        {/* <View>
          <TouchableOpacity onPress={toggleExpand}>
            <FontAwesome name={expanded ? "chevron-down" : "chevron-up"} size={20} color="#1d51a3" />
          </TouchableOpacity>
        </View> */}
      </View>
      <View >
        
            <View style = {styles.detailsDown}>
                <View style={{width:'80%'}} >
                    <Text style={styles.detailsText}>Team: <Text style = {styles.detailsTextInn}>{team ? `  ${team}` : ''} </Text> {imageLogo && <Image source={{ uri: imageLogo }} style={{ width: 23, height: 23 }} />}</Text>
                    {scorer != null && <Text style={styles.detailsText}>Done by: <Text style = {styles.detailsTextInn}>{scorer}</Text></Text>}
                    {assist != null && <Text style={styles.detailsText}>Assist by: <Text style = {styles.detailsTextInn}>{assist}</Text></Text>}
                    {/* {keeper != null && <Text style={styles.detailsText}>Keeper: <Text style = {styles.detailsTextInn}>{keeper}</Text></Text>} */}
                </View>
              <View >
                <TouchableOpacity onPress={handlePress}>
                  <FontAwesome name="play-circle" size={40} color="#1d51a3" style={{padding: 10}} />
                </TouchableOpacity>
              </View>
            </View>
              
        
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
  eventDetials : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent: 'space-between',

  },
  eventTypeAndTime : {
    flexDirection : 'row',
    
  },
  minute: {
    fontSize: 16,
    color: '#1d51a3',
  }, 
  detailsDown:{
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  detailsText: {
    fontSize : 18,
    fontWeight : 'bold',
  },
  detailsTextInn : {
    fontSize : 14,
    fontWeight : 'condensed'
  }
});


