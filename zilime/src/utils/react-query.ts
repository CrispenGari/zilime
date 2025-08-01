import { SERVER_BASE_URL } from "../constants";
import { TLanguage } from "../types";

export const translateText = async ({
  text,
  to,
}: {
  text: string;
  to: TLanguage;
}) => {
  const url = `${SERVER_BASE_URL}/api/v1/translate`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, to }),
  });
  const data = (await res.json()) as {
    success: boolean;
    translation?: string;
    error?: string;
  };
  return data;
};
