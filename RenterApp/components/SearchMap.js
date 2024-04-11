import { StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function SearchMap({navigation}) {
  const [permission, setPermission] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapViewRef = useRef(null);

  const onMarkerPress = () => {
    alert("You clicked on the marker!");
  };

  const requestPermissions = async () => {
    try {
      // request permission to access user's location
      const permissionsObject =
        await Location.requestForegroundPermissionsAsync();

      // get the current location if permission is granted
      if (permissionsObject.status === "granted") {
        setPermission(true);
        await getCurrentPosition();
      }
      else {
        setPermission(false);
        alert("Permission denied or not provided");
        navigation.navigate("Account");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentPosition = async () => {
    try {
      if (permission) {
        const currLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        // set the location state to the current location
        setLocation(currLocation);
        setLoading(false);

        // logging user curr location info
        console.log(currLocation);

        // animate the map to the current location
        // maybe change to animateCamera later
        mapViewRef?.current?.animateToRegion({
          latitude: currLocation.coords.latitude,
          longitude: currLocation.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      } else {
        alert("Permission denied or not provided");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(async () => {
    await requestPermissions();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <MapView
      ref={mapViewRef}
      style={styles.mapStyle}
      initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
      showsTraffic={true}
    >
      <Marker
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        onPress={onMarkerPress}
      ></Marker>
    </MapView>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    width: "100%",
    height: "100%",
  },
});
