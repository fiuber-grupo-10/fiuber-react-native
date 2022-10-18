/* eslint-disable no-unused-vars */
import  React, {useState, useContext, useEffect} from 'react';
import { StyleSheet, View, SafeAreaView} from 'react-native';
import { Text, TextInput, Button} from 'react-native-paper';
import {registerUserWithEmailAndPassword} from '../firebase';
import { FiuberContext } from '../context/FiuberContext';
import { auth } from '../firebase';
import { createUser } from '../services/users';
import { getDefaultDestination } from '../services/trips';


export default function RegisterScreen({navigation}) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUserName] = useState('')
    const [wallet, setWallet] = useState('')
    const [loading, setLoading] = useState(false);
    const [confirmedPassword, setConfirmedPassword] = useState('')

    const {role, setUser, setHasDefaultDestination, setCurrentDestination, setLoggedIn} = useContext(FiuberContext);

    const handleRegister = async () => {
        setLoading(true);
        try {
            await registerUserWithEmailAndPassword(username, email, password, role);
            const user_uid = auth.currentUser.uid;
            const idTokenResult = await auth.currentUser.getIdTokenResult();
            
            console.log("Usuario creado en firebase con rol ", role, " y mail ", email);
            const user_response = await createUser(username, wallet, role, user_uid, idTokenResult.token);
            console.log("Usuario creado en base de datos con info ", user_response);
            if (role == 'passenger'){
                const destination = await getDefaultDestination(idTokenResult.token);
                console.log(destination);
                if (destination == ''){
                    setHasDefaultDestination(false);
                    console.log("Usuario no tiene default destination");
                } else {
                    setHasDefaultDestination(true);
                    const default_destination = {
                        description:destination.address,
                        longitude:destination.longitude,
                        latitude:destination.latitude
                    }
                    setCurrentDestination(default_destination);
                }
            }
            const user = {
                uid: user_response.uid,
                name: user_response.name,
                email: user_response.email,
                wallet: user_response.wallet,
                password: password,
                jwt: idTokenResult.token,
            }
            setUser(user)
            setHasDefaultDestination(false);
            setLoggedIn(true);
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
        
    }

    return (
        <SafeAreaView style={styles.container}>
                <View style={styles.small_container}>
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
                    {loading ? <Text style={styles.text}>Loading...</Text> : <Text></Text>}
                    <Button mode="outlined" disabled={(password != confirmedPassword)} onPress={handleRegister}>
                        Register
                    </Button>
                </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
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
})