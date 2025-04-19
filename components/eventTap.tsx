{/*
      <View  style={styles.contents}>
        <View style={styles.rightContant}>
          <View>
            <Text style={styles.minute}>{matchMinute}    <Text style={styles.bold}>{eventType.toUpperCase()}</Text> </Text>
          </View>
          <View >
              <TouchableOpacity onPress={toggleExpand}>
                  <FontAwesome name={expanded ? "chevron-down" : "chevron-up"} size={15} color="#1d51a3" />
              </TouchableOpacity>
             
          </View>
          
        </View>
          <View style={styles.card}>
          {expanded && (
                <View>
                    <Text>Team: {team ? `  ${team}` : ''}</Text>
                    {eventType === 'gaol' && <Text>Scorer: {scorer}</Text>}
                    {scorer != null && <Text>Player: {scorer}</Text>}
                    {keeper != null && <Text>Keeper: {keeper}</Text>}
                </View>
          )}
              {/* <TouchableOpacity onPress={toggleExpand}>
                <Text >click here</Text>
              </TouchableOpacity>
              {expanded && (
                <View>
                    <Text>Team: {team ? `  ${team}` : ''}</Text>
                    {eventType === 'gaol' && <Text>Scorer: {scorer}</Text>}
                    {scorer != null && <Text>Player: {scorer}</Text>}
                    {keeper != null && <Text>Keeper: {keeper}</Text>}
                  
                </View>
              )} 
              
              
          </View>
                  {/*<Text style={styles.eventText}>
                    <Text style={styles.bold}>{eventType.toUpperCase()}</Text> 
                    <Text>
                      {team ? `  ${team}` : ''} 
                      {eventType === 'goal' ? `Goal by ${scorer}` : ''} 
                      
                      {eventType === 'yellow card' ? ' (Yellow Card)' : ''}
                      {eventType === 'red card' ? ' (Red Card)' : ''}
                      {eventType === 'assist' ? ' (Assist)' : ''}
                    </Text>
                  </Text>

                <TouchableOpacity onPress={handlePress}>
                <FontAwesome name="play-circle" size={30} color="#1d51a3" style={styles.playIcon} />
              </TouchableOpacity>
        
      </View>
      */}

      const styles = StyleSheet.create({
        card: {
          backgroundColor: '#fff',
          padding: 14,
          marginHorizontal: 5,
          marginVertical: 4,
        },
        contents: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        rightContant: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 5,
          paddingRight : 10,
          flex: 1,
        },
        leftContent: {
          flex: 1,
          alignItems: 'flex-start',
        },
        playIcon: {
          padding: 1,
        },
        eventText: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontSize: 16,
          color: '#333',
          marginTop: 4,
        },
        bold: {
          fontWeight: 'bold',
          color: '#1d51a3',
        },
        minute: {
          fontSize: 16,
          color: '#1d51a3',
        },
      });