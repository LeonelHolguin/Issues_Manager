import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function VisitMap({ route }) {
  const visitCoordinates = route.params.visitCoordinates;
  const defaultVisitCoordinate = visitCoordinates[0].coordinate;

  console.log(defaultVisitCoordinate);
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: defaultVisitCoordinate.latitude,
          longitude: defaultVisitCoordinate.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {visitCoordinates.map((visit) => (
          <Marker
            key={visit.id}
            coordinate={visit.coordinate}
            title={visit.title}
            description={visit.description}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
