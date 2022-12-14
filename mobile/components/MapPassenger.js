import React, {useContext, useRef} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { FiuberContext } from '../context/FiuberContext';
import MapViewDirections from 'react-native-maps-directions';
import { ON_GOING, TRIP_FINISHED } from '../utils/vars';

const Map = () => {
    const GOOGLE_API_KEY = 'AIzaSyCkRY5LLU7MR3J1XGHzJG9CXrvEypQpdJM'

    const {destination, showDirections, driverLocation, gotDriver, focusLocation, driver, status, user} = useContext(FiuberContext);

    const mapRef = useRef(MapView);

    return (
        <MapView 
            region={focusLocation}
            zoomEnabled={true}
            zoomTapEnabled={true}
            scrollDuringRotateOrZoomEnabled={true}
            ref={mapRef}
            style={styles.map}
        >
            {showDirections && 
            <Marker 
                coordinate={{latitude: destination.latitude, longitude: destination.longitude}}
            />

            }

            {(status != ON_GOING) && 
                <Marker 
                    coordinate={{latitude: focusLocation.latitude, longitude: focusLocation.longitude}}
                    icon={{uri:'https://avatars.dicebear.com/api/big-smile/'+user.uid+'.png?size=100'}}   
                    style={{width: 2, height: 2}}
                    anchor={{x:0.5, y:0.5}}       
                />
                
            }

            {/* onTrip y status AWAITING_DRIVER muestro el marker con un autito */}
            {(gotDriver && status != TRIP_FINISHED)  && 
                <Marker 
                    coordinate={{latitude: driverLocation.latitude, longitude: driverLocation.longitude}}
                    icon={{uri:'https://avatars.dicebear.com/api/big-smile/'+driver.id+'.png?size=100'}}       
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