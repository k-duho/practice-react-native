import * as Location from 'expo-location'
import { StatusBar } from 'expo-status-bar';
import { Fontisto } from '@expo/vector-icons'; 
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = ""
const weatherIcons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snowflake",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightnings"
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [weather, setWeather] = useState();
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} =  await Location.requestForegroundPermissionsAsync();
    setOk(granted);

    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({ accuracy: 5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false})
    setCity(location[0].city)

    response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    const json = await response.json()
    setWeather(json)
    console.log(weather.weather[0])
  }

  useEffect(() => {
    getWeather();
  }, [])
  return (
    <View style={styles.container}>
      { ok ? (
        <View style={styles.container}>
          <StatusBar style="light"></StatusBar>
          <View style={styles.city}>
            <Text style={styles.cityName}>{city}</Text>
          </View>
          <ScrollView
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator="false"
            contentContainerStyle={styles.weather}
          >
            {weather === undefined ? (
              <View style={{ ...styles.day, alignItems: "center"}}>
                <ActivityIndicator
                  color="white"
                  style={{ marginTop: 10 }}
                  size="large"/>
              </View>
            ) : (
              <View style={styles.day}>
                <View
                  style= {{ flexDirection: "row",
                            alignItems: "center",
                            width: "100%",
                            justifyContent: "space-between"
                          }}
                >
                  <Text style={styles.temperature}>
                    {parseFloat(weather.main.temp).toFixed(1)}
                  </Text>
                  <Fontisto style={{ marginTop: 50 }} name={weatherIcons[weather.weather[0].main]} size={70} color="white" />
                </View>
                <Text style={styles.description}>
                  {weather.weather[0].main}
                </Text>
                <Text style={styles.tinyText}>
                  {weather.weather[0].description}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      ) : (
        <View style={{ ...styles.container, justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.tinyText}>No Authorize</Text>
        </View>
      )}
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato"
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 45,
    fontWeight: "600",
    color: "white"
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "left",
    padding: 20
  },
  temperature: {
    marginTop: 60,
    fontSize: 120,
    fontWeight: "500",
    color: "white"
  },
  description: {
    marginTop: -10,
    fontSize: 40,
    color: "white"
  },
  tinyText: {
    marginTop: -10,
    fontSize: 30,
    color: "white",
  }
});
