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
    { title: "Notification", path:"/notification" },
    { title: "History", path:"/recentlyPlayed" },
]