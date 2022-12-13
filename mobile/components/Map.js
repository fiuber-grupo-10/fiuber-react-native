import React, {useContext, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, Text} from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { FiuberContext } from '../context/FiuberContext';
import MapViewDirections from 'react-native-maps-directions';

const Map = () => {
    const GOOGLE_API_KEY = 'AIzaSyCkRY5LLU7MR3J1XGHzJG9CXrvEypQpdJM'

    const {destination, showDirections, driverLocation, gotDriver, focusLocation, onGoing} = useContext(FiuberContext);

    const mapRef = useRef(MapView);

    return (
        <MapView 
            region={focusLocation}
            zoomEnabled={true}
            zoomTapEnabled={true}
            scrollDuringRotateOrZoomEnabled={true}
            ref={mapRef}
            style={styles.map}
            showsUserLocation={!onGoing}
        >
            {showDirections && 
            <Marker 
                coordinate={{latitude: destination.latitude, longitude: destination.longitude}}
            />

            }

            {/* onTrip y status AWAITING_DRIVER muestro el marker con un autito */}
            {gotDriver && 
                <Marker 
                    coordinate={{latitude: driverLocation.latitude, longitude: driverLocation.longitude}}
                    image={require('../assets/car.png')}     
                    style={{width: 10, height: 10}}
                    anchor={{x:0.5, y:0.5}}       
                />
                
            }


            {showDirections &&
                <MapViewDirections
                    origin={focusLocation}
                    destination={destination}
                    apikey={GOOGLE_API_KEY}
                    strokeWidth={3}
                    strokeColor="blue"
                />
            }

        </MapView>
        
    )
};

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
})

export default Map;