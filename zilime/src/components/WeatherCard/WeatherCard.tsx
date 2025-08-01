import { View, Text } from "react-native";
import React from "react";
import Card from "../Card/Card";
import { gql, useQuery } from "urql";
import { useCurrentLocation } from "@/src/hooks";
import { TWeatherData } from "@/src/types";
import { COLORS, FONTS } from "@/src/constants";
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Animated, { ZoomInUp } from "react-native-reanimated";
import WeatherCardSkeleton from "./WeatherCardSkeleton";

const WeatherCard = () => {
  const loc = useCurrentLocation();
  const [{ fetching, data }, _refetchWeather] = useQuery<TWeatherData>({
    requestPolicy: "network-only",
    query: CurrentWeatherQuery,
    variables: {
      input: {
        ...loc,
      },
    },
  });

  if (fetching) return <WeatherCardSkeleton />;
  if (!!!data)
    return (
      <Card
        style={{
          backgroundColor: COLORS.white,
          width: "100%",
          maxWidth: 500,
          alignSelf: "center",
          shadowOffset: { width: 2, height: 2 },
          elevation: 1,
          shadowColor: COLORS.tertiary,
          shadowOpacity: 0.35,
          shadowRadius: 2,
          padding: 20,
          height: 250,
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <MaterialIcons name="portable-wifi-off" size={24} color={COLORS.gray} />
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 16,
            width: 200,
            textAlign: "center",
            color: COLORS.gray,
          }}
        >
          Ops! Failed to reach the weather server, make sure that you are
          connected to internet.
        </Text>
      </Card>
    );
  return (
    <Card
      style={{
        backgroundColor: COLORS.white,
        width: "100%",
        maxWidth: 500,
        alignSelf: "center",
        shadowOffset: { width: 2, height: 2 },
        elevation: 1,
        shadowColor: COLORS.tertiary,
        shadowOpacity: 0.35,
        shadowRadius: 2,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.bold,
          color: COLORS.tertiary,
        }}
      >
        {data.weather.weather.current.observation_time}
      </Text>
      <View
        style={{
          gap: 10,
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 25,
            }}
          >
            {data.weather.weather.location?.name},{" "}
            {data.weather.weather.location.region}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.regular,
              color: COLORS.gray,
            }}
          >
            {data.weather.weather.location.country} •{" "}
            {data.weather.weather.location.timezone_id}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <MaterialCommunityIcons
            name="coolant-temperature"
            size={24}
            color={COLORS.red}
          />
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: FONTS.bold, fontSize: 30 }}>
              {data.weather.weather.current.temperature}℃
            </Text>
            <Text
              style={{
                fontFamily: FONTS.regular,
                color: COLORS.gray,
              }}
            >
              Feels like {data.weather.weather.current.feelslike}℃
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 5 }}>
        <Animated.Image
          entering={ZoomInUp.duration(200).delay(200)}
          source={{ uri: data.weather.weather.current.weather_icons[0] }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 5,
          }}
        />
        <Text
          style={{
            fontFamily: FONTS.regular,
            marginTop: 3,
          }}
        >
          {data.weather.weather.current.weather_descriptions}
        </Text>
      </View>

      <View style={{ marginTop: 5, flexDirection: "row", gap: 10 }}>
        <View
          style={{
            minWidth: 80,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            backgroundColor: COLORS.secondary,
            padding: 10,
            flex: 1,
          }}
        >
          <Ionicons name="cloud" size={24} color={COLORS.white} />
          <Text
            style={{
              textAlign: "center",
              fontFamily: FONTS.regular,
              color: COLORS.white,
            }}
          >
            Cloud cover of {data.weather.weather.current.cloudcover}%
          </Text>
        </View>

        <View
          style={{
            minWidth: 80,
            flex: 1,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            backgroundColor: COLORS.tertiary,
            padding: 10,
          }}
        >
          <Entypo name="direction" size={24} color={COLORS.white} />
          <Text
            style={{
              textAlign: "center",
              fontFamily: FONTS.regular,
              color: COLORS.white,
            }}
          >
            Wind direction is {data.weather.weather.current.wind_dir}
          </Text>
        </View>

        <View
          style={{
            minWidth: 80,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            backgroundColor: COLORS.main,
            padding: 10,
          }}
        >
          <Ionicons name="speedometer" size={24} color="black" />
          <Text
            style={{
              textAlign: "center",
              fontFamily: FONTS.regular,
              color: COLORS.black,
            }}
          >
            Wind speed is {data.weather.weather.current.wind_speed}km/hr
          </Text>
        </View>

        <View
          style={{
            minWidth: 80,
            flex: 1,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            backgroundColor: COLORS.red,
            padding: 10,
          }}
        >
          <FontAwesome name="compress" size={24} color={COLORS.white} />
          <Text
            style={{
              textAlign: "center",
              fontFamily: FONTS.regular,
              color: COLORS.white,
            }}
          >
            Pressure {data.weather.weather.current.pressure}MB
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default WeatherCard;

const CurrentWeatherQuery = gql`
  fragment ErrorFragment on Error {
    field
    message
  }

  fragment CurrentWeatherFragment on Current {
    temperature
    weather_icons
    weather_descriptions
    wind_speed
    cloudcover
    wind_dir
    visibility
    feelslike
    pressure
    observation_time
  }

  fragment LocationFragment on Location {
    timezone_id
    country
    name
    region
  }

  query WeatherQuery($input: WeatherInput!) {
    weather(input: $input) {
      success
      error {
        ...ErrorFragment
      }
      weather {
        current {
          ...CurrentWeatherFragment
        }
        location {
          ...LocationFragment
        }
      }
    }
  }
`;
