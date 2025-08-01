import { View } from "react-native";
import React from "react";
import { useSettingsStore } from "@/src/store/settingsStore";
import DropdownSelect from "react-native-input-select";
import { COLORS, FONTS, RECOMMENDATION_LIMITS } from "@/src/constants";
import { onImpact } from "@/src/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const RecommendationLimit = ({
  value,
  onChangeVale,
}: {
  value: number;
  onChangeVale: (value: number) => void;
}) => {
  const { settings } = useSettingsStore();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        gap: 10,
        paddingHorizontal: 20,
        marginBottom: 2,
      }}
    >
      <MaterialCommunityIcons
        name="car-speed-limiter"
        size={24}
        color="black"
      />
      <View style={{ flex: 1, marginBottom: -25 }}>
        <DropdownSelect
          placeholder="Recommendation Limit"
          options={RECOMMENDATION_LIMITS}
          optionLabel={"name"}
          optionValue={"value"}
          selectedValue={value}
          isMultiple={false}
          dropdownIconStyle={{ top: 15, right: 15 }}
          modalControls={{
            modalOptionsContainerStyle: {
              backgroundColor: COLORS.white,
            },
          }}
          dropdownStyle={{
            borderWidth: 0,
            paddingVertical: 8,
            paddingHorizontal: 20,
            minHeight: 40,
            backgroundColor: COLORS.gray100,
            flexDirection: "column-reverse",
          }}
          placeholderStyle={{
            color: COLORS.black,
            fontSize: 16,
            fontFamily: FONTS.regular,
          }}
          onValueChange={async (value: any) => {
            if (settings.haptics) await onImpact();
            onChangeVale(value);
          }}
          primaryColor={COLORS.secondary}
          dropdownHelperTextStyle={{
            display: "none",
          }}
          selectedItemStyle={{
            color: COLORS.black,
            fontSize: 14,
            fontFamily: FONTS.bold,
          }}
          listComponentStyles={{
            itemSeparatorStyle: { borderColor: COLORS.gray },
          }}
          checkboxControls={{
            checkboxLabelStyle: {
              fontFamily: FONTS.bold,
              color: COLORS.black,
              fontSize: 16,
            },
            checkboxStyle: {
              borderRadius: 999,
              borderColor: COLORS.transparent,
            },
          }}
        />
      </View>
    </View>
  );
};
export default RecommendationLimit;
