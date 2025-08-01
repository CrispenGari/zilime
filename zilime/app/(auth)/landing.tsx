import Button from "@/src/components/Button/Button";
import Footer from "@/src/components/Footer/Footer";
import { COLORS, FONTS, LANDING_MESSAGES } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

const { width } = Dimensions.get("window");
const Page = () => {
  const [isLastSlide, setIsLastSlide] = React.useState(false);
  const router = useRouter();
  const swiperRef = React.useRef<Swiper>(null);
  const { settings, update } = useSettingsStore();
  React.useEffect(() => {
    if (!settings.new) {
      router.replace({
        pathname: "/(tabs)/home",
      });
    }
  }, [settings]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.main }}>
      <TouchableOpacity
        onPress={async () => {
          if (settings.haptics) {
            await onImpact();
          }
          update({ ...settings, new: false });
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.bold,
            color: COLORS.tertiary,
            alignSelf: "flex-end",
            fontSize: 16,
            margin: 20,
          }}
        >
          Skip
        </Text>
      </TouchableOpacity>

      <View style={{ flex: 1, width }}>
        <Swiper
          ref={swiperRef}
          renderPagination={(index, _total, _context) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 20,
                  gap: 4,
                  maxWidth: 150,
                  alignSelf: "center",
                }}
              >
                {LANDING_MESSAGES.map((_, i) => (
                  <TouchableOpacity
                    hitSlop={5}
                    key={i}
                    onPress={() => {
                      const offset = i - index;
                      swiperRef.current?.scrollBy(offset, true);
                    }}
                    style={{
                      width: 40,
                      height: 5,
                      backgroundColor:
                        i === index ? COLORS.tertiary : COLORS.gray100,
                      borderRadius: 5,
                    }}
                  />
                ))}
              </View>
            );
          }}
          loop={false}
          removeClippedSubviews={false}
          scrollEnabled={true}
          horizontal={true}
          showsPagination={true}
          onIndexChanged={(index) => {
            setIsLastSlide(index + 1 === LANDING_MESSAGES.length);
          }}
        >
          {LANDING_MESSAGES.map((message) => (
            <View
              key={message.id}
              style={{
                width,
                justifyContent: "center",
                paddingHorizontal: 20,
                flex: 1,
              }}
            >
              <Image
                source={message.image}
                style={{ width: "100%", height: 300, resizeMode: "contain" }}
              />
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 24,
                }}
              >
                {message.title}
              </Text>
              <Text
                style={[
                  {
                    color: COLORS.black,
                    fontFamily: FONTS.regular,
                    fontSize: 18,
                  },
                ]}
              >
                {message.message}
              </Text>
            </View>
          ))}
        </Swiper>
      </View>

      <Button
        title={isLastSlide ? "Get Started" : "Next"}
        style={{ width: "100%", marginVertical: 20 }}
        onPress={() => {
          if (isLastSlide) {
            update({ ...settings, new: false });
          } else {
            swiperRef.current?.scrollBy(1);
          }
        }}
      />
      <Footer />
    </SafeAreaView>
  );
};

export default Page;
