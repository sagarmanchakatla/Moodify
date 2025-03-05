export interface FaceEmotionSchema {
    faces: Face[];
}

export interface Face {
    age: number;
    bottom: number;
    emotion: Emotion;
    ethnicity: Ethnicity;
    gender: Gender;
    landmarks: string[];
    left: number;
    right: number;
    top: number;
}

export interface Emotion {
    angry: number;
    disgusted: number;
    fearful: number;
    happy: number;
    neutral: number;
    sad: number;
    surprised: number;
}

export interface Ethnicity {
    Asian: number;
    Black: number;
    Indian: number;
    Other: number;
    White: number;
}

export interface Gender {
    Female: number;
    Male: number;
}
