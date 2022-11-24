/* eslint-disable no-unused-vars */
import  React, {useState, useContext} from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions} from 'react-native';
import { Text, TextInput, TouchableRipple, Button, ActivityIndicator} from 'react-native-paper';
import { auth, logInWithEmailAndPassword, sendPasswordReset } from '../firebase';
import { FiuberContext } from '../context/FiuberContext';
import { getUser } from '../services/users';

import * as Location from 'expo-location';

const {width, height} = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function LoginScreen({navigation}) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false);

    const {setLoggedIn, setRole, setDestination, setCurrentLocation, setUser, role} = useContext(FiuberContext);

    const handleLogin = async () => {

        setLoading(true);
      
        try {

            // se loggea el usuario en firebase
            await logInWithEmailAndPassword(email, password);
            const user_uid = auth.currentUser.uid;
            const idTokenResult = await auth.currentUser.getIdTokenResult();

            // se busca al usuario
            const user_response = await getUser(user_uid, idTokenResult.token);

            // se pide acceso a current location (esto se haria nada mas en register)
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            
            // se busca la current location
            let location = await Location.getCurrentPositionAsync({});

            let { longitude, latitude } = location.coords;

            let regionName = await Location.reverseGeocodeAsync({
                longitude,
                latitude,
            });
            console.log("region ", regionName);
            const street = (regionName[0].street)
            const streetNumber = regionName[0].streetNumber
            const city = regionName[0].city

            const description = `${street} ${streetNumber}, ${city}`

            const address = {
                description: description,
                longitude:location.coords.longitude,
                latitude:location.coords.latitude,
                longitudeDelta:  0.09,
                latitudeDelta:  0.04
            }

            setCurrentLocation(address);
            setDestination(address);

            // se guarda el usuario actual en el context
            const user = {
                uid: user_response.uid,
                name: user_response.name,
                email: user_response.email,
                wallet: user_response.wallet,
                jwt: idTokenResult.token,
            }
            setUser(user)

            console.log("Usuario se loggeo correctamente: ",user, " con rol ", role);
            setRole(user_response.roles[0])
            setLoggedIn(true)

        } catch (err) {
            console.log("Login: Error buscando el usuario");
            alert(err.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.small_container}>
                <Text style={styles.title}>Login</Text>
                <View style={styles.input_container}>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={email => setEmail(email)}
                        left={<TextInput.Icon icon="at" />}
                    />
                    <View styles={styles.password_container}>
                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={password => setPassword(password)}
                            secureTextEntry
                            left={<TextInput.Icon icon="lock-outline" />}
                        />
                        <TouchableRipple onPress={() => {sendPasswordReset(email)}}>
                            <Text style={styles.text}>Forgot password?</Text>
                        </TouchableRipple>
                    </View>
                </View>
                {/* pondria una screen solo con el activity indicator y chau */}
                {loading ? 
                <ActivityIndicator style={styles.activityIndicator} size="large" visible={loading} textContent={'Loading...'} />
                : <Text></Text>}
                <Button mode="contained" onPress={handleLogin}>
                    Login
                </Button>
                {/* <Text style={{alignSelf:'center'}}>or</Text> */}
                <Button mode="outlined" onPress={() => navigation.navigate('Onboarding')}>
                    Register here
                </Button>
            </View>
            
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    small_container: {
        flexDirection: 'column',
        height: '60%',
        width: '80%',
        justifyContent: 'space-evenly'
    },
    input_container: {
        flexDirection: 'column',
        height: '60%',
        width: '100%',
        justifyContent: 'space-evenly'
    },
    password_container: {
        flexDirection: 'column',
        height: '60%',
        width: '100%',
        justifyContent: 'space-evenly'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 30,
        color: '#20315f'
    },
    text: {
        margin:15,
        width:'50%',
        fontWeight: 'bold',
        fontSize: 12,
        color: '#20315f',
    },

    activityIndicator: {
        margin:15,
        width:'50%',
        fontWeight: 'bold',
        fontSize: 12,
        color: '#20315f',
        alignSelf:'center',
    },
   
})