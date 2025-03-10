import { FaceEmotionSchema } from "@/schema/emotion";
import { env } from "@/constants/data";

const BASEURL = "https://face-api2.p.rapidapi.com/api/FaceOrchestrator";

export const detectEmotion = async (
  base64encodedimage: string
): Promise<FaceEmotionSchema> => {
  const response = await fetch(`${BASEURL}`, {
    method: "POST",
    body: JSON.stringify({
      source: base64encodedimage,
      sourceType: "base64",
      detectGender: false,
      detectEmotion: true,
      detectEthnicity: false,
      detectLandmarks: false,
      detectAge: false,
    }),
    headers: {
      "x-rapidapi-key": env.faceApiKey,
      "x-rapidapi-host": "face-api2.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    console.log(await response.json());
    throw Error("Can't detect the Emotion for now try again later");
  }
  //   console.log(response.json());
  return response.json();
};
