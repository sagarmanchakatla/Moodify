export const mapStyle = [
    {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'road',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
    },
];

export const socialTabTitle = {
    similar : "People with similar music taste",
    all : "All Music Fans",
    friends : "Friends List",
    invites : "Friend Requests"
}

export const generatePrompt = (favArtist: string, genres: string) => {
    return (
    `Given the following information about the user's favorite artists and preferred genres:
    - Favorite Artists: ${favArtist.split("-").join(", ")}
    - Preferred Genres: ${genres.split("-").join(", ")}

    Provide a short description of the user's music taste in the following format:
    "I enjoy [music taste description]". 

    Also, classify the user's music preferences into the following categories and provide the percentage for each:
    - Workout Music
    - Relaxation
    - Focus

    Return the output in the following JSON format:
        {
            "musicTaste": "I enjoy [music taste description]",
            "workoutMusic": ,
            "relaxation": ,
            "focus": 
        }`
    )
}