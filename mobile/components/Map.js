import React, {useContext, useEffect, useRef, useState} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import MapView, { Marker} from 'react-native-maps';
import { FiuberContext } from '../context/FiuberContext';
import DefaultDestination from './DefaultDestination';

// const {width, height} = Dimensions.get("window");

// const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.02;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Map = () => {
   
    const {currentDestination} = useContext(FiuberContext);
    const mapRef = useRef(MapView);
    const [region, setRegion] = useState({
        latitude: currentDestination.latitude,
        longitude: currentDestination.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
    })

   
   /*  const moveTo = async (currentDestination) => {
        console.log("current destination ", currentDestination)
        const camera = await mapRef.current?.getCamera();
        
        console.log("camera",camera)
        console.log("current destination ", currentDestination)
        if (camera) {
            console.log("Moving to ", camera.center);
           
            camera.center = {
                latitude: currentDestination.latitude,
                longitude: currentDestination.longitude,
                latitudeDelta: 0.09,
                longitudeDelta:0.04,
                
            
            }
            camera.zoomEnabled=true
            console.log("Moving to ", camera.center);
            mapRef.current?.animateCamera(camera, {duration: 3000});
        
        } 
  
        return;
    } */

    useEffect(() => {

       // moveTo(currentDestination);
  
      
        
    }, []);

    return (
        <MapView 
            region={region}
            zoomEnabled={true}
            zoomTapEnabled={true}
            scrollDuringRotateOrZoomEnabled={true}
            ref={mapRef}
            style={styles.map}
            showsUserLocation={true}
            onRegionChangeComplete={region => setRegion(region)}
  
        >
            <Marker coordinate={{latitude: currentDestination.latitude, longitude: currentDestination.longitude}} />
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