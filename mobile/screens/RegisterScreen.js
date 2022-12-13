/* eslint-disable no-unused-vars */
import  React, {useState, useContext, useCallback,useRef, useEffect} from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions, Keyboard, Platform} from 'react-native';
import { Text, TextInput, Button, ActivityIndicator} from 'react-native-paper';
import {registerUserWithEmailAndPassword} from '../firebase';
import { FiuberContext } from '../context/FiuberContext';
import { auth } from '../firebase';
import { createUser } from '../services/users';
import * as Location from 'expo-location';
import { getCurrentLocation } from '../services/location';
import { getSuggestions } from '../services/cars';
import { v4 as uuid } from 'uuid';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

const {width, height} = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function RegisterScreen({navigation}) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUserName] = useState('')
    const [wallet, setWallet] = useState('')
    const [loading, setLoading] = useState(false)
    const [keyboardOpen, setKeyboardOpen] = useState(false)
    const [confirmedPassword, setConfirmedPassword] = useState('')
    const [suggestionsList, setSuggestionsList] = useState(null)
    const [selectedItem, setSelectedItem] = useState(null)
    const [patent, setPatent] = useState('');

    
    const searchRef = useRef(null)
    const dropdownController = useRef(null)

    Keyboard.addListener(
        'keyboardDidShow',
        () => {
            setKeyboardOpen(true)
        }
    );
    Keyboard.addListener(
        'keyboardDidHide',
        () => {
            setKeyboardOpen(false)
        }
    );

    const {role, setUser, setCurrentLocation, setLoggedIn} = useContext(FiuberContext);

    const onOpenSuggestionsList = useCallback(isOpened => {}, [])
    const onClearPress = useCallback(() => {setSuggestionsList(null) }, [])

    async function getSuggestionsList(q){
        console.log("entro aca")
        const filterToken = q.toLowerCase()
        console.log('getSuggestions', q)
        const response = await getSuggestions(q.toLowerCase())
        
        console.log("items ", response)
        
        const suggestions = response.map(r => ({
            id: uuid(), 
            title: `${r.make} ${r.model} ${r.year}`
        }))
        
        setSuggestionsList(suggestions)
        console.log("suggestions ", [...new Set(suggestions)])
        console.log("la list", suggestionsList)
        }


    
    const handleRegister = async () => {
        setLoading(true);
        try {

            // se registra el usuario en firebase
            await registerUserWithEmailAndPassword(username, email, password, role);
            const user_uid = auth.currentUser.uid;
            const idTokenResult = await auth.currentUser.getIdTokenResult();
            
            // se crea el usuario en firestore
            if(role == 'passenger'){
                const user_response = await createUser(username, wallet, role, user_uid, idTokenResult.token);

                // se busca la current location del user
                const location = await getCurrentLocation();
                let { longitude, latitude } = location.coords;
                let regionName = await Location.reverseGeocodeAsync({
                    longitude,
                    latitude,
                });
                const street = (regionName[0].street)
                const streetNumber = regionName[0].streetNumber
                const city = regionName[0].city
                const description = `${street} ${streetNumber}, ${city}`
                const address = {
                    description: description,
                    longitude:location.coords.longitude,
                    latitude:location.coords.latitude,
                    longitudeDelta:  LONGITUDE_DELTA,
                    latitudeDelta:  LATITUDE_DELTA
                }
                setCurrentLocation(address);
                
                // se guarda el usuario en el context (su rol ya se guardo cuando eligio como registrarse)
                const user = {
                    uid: user_response.uid,
                    name: user_response.name,
                    email: user_response.email,
                    wallet: user_response.wallet,
                    password: password,
                    jwt: idTokenResult.token,
                }
                setUser(user)
            }else{
                const user_response = await createUser(username, wallet, role, user_uid, idTokenResult.token, selectedItem, patent);
                const user = {
                    uid: user_response.uid,
                    name: user_response.name,
                    email: user_response.email,
                    wallet: user_response.wallet,
                    password: password,
                    jwt: idTokenResult.token,
                    car_model: user_response.car_description.title,
                    car_patent: user_response.patent
                }
                setUser(user)

            }
            
            // se cambia el contexto
            setLoggedIn(true)
            setLoading(false)
            
        } catch (error) {
            console.log(error);
            alert(error.message);
            return;
        }
        
    }

    useEffect((q)=>{
        getSuggestionsList(q)
    },[])

    if(loading){

        return (
            <View style={styles.container}>
                <Text style={styles.title}>FIUBER</Text>
                <ActivityIndicator style={styles.activityIndicator} size="large" visible={true} textContent={'Loading...'} />
            </View>
        )
    } else {

        return (
            <SafeAreaView style={styles.container}>
                    <View style={keyboardOpen ? styles.small_container_with_keyboard : styles.small_container_without_keyboard}>
                        <Text style={styles.title}>Register</Text>
                        <View style={styles.input_container}>
                            <TextInput
                                label="Username"
                                value={username}
                                autoCapitalize='none'
                                onChangeText={username => setUserName(username)}
                                left={<TextInput.Icon icon="account" />}
                            />
                            <TextInput
                                label="Email"
                                value={email}
                                autoCapitalize='none'
                                onChangeText={email => setEmail(email)}
                                left={<TextInput.Icon icon="at" />}
                                />
                            <TextInput
                                label="Wallet"
                                value={wallet}
                                autoCapitalize='none'
                                onChangeText={wallet => setWallet(wallet)}
                                left={<TextInput.Icon icon="bitcoin" />}
                            />
                            {(role=='passenger') ? 
                                <></>
                            :
                            <View>
                            <TextInput
                                label="Patente"
                                value={patent}
                                autoCapitalize='none'
                                onChangeText={patent => setPatent(patent)}
                                left={<TextInput.Icon icon="car" />}
                            />
                            <AutocompleteDropdown
                                    ref={searchRef}
                                    controller={controller => {
                                        dropdownController.current = controller
                                      }}
                                    direction={Platform.select({ ios: 'down' })}
                                    onClear={onClearPress}
                                    // initialValue={'1'}
                                    
                                    dataSet={suggestionsList}
                                    onChangeText={getSuggestionsList}
                                    onSelectItem={item => {
                                        item && setSelectedItem(item)
                                      }}
                                    debounce={600}
                                    suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
                                    onOpenSuggestionsList={onOpenSuggestionsList}
                                    //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
                                    textInputProps={
                                        {placeholder: 'Type 3+ letters car model'}
                                        
                                       
                                    }
                            />
                            </View>
                            
                            }

                                
                            <TextInput
                                label="Password"
                                value={password}
                                autoCapitalize='none'
                                onChangeText={password => setPassword(password)}
                                secureTextEntry
                                left={<TextInput.Icon icon="lock-outline" />}
                                />
                            <TextInput
                                label="Confirm password"
                                autoCapitalize='none'
                                onChangeText={confirmed => setConfirmedPassword(confirmed)}
                                secureTextEntry
                                left={<TextInput.Icon icon="lock-outline" />}
                                />
                        </View>
                        {(password != confirmedPassword) ? (
                            <Text style={{color:'red'}}>
                                Passwords do not match
                            </Text>
                            ) :  
                            <Text></Text>
                        }
                        {loading ? <><Text style={styles.activityIndicator}>Loading...</Text><ActivityIndicator style={styles.activityIndicator} size="large" visible={loading} textContent={'Loading...'} /></>
                    : <Text></Text>}
                        <Button mode="outlined" disabled={(password != confirmedPassword)} onPress={handleRegister}>
                            Register
                        </Button>
                    </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    small_container_with_keyboard: {
        flexDirection: 'column',
        height: '90%',
        width: '80%',
        justifyContent: 'space-evenly',
    },
    small_container_without_keyboard: {
        flexDirection: 'column',
        height: '80%',
        width: '80%',
        justifyContent: 'space-evenly',
    },
    small_container: {
        flexDirection: 'column',
        height: '80%',
        width: '80%',
        justifyContent: 'space-evenly',
    },
    input_container: {
        flexDirection: 'column',
        height: '60%',
        width: '100%',
        justifyContent: 'space-evenly',
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