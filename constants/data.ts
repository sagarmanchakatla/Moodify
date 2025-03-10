import icons from "./icons"


export const registerFieldsAndIcons = [
    {
        icon: icons.user,
        placeholder: "First Name",
        name: "first_name"
    },
    {
        icon: icons.user,
        placeholder: "Last Name",
        name: "last_name"
    },
    {
        icon: icons.Messageicon,
        placeholder: "Email",
        name: "email"
    },
    {
        icon: icons.Lockicon,
        placeholder: "Password",
        name: "password"
    }
]

export const notifications = [
    {
        id: '1',
        name: 'Jone Dev',
        message: 'Hey, when are you free?',
        time: 'About 1 minute ago',
        avatar: icons.ellipse,
    },
    {
        id: '2',
        name: 'Jone Dev',
        message: 'Hey, when are you free?',
        time: 'About 1 minute ago',
        avatar: icons.ellipse,
    },
    {
        id: '3',
        name: 'Jone Dev',
        message: 'Hey, when are you free?',
        time: 'About 1 minute ago',
        avatar: icons.ellipse,
    },
    {
        id: '4',
        name: 'Jone Dev',
        message: 'Hey, when are you free?',
        time: 'About 1 minute ago',
        avatar: icons.ellipse,
    },
];

export const musics = [
    {
        id: '1',
        name: "Song Name",
        title: "New Song Release",
        artist: "Singer",
        avatar: icons.ellipse
    },
    {
        id: '2',
        name: "Song Name",
        title: "New Song Release",
        artist: "Singer",
        avatar: icons.ellipse
    }
]

export const recentPlayedSongs = [
    { id: '1', name: 'Song Name', time: 'About 3 minutes ago', avatar: icons.songPlacholderIcon },
    { id: '2', name: 'Song Name', time: 'About 10 minutes ago', avatar: icons.songPlacholderIcon },
];

export const AccountsSetting = [
    {
        id: "1", name: "Personal Data", primaryIcon: icons.iconProfileicon, secondaryIcon: icons.rightIcon
    },
    {
        id: "2", name: "Achievement", primaryIcon: icons.achievementsicon, secondaryIcon: icons.rightIcon
    },
    {
        id: "3", name: "Personal Data", primaryIcon: icons.activityHistoryicon, secondaryIcon: icons.rightIcon
    },
    {
        id: "4", name: "Screen Time", primaryIcon: icons.screenTimeicon, secondaryIcon: icons.rightIcon
    },
]

export const NavigationButton = [
    { icon: icons.home },
    { icon: icons.activity },
    { icon: icons.cameraIcon },
    { icon: icons.messageTwo },
    { icon: icons.user }
]
export const OtherSettings = [
    { title: "Contact Us", icon: "phone" },
    { title: "Privacy Policy", icon: "shield-lock" },
    { title: "Settings", icon: "cog" },
]

export const MenuLists = [
    { title: "Notification", path: "/notification", icon: icons.notificationMenuicon },
    { title: "History", path: "/recentlyPlayed", icon: icons.historyicon },
    { title: "Map", path: "/explore", icon: icons.exploreicon },
]
export const mumbaiLocations = [
    {
        lat: 18.9220,
        lng: 72.8347,
        name: "Gateway of India",
        username: "traveler_01",
        profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
        description: "A historic arch monument overlooking the Arabian Sea.",
    },
    {
        lat: 18.9398,
        lng: 72.8354,
        name: "Chhatrapati Shivaji Maharaj Terminus",
        username: "history_lover",
        profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
        description: "A UNESCO World Heritage railway station with Victorian-Gothic architecture.",
    },
    {
        lat: 18.9440,
        lng: 72.8207,
        name: "Marine Drive",
        username: "sunset_chaser",
        profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
        description: "A beautiful seaside promenade, perfect for evening walks and sunsets.",
    },
    {
        lat: 18.9067,
        lng: 72.8147,
        name: "Colaba Causeway",
        username: "shopaholic_mumbai",
        profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
        description: "A bustling street market known for trendy fashion and souvenirs.",
    },
    {
        lat: 18.9543,
        lng: 72.8160,
        name: "Girgaon Chowpatty Beach",
        username: "foodie_explorer",
        profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
        description: "A famous beach known for street food like pav bhaji and bhel puri.",
    }
];


export const env = {
    notifyId: process.env.EXPO_PUBLIC_NATIVE_NOTIFY_APP_ID!,
    notifyToken: process.env.EXPO_PUBLIC_NATIVE_NOTIFY_APP_TOKEN!,
    supabaseProjectUrl: process.env.EXPO_PUBLIC_SUPABASE_Project_URL!,
    supabaseAnonPublicAPIKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_PUBLIC_API_KEY!,
    faceApiKey : process.env.EXPO_PUBLIC_FACE_API_SECRET_KEY!,
    geminiKey : process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY!,
    musicApiKeyOne : process.env.EXPO_PUBLIC_GOOGLE_MUSIC_API_KEY_1!,
    musicApiKeyTwo : process.env.EXPO_PUBLIC_GOOGLE_MUSIC_API_KEY_2!
}