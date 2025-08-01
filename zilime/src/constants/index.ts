export const SERVER_BASE_URL = "http://10.20.56.93:3001";

export const COLORS = {
  main: "#E8FFD7",
  primary: "#93DA97",
  secondary: "#5E936C",
  tertiary: "#3E5F44",
  black: "#000000",
  white: "#ffffff",
  red: "#FB2576",
  gray: "#758694",
  transparent: "transparent",
  gray100: "#DDDDDD",
  gray200: "#7F8CAA",
};

export const PLOT_COLORS = [
  "#3E5F44",
  "#5E936C",
  "#93DA97",
  "#E8FFD7",
  "#FEFAE0",
];

export const AUDIOS = {
  thinking: require("@/assets/sounds/rain.mp3"),
};

export const Fonts = {
  "JosefinSans-Bold": require("@/assets/fonts/JosefinSans-Bold.ttf"),
  "JosefinSans-Regular": require("@/assets/fonts/JosefinSans-Regular.ttf"),
};
export const FONTS = {
  regular: "JosefinSans-Regular",
  bold: "JosefinSans-Bold",
};

export const STORAGE_NAME = {
  DAILY_TIP: "zilime:tip",
  SETTINGS: "zilime:settings",
  FORM: "zilime:form",
  HISTORY: "zilime:history",
  TIP_NOTIFICATION_FLAG_KEY: "zilime:notification",
};

export const APP_NAME = "Zilime";

export const relativeTimeObject = {
  future: "in %s",
  past: "%s",
  s: "now",
  m: "1m",
  mm: "%dm",
  h: "1h",
  hh: "%dh",
  d: "1d",
  dd: "%dd",
  M: "1M",
  MM: "%dM",
  y: "1y",
  yy: "%dy",
};

export const LANDING_MESSAGES = [
  {
    id: 1,
    image: require("@/assets/images/0.png"),
    title: "Welcome to Zilime!",
    message:
      "Smart farming starts here — Zilime helps you choose the best crop to plant based on your soil and climate. Let's grow with confidence.",
  },
  {
    id: 2,
    image: require("@/assets/images/1.png"),
    title: "Hello, future-ready farmer!",
    message:
      "Zilime is built for you — combining local knowledge with powerful AI to guide your planting decisions and boost your harvest.",
  },
  {
    id: 3,
    image: require("@/assets/images/2.png"),
    title: "Plant Smarter. Grow Stronger.",
    message:
      "With Zilime, every seed you plant is backed by data — so you farm efficiently, sustainably, and successfully. Let's farm the future together.",
  },
  {
    id: 4,
    image: require("@/assets/images/3.png"),
    title: "Climate-Smart Farming Starts Now",
    message:
      "Adapt to changing weather and make informed crop choices that protect your land and future. Zilime supports climate-resilient agriculture in your hands.",
  },
];

export const LANGUAGE_OPTIONS = [
  { id: 0, name: "English", value: "en" },
  { id: 1, name: "isiXhosa", value: "xh" },
  { id: 2, name: "isiZulu", value: "zu" },
  { id: 3, name: "Afrikaans", value: "af" },
  { id: 4, name: "Sesotho", value: "st" },
];

export const RECOMMENDATION_LIMITS = [
  { id: 0, name: "3 Crops", value: 3 },
  { id: 1, name: "4 Crops", value: 4 },
  { id: 2, name: "5 Crops", value: 5 },
];
