import { ScrollView, Text, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "@/src/constants";
import WeatherCard from "@/src/components/WeatherCard/WeatherCard";
import Card from "@/src/components/Card/Card";
import Button from "@/src/components/Button/Button";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DailyTip from "@/src/components/DailyTip/DailyTip";
const Home = () => {
  const router = useRouter();
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: COLORS.main,
      }}
      contentContainerStyle={{
        paddingBottom: 300,
        padding: 10,
        gap: 10,
      }}
      showsVerticalScrollIndicator={false}
      bounces
    >
      <WeatherCard />
      <DailyTip />
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
          gap: 20,
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 25,
            }}
          >
            Find the Right Crop
          </Text>
          <Text
            style={{
              fontFamily: FONTS.regular,
              color: COLORS.gray,
            }}
          >
            Tell us about your soil and weather conditions. We'll help you
            choose the most suitable crop to grow.
          </Text>
        </View>
        <Button
          title="What Should I Plant?"
          Icon={
            <FontAwesome6 name="plant-wilt" size={24} color={COLORS.white} />
          }
          style={{
            width: "100%",
            backgroundColor: COLORS.tertiary,
            marginVertical: 25,
          }}
          onPress={() => {
            router.navigate({
              pathname: "/(common)/predict",
            });
          }}
        />
      </Card>
    </ScrollView>
  );
};

export default Home;
