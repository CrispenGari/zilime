import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import PredictHeader from "@/src/components/Headers/PredictHeader";
import { AUDIOS, COLORS, FONTS } from "@/src/constants";
import Card from "@/src/components/Card/Card";
import uuid from "react-native-uuid";
import { ScrollView } from "react-native-gesture-handler";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import ThemePickerBottomSheet from "@/src/components/BottomSheets/ThemePickerBottomsheet";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { ColorFormatsObject } from "reanimated-color-picker";
import CreateInput from "@/src/components/CreateInput/CreateInput";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Button from "@/src/components/Button/Button";
import RecommendationLimit from "@/src/components/LanguageTranslationSettingComponent/RecommendationLimit";
import { gql, useMutation } from "urql";
import { TRecommendation } from "@/src/types";
import { useHistoryStore } from "@/src/store/historyStore";
import { useAudioPlayer } from "expo-audio";
const Page = () => {
  const themePickerBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const player = useAudioPlayer(AUDIOS.thinking);
  const { add } = useHistoryStore();
  const router = useRouter();
  const [{ fetching }, mutateRecommendCrop] = useMutation(RECOMMEND_CROP_QUERY);
  const { settings } = useSettingsStore();
  const [state, setState] = React.useState({
    theme: COLORS.tertiary,
    segment: "Bed A",
    segmentDescription: "This is a bed a",
    K: "11",
    N: "23",
    P: "32",
    error: "",
    temperature: "29.14305",
    humidity: "49.409833",
    ph: "6.831707",
    rainfall: "97.551555",
    limit: 3,
  });

  const makeRecommendations = async () => {
    setState((s) => ({ ...s, error: "" }));
    if (state.segment.trim().length === 0) {
      return setState((s) => ({
        ...s,
        error: "Segment name is required.",
      }));
    }

    if (state.N.trim().length === 0) {
      return setState((s) => ({
        ...s,
        error: "Nitrogen (N) value is required.",
      }));
    }

    if (state.P.trim().length === 0) {
      return setState((s) => ({
        ...s,
        error: "Phosphorus (P) value is required.",
      }));
    }

    if (state.K.trim().length === 0) {
      return setState((s) => ({
        ...s,
        error: "Potassium (K) value is required.",
      }));
    }

    if (state.temperature.trim().length === 0) {
      return setState((s) => ({
        ...s,
        error: "Temperature value is required.",
      }));
    }

    if (state.humidity.trim().length === 0) {
      return setState((s) => ({
        ...s,
        error: "Humidity value is required.",
      }));
    }

    if (state.ph.trim().length === 0) {
      return setState((s) => ({
        ...s,
        error: "pH value is required.",
      }));
    }

    if (state.rainfall.trim().length === 0) {
      return setState((s) => ({
        ...s,
        error: "Rainfall value is required.",
      }));
    }

    if (settings.sound) {
      player.play();
    }

    const features = {
      N: Number(state.N),
      P: Number(state.K),
      K: Number(state.K),
      temperature: Number(state.temperature),
      humidity: Number(state.humidity),
      ph: Number(state.ph),
      rainfall: Number(state.rainfall),
    };

    mutateRecommendCrop({
      input: {
        features,
        top: state.limit,
      },
    })
      .then(({ data }) => {
        const result = data as TRecommendation;
        if (result.recommendCrop.error) {
          setState((s) => ({
            ...s,
            error: result.recommendCrop.error.message,
          }));
        } else {
          const hist = {
            id: uuid.v4(),
            date: new Date(),
            predictions: result.recommendCrop.predictions,
            segment: state.segment,
            theme: state.theme,
            segmentDescription: state.segmentDescription,
            features,
          };
          add(hist);
          router.navigate({
            pathname: "/(common)/results",
            params: {
              id: hist.id,
            },
          });
        }
      })
      .finally(() => {
        if (settings.sound) {
          player.pause();
          player.remove();
        }
      });
  };

  const onSelectColor = ({ hex }: ColorFormatsObject) => {
    "worklet";
    setState((s) => ({ ...s, theme: hex }));
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <PredictHeader />,
        }}
      />
      <ThemePickerBottomSheet
        value={state.theme}
        onComplete={onSelectColor}
        ref={themePickerBottomSheetRef}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: COLORS.main,
        }}
        contentContainerStyle={{
          padding: 10,
          paddingBottom: 400,
          gap: 5,
        }}
      >
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
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View
              style={{
                flex: 1,
              }}
            >
              <Text style={{ fontFamily: FONTS.bold, fontSize: 25 }}>
                Segment Details
              </Text>
              <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
                These details will help you identify the segment from your
                history offline.
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: 50,
                height: 30,
                borderRadius: 30,
                backgroundColor: state.theme,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                themePickerBottomSheetRef.current?.present();
              }}
            />
          </View>

          <CreateInput
            label=""
            placeholder="Segment Name"
            Icon={<MaterialIcons name="segment" size={24} color="black" />}
            value={state.segment}
            onChangeText={(text) => setState((s) => ({ ...s, segment: text }))}
            containerStyle={{ flex: 1 }}
          />
          <CreateInput
            label=""
            placeholder="Segment Description"
            Icon={<MaterialIcons name="segment" size={24} color="black" />}
            value={state.segmentDescription}
            onChangeText={(text) =>
              setState((s) => ({ ...s, segmentDescription: text }))
            }
            containerStyle={{ flex: 1 }}
            multiline
            inputStyle={{ maxHeight: 50 }}
          />
        </Card>

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
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View
              style={{
                flex: 1,
              }}
            >
              <Text style={{ fontFamily: FONTS.bold, fontSize: 25 }}>
                Soil Acidity and Nutrition
              </Text>
              <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
                Fill in the values of soil nutritional content of the segment.
              </Text>
            </View>
          </View>

          <View style={[styles.row]}>
            <CreateInput
              label=""
              placeholder="Potassium"
              Icon={<MaterialIcons name="grain" size={24} color="black" />}
              value={state.K}
              onChangeText={(text) => setState((s) => ({ ...s, K: text }))}
              containerStyle={{ flex: 1 }}
              keyboardType="decimal-pad"
            />
            <CreateInput
              label=""
              placeholder="Phosphorous"
              Icon={<MaterialIcons name="grain" size={24} color="black" />}
              value={state.P}
              onChangeText={(text) => setState((s) => ({ ...s, P: text }))}
              containerStyle={{ flex: 1 }}
              keyboardType="decimal-pad"
              inputStyle={{ maxHeight: 50 }}
            />
          </View>

          <View style={styles.row}>
            <CreateInput
              label=""
              placeholder="Nitrogen"
              Icon={<MaterialIcons name="grain" size={24} color="black" />}
              value={state.N}
              onChangeText={(text) => setState((s) => ({ ...s, N: text }))}
              containerStyle={{ flex: 1 }}
              keyboardType="decimal-pad"
              inputStyle={{ maxHeight: 50 }}
            />
            <CreateInput
              label=""
              placeholder="PH"
              Icon={
                <MaterialCommunityIcons
                  name="circle-opacity"
                  size={24}
                  color="black"
                />
              }
              value={state.ph}
              onChangeText={(text) => setState((s) => ({ ...s, ph: text }))}
              containerStyle={{ flex: 1 }}
              keyboardType="decimal-pad"
              inputStyle={{ maxHeight: 50 }}
            />
          </View>
        </Card>

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
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View
              style={{
                flex: 1,
              }}
            >
              <Text style={{ fontFamily: FONTS.bold, fontSize: 25 }}>
                Weather Conditions
              </Text>
              <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
                Fill in the weather conditions in the segment.
              </Text>
            </View>
          </View>

          <View style={[styles.row]}>
            <CreateInput
              label=""
              placeholder="Rainfall"
              Icon={
                <MaterialCommunityIcons
                  name="weather-rainy"
                  size={24}
                  color="black"
                />
              }
              value={state.rainfall}
              onChangeText={(text) =>
                setState((s) => ({ ...s, rainfall: text }))
              }
              containerStyle={{ flex: 1 }}
              keyboardType="decimal-pad"
            />
            <CreateInput
              label=""
              placeholder="Humidity"
              Icon={
                <MaterialCommunityIcons
                  name="air-humidifier"
                  size={24}
                  color="black"
                />
              }
              value={state.humidity}
              onChangeText={(text) =>
                setState((s) => ({ ...s, humidity: text }))
              }
              containerStyle={{ flex: 1 }}
              keyboardType="decimal-pad"
              inputStyle={{ maxHeight: 50 }}
            />
          </View>

          <View style={styles.row}>
            <CreateInput
              label=""
              placeholder="Temperature"
              Icon={
                <MaterialIcons
                  name="device-thermostat"
                  size={24}
                  color="black"
                />
              }
              value={state.temperature}
              onChangeText={(text) =>
                setState((s) => ({ ...s, temperature: text }))
              }
              containerStyle={{ flex: 1 }}
              keyboardType="decimal-pad"
              inputStyle={{ maxHeight: 50 }}
            />
          </View>
        </Card>

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
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View
              style={{
                flex: 1,
              }}
            >
              <Text style={{ fontFamily: FONTS.bold, fontSize: 25 }}>
                Then, What Crop Should I Grow?
              </Text>
              <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
                Let AI decide for you.
              </Text>
            </View>
          </View>

          <RecommendationLimit
            value={state.limit}
            onChangeVale={(value) => setState((s) => ({ ...s, limit: value }))}
          />
          <Text
            style={{
              fontFamily: FONTS.regular,
              color: COLORS.red,
              fontSize: 16,
            }}
          >
            {state.error}
          </Text>
          <Button
            onPress={makeRecommendations}
            loading={fetching}
            disabled={fetching}
            Icon={
              <MaterialCommunityIcons
                name="brain"
                size={24}
                color={COLORS.white}
              />
            }
            title="Which Crop Is Best for Me?"
            style={{
              width: "100%",
              backgroundColor: COLORS.tertiary,
              marginVertical: 20,
            }}
          />
        </Card>
      </ScrollView>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
  },
});

const RECOMMEND_CROP_QUERY = gql`
  fragment ErrorFragment on Error {
    field
    message
  }

  fragment PredictionFragment on Prediction {
    crop
    label
    probability
  }

  mutation RecommendCrop($input: RecommendCropInput!) {
    recommendCrop(input: $input) {
      error {
        ...ErrorFragment
      }
      success
      predictions {
        predictions {
          ...PredictionFragment
        }
        top {
          ...PredictionFragment
        }
      }
    }
  }
`;
