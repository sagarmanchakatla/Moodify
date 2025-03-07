export interface UserSchema {
    first_name: string;
    last_name: string;
    age: number;
    height : number,
    weight : number,
    date_of_birth: string | Date;
    gender: string;
    genre: string;
    id: string,
    avatar : string,
    fav_artist: string
}

export interface UserContextType {
    user: UserSchema | null;
    isAuthenticated: boolean,
    updateState: React.Dispatch<React.SetStateAction<UserContextType>>
}

export interface RecentlyPlayedListSchema {
    id: string;
    name: string;
    time: string;
    avatar: any;
}
export interface PictureType {
    uri: string,
    base64Image: string,
    height: number,
    weight: number
}