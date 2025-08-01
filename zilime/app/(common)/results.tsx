import { Text, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useHistoryStore } from "@/src/store/historyStore";
import ResultHeader from "@/src/components/Headers/ResultHeader";
import {
  COLORS,
  FONTS,
  PLOT_COLORS,
  relativeTimeObject,
} from "@/src/constants";
import Card from "@/src/components/Card/Card";
import tinycolor from "tinycolor2";
import Animated, { SlideInLeft, SlideInRight } from "react-native-reanimated";
import { BarChart, CurveType, PieChart } from "react-native-gifted-charts";
import LegendItem from "@/src/components/LegendItem/LegendItem";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import {
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Button from "@/src/components/Button/Button";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);
dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { history } = useHistoryStore();
  const hist = React.useMemo(
    () => history.find((h) => h.id === id)!,
    [history, id]
  );

  const barData = React.useMemo(() => {
    const raw = hist.predictions.predictions.map((pred, index) => ({
      crop: `${pred.crop} (${pred.label}) • ${(pred.probability * 100).toFixed(
        0
      )}%`,
      value: pred.probability * 100,
      frontColor: PLOT_COLORS[index],
      label: "",
    }));
    while (raw.length < 5) {
      raw.push({
        label: "",
        value: 0,
        frontColor: COLORS.white,
        crop: "",
      });
    }
    return raw.slice(0, 5);
  }, [hist]);

  const nutrientData = React.useMemo(() => {
    return [
      { value: hist.features.N, color: PLOT_COLORS[0], label: "Nitrogen (N)" },
      {
        value: hist.features.P,
        color: PLOT_COLORS[1],
        label: "Phosphorus (P)",
      },
      { value: hist.features.K, color: PLOT_COLORS[2], label: "Potassium (K)" },
    ];
  }, [hist]);
  return (
    <>
      <Stack.Screen options={{ header: () => <ResultHeader /> }} />
      <ScrollView
        bounces
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 300,
          padding: 10,
          gap: 5,
        }}
        style={{
          flex: 1,
          backgroundColor: COLORS.main,
        }}
      >
        <Animated.View entering={SlideInLeft.duration(200).delay(200)}>
          <Card
            style={[
              styles.card,
              {
                backgroundColor: hist.theme,
                marginTop: 10,
                overflow: "hidden",
              },
            ]}
          >
            <View style={[styles.badge, {}]}>
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  color: COLORS.white,
                }}
              >
                Which segment?
              </Text>
            </View>

            <View
              style={{
                backgroundColor: COLORS.secondary,
                position: "absolute",
                top: 0,
                right: 0,
                width: 80,
                padding: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  color: COLORS.white,
                }}
              >
                {dayjs(new Date(hist.date)).fromNow()} ago
              </Text>
            </View>
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 29,
                color: tinycolor(hist.theme).isLight()
                  ? COLORS.black
                  : COLORS.white,
              }}
            >
              {hist.segment}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.regular,
                fontSize: 14,
                color: tinycolor(hist.theme).isLight()
                  ? COLORS.black
                  : COLORS.white,
              }}
            >
              {hist.segmentDescription}
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInRight.duration(200).delay(200)}>
          <Card style={[styles.card, { marginTop: 30 }]}>
            <View style={[styles.badge, {}]}>
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  color: COLORS.white,
                }}
              >
                Idea Crop?
              </Text>
            </View>

            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 29,
              }}
            >
              Most Suitable Crop
            </Text>
            <Text
              style={{
                fontFamily: FONTS.regular,
                fontSize: 14,
                color: COLORS.gray,
              }}
            >
              {`Based on your field conditions, ${hist.predictions.top.crop} (${hist.predictions.top.label})is the best match for a healthy yield.`}
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInLeft.duration(200).delay(200)}>
          <Card style={[styles.card]}>
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 29,
              }}
            >
              Recommended Crops for Your Conditions
            </Text>
            <Text
              style={{
                fontFamily: FONTS.regular,
                fontSize: 14,
                color: COLORS.gray,
              }}
            >
              Based on your soil and climate data, here are the best crops to
              grow in your area. These suggestions are tailored to improve your
              yield and support sustainable farming.
            </Text>

            <View
              style={{
                paddingBottom: 30,
                marginTop: 20,
              }}
            >
              <BarChart
                barWidth={40}
                noOfSections={3}
                barBorderRadius={4}
                minHeight={5}
                frontColor={COLORS.gray200}
                data={barData}
                yAxisThickness={0}
                xAxisThickness={0}
                width={300}
                isAnimated
                animationDuration={300}
                gradientColor={COLORS.red}
                xAxisLabelTextStyle={{
                  fontFamily: FONTS.bold,
                  color: COLORS.black,
                }}
                yAxisTextStyle={{
                  fontFamily: FONTS.bold,
                  color: COLORS.black,
                }}
                yAxisLabelSuffix="%"
                showLine
                rotateLabel
                roundToDigits={1}
                lineConfig={{
                  curved: true,
                  color: COLORS.secondary,
                  curveType: CurveType.QUADRATIC,
                  isAnimated: true,
                  dataPointsColor: COLORS.red,
                  animationDuration: 300,
                  thickness: 2,
                }}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
              {barData
                .filter((i) => i.crop !== "")
                .map((data) => (
                  <LegendItem
                    label={data.crop}
                    key={data.crop}
                    color={data.frontColor}
                  />
                ))}
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInRight.duration(200).delay(200)}>
          <Card style={[styles.card]}>
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 29,
              }}
            >
              Segment and Environmental Factors Considered
            </Text>
            <Text
              style={{
                fontFamily: FONTS.regular,
                fontSize: 14,
                color: COLORS.gray,
              }}
            >
              {`Based on your field's nutrient levels, climate, and rainfall, ${hist.predictions.top.crop} (${hist.predictions.top.label}) is most suitable.`}
            </Text>

            <View style={{ flexDirection: "row", gap: 20, marginTop: 10 }}>
              <View style={{ flex: 1, gap: 5 }}>
                <MetricCard
                  Icon={
                    <FontAwesome6
                      name="temperature-three-quarters"
                      size={20}
                      color="black"
                    />
                  }
                  title="Temperature"
                  value={hist.features.temperature.toFixed(0).concat("℃")}
                  subtitle="temperature"
                />
                <MetricCard
                  Icon={
                    <MaterialCommunityIcons
                      name="air-humidifier"
                      size={20}
                      color="black"
                    />
                  }
                  title="Humidity"
                  value={hist.features.humidity.toFixed(0).concat("%")}
                  subtitle="humidity"
                />
                <MetricCard
                  Icon={
                    <FontAwesome5 name="cloud-rain" size={20} color="black" />
                  }
                  title="Rainfall"
                  value={hist.features.rainfall.toFixed(0).concat("mm")}
                  subtitle="rain"
                />
                <MetricCard
                  Icon={
                    <MaterialIcons name="opacity" size={20} color="black" />
                  }
                  title="Acidity (pH)"
                  value={hist.features.ph.toFixed(0)}
                  subtitle={
                    hist.features.ph === 7
                      ? "neutral"
                      : hist.features.ph < 7
                      ? "acidic"
                      : "alkaline"
                  }
                />
              </View>
              <View
                style={{
                  flex: 1,
                }}
              >
                <PieChart
                  donut
                  isAnimated
                  animationDuration={300}
                  innerRadius={40}
                  data={nutrientData}
                  radius={60}
                  centerLabelComponent={() => {
                    return (
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONTS.bold,
                          }}
                        >
                          N, P, K
                        </Text>
                      </View>
                    );
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 5,
                  }}
                >
                  {nutrientData.map((data) => (
                    <LegendItem
                      label={data.label}
                      key={data.label}
                      color={data.color}
                      dotStyle={{ width: 20, height: 20, borderRadius: 20 }}
                    />
                  ))}
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>

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
              Want a Recommendation for Another Segment?
            </Text>
            <Text
              style={{
                fontFamily: FONTS.regular,
                color: COLORS.gray,
              }}
            >
              Change your field or soil details to get a new crop suggestion
              tailored to different climatic conditions.
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
              marginVertical: 10,
            }}
            onPress={() => {
              if (router.canGoBack()) router.back();
              router.navigate({
                pathname: "/(common)/predict",
              });
            }}
          />
        </Card>
      </ScrollView>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  card: {
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
  },
  badge: {
    alignSelf: "center",
    position: "absolute",
    backgroundColor: COLORS.tertiary,
    borderRadius: 999,
    shadowOffset: { width: 2, height: 2 },
    elevation: 1,
    shadowColor: COLORS.tertiary,
    shadowOpacity: 0.35,
    shadowRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    top: -10,
    paddingHorizontal: 30,
  },
});

const MetricCard = ({
  style,
  title,
  Icon,
  value,
  subtitle,
}: {
  Icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  style?: ViewStyle;
}) => {
  return (
    <View
      style={[
        {
          alignItems: "center",
          padding: 5,
          borderRadius: 5,
          flexDirection: "row",
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
        {Icon}
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: FONTS.bold, fontSize: 16 }}>{title}</Text>
          <Text
            style={{
              color: COLORS.gray,
              fontFamily: FONTS.regular,
              fontSize: 12,
            }}
          >
            {subtitle}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 25,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};
