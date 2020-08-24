/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */



import React, {useState} from 'react';
import {StyleSheet, View, PermissionsAndroid} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Mapbox from '@react-native-mapbox-gl/maps';




MapboxGL.setAccessToken(
  'pk.eyJ1IjoicmFzaGlkdGhlZGV2ZWxvcGVyIiwiYSI6ImNrYXBncGlwdjBjbG4yd3FqaXl2ams1NHQifQ.jvRoapH6Ae7QHb8Kx4z9FQ',
);

const rasterSourceProps = {
  id: 'iranMap',
  tileUrlTemplates: ['http://94.184.208.42/hot/{z}/{x}/{y}.png'],
  tileSize: 256,
  
  
};






const App = () => {
  const [coordinates] = useState([-73.99155, 40.73581]);
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView   
        style={styles.map} 
        rotateEnabled

      >


          <MapboxGL.RasterSource {...rasterSourceProps} >

                <MapboxGL.BackgroundLayer id="background"  sourceLayerID="iranMap" style={{ backgroundColor:"#f2efea"} } />
                <MapboxGL.RasterLayer
                    id="iranMapLayer"
                    sourceLayerID="iranMap"
                    minZoomLevel= {1}
                    maxZoomLevel= {19}
                    
                    style={{rasterOpacity: 1, rasterFadeDuration: 80}}
                    

                />

                

          </MapboxGL.RasterSource>

          

          <MapboxGL.Camera zoomLevel={3} centerCoordinate={coordinates} />
          <MapboxGL.PointAnnotation coordinate={coordinates} id="Test" />
          
          
          
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'blue',
  },
  map: {
    flex: 1,
    
  },
});



export default App;
