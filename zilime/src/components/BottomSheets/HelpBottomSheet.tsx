import { APP_NAME, COLORS, FONTS, LANGUAGE_OPTIONS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { translateText } from "@/src/utils/react-query";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const initialText =
  "Zilime is a locally focused mobile application designed to help farmers make informed decisions about what crops to grow. Using location-based technology, the app analyzes environmental conditions such as soil nutrients, temperature, humidity, and rainfall to recommend the most suitable crops for a specific area. Zilime a smart, data-driven tool that empowers local agriculture and supports sustainable farming practices.";
const HelpBottomSheet = React.forwardRef<BottomSheetModal, {}>(({}, ref) => {
  const snapPoints = React.useMemo(() => ["50%"], []);
  const { dismiss } = useBottomSheetModal();
  const { settings } = useSettingsStore();
  const language = React.useMemo(
    () => LANGUAGE_OPTIONS.find((l) => l.value === settings.lang)!,
    [settings]
  );

  const { mutateAsync, isPending, data } = useMutation({
    mutationKey: ["translate-text"],
    mutationFn: translateText,
    networkMode: "offlineFirst",
  });

  const [text, setText] = React.useState(initialText);
  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose={false}
      enableOverDrag={false}
      handleComponent={null}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
    >
      <BottomSheetView
        style={{
          flex: 1,
          padding: 10,
          paddingBottom: 100,
        }}
      >
        <View
          style={{
            alignSelf: "flex-end",
            paddingHorizontal: 20,
            paddingTop: 10,
          }}
        >
          <TouchableOpacity
            style={{
              width: 30,
              height: 30,
              backgroundColor: COLORS.main,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 30,
            }}
            hitSlop={20}
            onPress={async () => {
              if (settings.haptics) {
                await onImpact();
              }
              dismiss();
              setText(initialText);
            }}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: FONTS.bold,
              marginBottom: 10,
            }}
          >
            How does Zimile works?
          </Text>
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 18,
            }}
          >
            {text}
          </Text>

          <View>
            <TouchableOpacity
              disabled={isPending}
              style={{
                flexDirection: "row",
                gap: 5,
                marginTop: 30,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                mutateAsync({ text: text, to: settings.lang }).then((data) => {
                  if (data.success) {
                    setText(data.translation!);
                  }
                  if (!!data.error) {
                    Alert.alert(
                      APP_NAME,
                      data.error,
                      [
                        {
                          style: "default",
                          text: "OK",
                          onPress: async () => {
                            if (settings.haptics) {
                              await onImpact();
                            }
                          },
                        },
                      ],
                      { cancelable: false }
                    );
                  }
                });
              }}
            >
              {isPending ? (
                <ActivityIndicator size={"small"} color={COLORS.secondary} />
              ) : null}
              <MaterialIcons
                name="translate"
                size={24}
                color={COLORS.secondary}
              />
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 18,
                  color: COLORS.secondary,
                }}
              >
                Translate to {language.name}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: FONTS.regular,
                color: COLORS.gray,
              }}
            >
              You can change the default translation language in the settings.
            </Text>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default HelpBottomSheet;
