import * as Location from "expo-location";
import { StatusBar } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Fontisto } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";

const icons = {
  Rain: "rain",
  Clouds: "cloudy",
  Clear: "day-sunny",
  Snow: "snowflake",
  Drizzle: "rain",
  Thunderstorm: "lightning",
  Atmosphere: "cloudy",
};

const { width: screenWidth } = Dimensions.get("window");

export default function App() {
  const [region, setRegion] = useState("Loading..");
  const [street, setStreet] = useState("");
  const [days, setDays] = useState([]);
  // const [ok, setOk] = useState(true);

  const API_KEY = "c881a2bcaa04335d39c2332fd7b0c016";

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setRegion(location[0].region);
    setStreet(location[0].street);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
    // console.log(days.map((day) => day));
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.city}>
        <Text style={styles.cityName}>{region}</Text>
      </View>
      <View>
        <Text style={{ color: "white" }}>{street}</Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginTop: 40 }}
            />
          </View>
        ) : (
          days.map((day, index) => {
            return (
              <View key={index} style={styles.day}>
                <Text>{new Date(day.dt * 1000).getDate()}일</Text>
                <Text style={{ color: "white" }}>
                  최저기온 {parseInt(day.temp.min)}
                </Text>
                <Text style={{ color: "white" }}>
                  최고기온 {parseInt(day.temp.max)}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.temp}>{parseInt(day.temp.day)}</Text>
                  <Fontisto
                    name={icons[day.weather[0].main]}
                    size={88}
                    color="white"
                  />
                </View>
                <Text style={styles.description}>{day.weather[0].main}</Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    color: "white",
    flex: 1,
    backgroundColor: "black",
  },
  city: {
    color: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "white",
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {
    // backgroundColor: "blue",
  },

  day: {
    width: screenWidth,
    alignItems: "center",
  },
  temp: {
    color: "white",
    marginTop: 50,
    fontSize: 178,
  },
  description: {
    color: "white",
    marginTop: -30,
    fontSize: 60,
  },
});
