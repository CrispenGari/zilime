import { View, Text } from "react-native";
import React from "react";
import Card from "../Card/Card";
import { COLORS } from "@/src/constants";

const RecentRecommendations = () => {
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
      <Text>RecentRecommendations</Text>
    </Card>
  );
};

export default RecentRecommendations;
