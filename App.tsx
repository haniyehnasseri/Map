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
import {StyleSheet, View, PermissionsAndroid, Text, Image, Button, Alert, ScrollView, FlatList, TextInput, Pressable, TouchableOpacity} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Geolocation from 'react-native-geolocation-service';

const GOOGLE_PLACES_API_KEY = 'GOOGLE_API_KEY';



/*const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
  placeholder='Enter Location'
  minLength={2}
  autoFocus={false}
  returnKeyType={'default'}
  fetchDetails={true}
  query={{
    key:GOOGLE_PLACES_API_KEY,
    language: 'fa',
  }}
  styles={{
    textInputContainer: {
      backgroundColor: 'rgba(0,0,0,0)',
      borderTopWidth: 0,
      borderBottomWidth: 0,
    },
    textInput: {
      marginLeft: 0,
      marginRight: 0,
      height: 38,
      color: '#5d5d5d',
      fontSize: 16,
    },
    predefinedPlacesDescription: {
      color: '#1faadb',
    },
  }}
/>  
  );
};*/



const marker = require('./markers/marker.png')
const searchMarker = require('./markers/searchmarker2.png')
const gps = require('./markers/gps_2.png')





MapboxGL.setAccessToken(
  'MAPBOX_API_KEY',
);



const rasterSourceProps = {
  id: 'iranMap',
  tileUrlTemplates: ['TILE_SERVER_URL'],
  tileSize: 256,
  
  
};

const bounds = {
  sw: [2.310149073600769, 48.85784],
  ne: [2.335765, 48.869005749964536],
  paddingLeft: 10,
  paddingRight: 10,
  paddingTop: 100,
  paddingBottom: 100,
};










class App extends React.Component <{}>{



  state = {
    latitude: 35.802071,
    longitude: 51.490461,
    //needRender: false,
    searchResult : null,
    searchText: '',
    searchFocused: false,
    searchedLatitude : null,
    searchedLongitude: null,
    
  };


  private myRef = React.createRef<MapboxGL.MapView>()
  private cameraRef = React.createRef<MapboxGL.Camera>()
  private markerRef = React.createRef<MapboxGL.MarkerView>()
  private searchedmarkerRef = React.createRef<MapboxGL.MarkerView>()



  requestCameraPermission = async() => {

    try {

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "سیستم موقعیت یاب",
          message:
            "موقعیت مکانی شما غیر فعال است. آیا مایلید آن را فعال کنید؟",
          
          buttonNegative: "خیر",
          buttonPositive: "بله"
        }
        
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        
        Geolocation.getCurrentPosition(
          (position) => {
            const latitude = JSON.stringify(position.coords.latitude)
            const longitude = JSON.stringify(position.coords.longitude)
            //console.log("1")
            //const needRender = true
            this.setState({
              latitude : latitude,
              longitude : longitude,
              //needRender
            })
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 3000, maximumAge: 40000 }
      );
      } else {
        /*const latitude = 35.802071
        const longitude = 51.490461
        const needRender = true
        this.setState({
          latitude,
          longitude,
          needRender
        });*/
  
      }
    } catch (err) {
      console.warn(err);
    }
    //this.forceUpdate
    
  }

  
  async componentDidMount(){
    await this.requestCameraPermission()
  }


  



  render(){
    //console.log("2")
    //console.log(this.state.latitude)
    //console.log(this.state.longitude)
    //var searchBorderColor 
    return (
      
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView
          ref={this.myRef}
          style={styles.map} 
          rotateEnabled={false}
          zoomEnabled={true}
          focusable={true}
          pitchEnabled={true}
          onLongPress={(feautre)=>Alert.alert('مختصات : ' + '\n' +  String( feautre.geometry.coordinates))}
          //onLongPress = {(feautre)=> {this.setState({})}}
          onPress = {()=>this.setState({searchResult: []})}          
          >
            <MapboxGL.RasterSource {...rasterSourceProps} >
                  <MapboxGL.BackgroundLayer id="background"  sourceLayerID="iranMap" style={{ backgroundColor:"#f2efea"} } />
                  <MapboxGL.RasterLayer
                      id="iranMapLayer"
                      sourceLayerID="iranMap"
                      minZoomLevel= {0}
                      maxZoomLevel= {20}                  
                      style={{rasterOpacity: 1, rasterFadeDuration: 100}}
                        
                  />                  
            </MapboxGL.RasterSource>
  
            <MapboxGL.Camera ref={this.cameraRef} followUserLocation={false} zoomLevel={17} centerCoordinate={[Number(this.state.longitude),Number(this.state.latitude)]} animationMode={'flyTo'} animationDuration={1000}/>
            
            <MapboxGL.MarkerView
              ref={this.markerRef}
              coordinate={[Number(this.state.longitude),Number(this.state.latitude)]}
              id={"currentLocation"}
              snippet={"SHORT SNIPPET"}
            >
              <Image source={marker}/>
            </MapboxGL.MarkerView>

            {this.state.searchedLatitude && this.state.searchedLongitude &&
            <MapboxGL.MarkerView
              ref={this.searchedmarkerRef}
              coordinate={[Number(this.state.searchedLongitude),Number(this.state.searchedLatitude)]}
              id={"searchedLocation"}
              snippet={"SHORT SNIPPET"} 
            >
              <Image source={searchMarker}/>
            </MapboxGL.MarkerView>}

            
                        
          </MapboxGL.MapView>

          <View  style = {styles.button} onTouchStart={()=>this.requestCameraPermission().then(()=>this.cameraRef.current?.flyTo([this.state.longitude,this.state.latitude],1000))} >
              <Image source={gps} />
          </View>

          <View style={{position: "absolute", margin:"3%", top:0, justifyContent: 'center', width:"94%", overflow:"hidden", borderRadius:12, opacity:0.8}} >
            
            <TextInput placeholder="جست و جو"  selectionColor="black" placeholderTextColor="#666666" style={{ width:"100%", backgroundColor:"white", direction:"rtl", textAlign: "right", paddingRight:10, fontFamily: 'BHoma'}} 
                onChangeText={(text)=>{(text.length > 4) ? fetch("http://NOMINATIM_SERVER/nominatim/search.php?format=json&addressdetails=1&q={$" + String(text) + "}&format=json&limit=5")
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson)
                    this.setState({
                    searchResult : responseJson,              
                })
                }).then(()=>console.log(this.state.searchResult)) : console.log("short content")}} />

            <FlatList
              keyboardShouldPersistTaps='handled'
              style={{ marginTop: 0 }}
              data={this.state.searchResult} 
              renderItem={( {item} ) => (
                (item.address.city && (item.address.suburb || item.address.district)) ?
                (<TouchableOpacity onPress={()=>this.cameraRef.current?.flyTo([item.lon,item.lat],1000)} onPressOut={()=>this.setState({searchResult: [],searchedLatitude: item.lat, searchedLongitude: item.lon})} >
                  <View style={{padding: 4.5, borderBottomWidth: 0.25, borderBottomColor: 'rgba(0,0,0,0.2)', backgroundColor:'#F8F8FF' }}>
                  
                  <Text style={{fontSize:16, fontWeight:"bold", fontFamily: 'BHoma'}} >
                      {item.address.amenity || item.address.leisure || item.address.man_made || item.address.tourism || item.address.railway || item.address.road || item.address.neighbourhood || ''}
                  </Text>

                  <Text style={{fontFamily:'BHoma'}}>
                    {item.address.city + " ، " + (item.address.suburb || item.address.district) + (item.address.neighbourhood ? (" ، " + item.address.neighbourhood) : '')}
                  </Text>
                  </View>
                </TouchableOpacity>) : (<TouchableOpacity onPress={()=>this.cameraRef.current?.flyTo([item.lon,item.lat],1000)} onPressOut={()=>this.setState({searchResult: [],searchedLatitude: item.lat, searchedLongitude: item.lon})}>
                  <View style={{padding: 4.5, borderBottomWidth: 0.25, borderBottomColor: 'rgba(0,0,0,0.2)', backgroundColor:'#F8F8FF' }}>
                  <Text style={{fontFamily:'BHoma'}}>
                      {item.display_name}
                  </Text>
                  </View>
                </TouchableOpacity>)
              )}
              keyExtractor={(item,index)=>index.toString()}
            />
          </View>





        </View>
      </View>
    );

  }
  
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  map: {
    flex: 1,
    zIndex: -1,
  },
  button: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderWidth:0.2,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width:60,
    height:60,
    backgroundColor:'#fff',
    borderRadius:30,
    zIndex: 10,
    
  },

});



export default App;
