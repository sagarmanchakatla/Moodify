import { FaceEmotionSchema } from "@/schema/emotion";

const BASEURL = "https://face-api2.p.rapidapi.com/api/FaceOrchestrator";


export const detectEmotion = async (base64encodedimage:string):Promise<FaceEmotionSchema>=>{
    const response = await fetch(`${BASEURL}`,{
        method : "POST",
        body : JSON.stringify({
            source: base64encodedimage,
            sourceType: 'base64',
            detectGender: false,
            detectEmotion: true,
            detectEthnicity: false,
            detectLandmarks: false,
            detectAge: false
        }),
        headers : {
            'x-rapidapi-key' : '5d1697b208mshd28835166cf7e93p10a73fjsn9c8d425399f5',
            'x-rapidapi-host' : 'face-api2.p.rapidapi.com',
            'Content-Type' : 'application/json'   
        }
    });
    if(!response.ok){
        console.log(await response.json())
        throw Error("Can't detect the Emotion for now try again later");
    }
    return response.json();
}