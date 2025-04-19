import { FaceEmotionSchema } from "@/schema/emotion";

const BASEURL = "https://api.edenai.run/v2/image/face_detection";

export const detectFace = async (
  fileUrl: string
): Promise<FaceEmotionSchema> => {
  const response = await fetch(`${BASEURL}`, {
    method: "POST",
    body: JSON.stringify({
      providers: "amazon",
      file_url: fileUrl,
    }),
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYzc5ZmQzZTYtMDRiZC00Y2U3LWE1OTUtZTAwYmQ3NzZiZmEwIiwidHlwZSI6ImFwaV90b2tlbiJ9._p0UGIUTQ9jzMqzovqE1Zt2r75JD1E8wbifI94psXes",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(await response.json());
    throw Error("Face detection failed. Please try again later.");
  }

  return response.json();
};

// import { DeepFace } from 'deepface';

// interface EmotionResponse {
//   dominant_emotion: string;
//   emotion: {
//     angry: number;
//     disgust: number;
//     fear: number;
//     happy: number;
//     sad: number;
//     surprise: number;
//     neutral: number;
//   };
// }

// export const analyzeMood = async (imageBase64: string): Promise<EmotionResponse> => {
//   try {
//     // Convert base64 to image format that DeepFace can process
//     const img = Buffer.from(imageBase64, 'base64');

//     // Analyze emotions using DeepFace
//     const result = await DeepFace.analyze(img, {
//       actions: ['emotion']
//     });

//     // Extract the first face's emotion data (assuming single face)
//     const emotionData = result[0];

//     return {
//       dominant_emotion: emotionData.dominant_emotion,
//       emotion: emotionData.emotion
//     };
//   } catch (error) {
//     console.error('Error analyzing mood:', error);
//     throw new Error('Failed to analyze mood');
//   }
// };
