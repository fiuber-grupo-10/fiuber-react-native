import React, { useContext } from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import TopBar from '../components/TopBar'
import { FiuberContext } from '../context/FiuberContext';



const ProfileScreen = ({navigation}) => {

    const {user, role} = useContext(FiuberContext);
    
    return (
      <SafeAreaView style={styles.container}>
        <TopBar {...navigation} />
        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'row', alignItems:'center', marginTop: 15}}>
            <Avatar.Image
              size={100}
              source={{uri:'https://avatars.dicebear.com/api/big-smile/'+user.uid+'.png'}}
            />
            <View style={{marginLeft: 20}}>
              <Title style={[styles.title, {
                  marginTop:15,
                  marginBottom: 5,
                }]}>{user.name}
              </Title>
            </View>
          </View>
        </View>
  
        <View style={styles.userInfoSection}>

          <View style={styles.row}>
            <Ionicons name="mail" color="#777777" size={20}/>
            <Text style={{color:"#777777", marginLeft: 20}}>{user.email}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="person-outline" color="#777777" size={20}/>
            <Text style={{color:"#777777", marginLeft: 20}}>{role}</Text>
          </View>


          {(role == 'passenger') ? 
            <></>
            :
            <View style={styles.row}>
              <Ionicons name="car-outline" color="#777777" size={20}/>
              { <Text style={{color:"#777777", marginLeft: 20}}>{user.car_model} - {user.car_patent}</Text> }
            </View>
          }
        </View>
  
        <View style={styles.infoBoxWrapper}>
            <View style={[styles.infoBox, {
              borderRightColor: '#dddddd',
              borderLeftColor: '#dddddd',
              borderRightWidth: 1,
              borderLeftWidth:1,
            }]}>
              <Title>0</Title>
              <Caption>Trips</Caption>
            </View>

            {role == 'driver' ?
            <View style={styles.infoBoxDriverDetails}> 
              <View style={[styles.infoBox, {
             
            }]}>
                <View style={styles.infoBoxDriver}>
                  <Title>4.9</Title>
                  <Ionicons name="star" color="#777777" size={20}/>
                </View>
                  <Caption>Rating</Caption>
                </View>
          
                </View>
              :
              
               <></>
               }

        </View>
  
        <View style={styles.menuWrapper}>
        {role == 'passenger' ?
        <View> 
          <TouchableRipple onPress={()=>{navigation.navigate('Driver Info')}}>
            <View style={styles.menuItem}>
              <Ionicons name="heart-outline" color="#FF6347" size={25}/>
              <Text style={styles.menuItemText}>My Driver Info</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={()=>{navigation.navigate('My Destinations')}}>
          <View style={styles.menuItem}>
            <Ionicons name="heart-outline" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>My Destinations</Text>
          </View>
        </TouchableRipple>
        </View>
          : 
          <TouchableRipple onPress={()=>{navigation.navigate('Passenger Info')}}>
          <View style={styles.menuItem}>
            <Ionicons name="heart-outline" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>My Passenger Info</Text>
          </View>
          </TouchableRipple>
          }
          <TouchableRipple onPress={() => {navigation.navigate('Wallet')}}>
            <View style={styles.menuItem}>
              <Ionicons name="logo-bitcoin" color="#FF6347" size={25}/>
              <Text style={styles.menuItemText}>Wallet</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {navigation.navigate('Edit profile')}}>
            <View style={styles.menuItem}>
              <Ionicons name="settings-outline" color="#FF6347" size={25}/>
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
          </TouchableRipple>
        </View>
      </SafeAreaView>
    );
  };
  
  export default ProfileScreen;
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    userInfoSection: {
      paddingHorizontal: 30,
      marginBottom: 15,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      backgroundColor: 'white'
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
      fontWeight: '500',
    },
    row: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    infoBoxWrapper: {
      borderBottomColor: '#dddddd',
      borderBottomWidth: 1,
      borderTopColor: '#dddddd',
      borderTopWidth: 1,
      flexDirection: 'row',
      height: 100,
    },
    infoBox: {
      width: '30%',
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    infoBoxDriver: {
     
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
  
      
    },
    infoBoxDriverDetails: {
      width: '50%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      
      
    },
    menuWrapper: {
      marginTop: 10,
    },
    menuItem: {
      flexDirection: 'row',
      paddingVertical: 15,
      paddingHorizontal: 30,
    },
    menuItemText: {
      color: '#777777',
      marginLeft: 20,
      fontWeight: '600',
      fontSize: 16,
      lineHeight: 26,
    },
  });