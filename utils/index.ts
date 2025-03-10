import { NotificationSchema } from "@/schema";

export const filterNotifications = (notifications: NotificationSchema[]) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const formatDate = (dateStr: string): Date => {
        const [month,day, year, time] = dateStr.split(/[-\s]/);
        return new Date(+year,+month-1,+day);
    };


    const isSameDay = (d1: Date, d2: Date): boolean => {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    };

    const todayNotifications = notifications.filter((n) =>
        isSameDay(formatDate(n.date), today)
    );

    const yesterdayNotifications = notifications.filter((n) =>
        isSameDay(formatDate(n.date), yesterday)
    );

    const olderNotifications = notifications.filter(
        (n) =>
            !isSameDay(formatDate(n.date), today) &&
            !isSameDay(formatDate(n.date), yesterday)
    );
    return {
        today: todayNotifications,
        yesterday: yesterdayNotifications,
        older: olderNotifications,
    };
};


export const calculateSimilarityScore = (userGenres: string,userArtists: string,otherGenres: string,otherArtists: string): number => {
    let score = 0;
    const totalWeight = 1;
    const genreWeight = 0.6;
    const artistWeight = 0.4;

    // Split the genre and artist strings into arrays
    const userGenreArr = userGenres.split("-");
    const userArtistArr = userArtists.split("-");
    const otherGenreArr = otherGenres.split("-");
    const otherArtistArr = otherArtists.split("-");

    // Calculate genre similarity (percentage of matching genres)
    const matchingGenres = userGenreArr.filter((genre) =>
      otherGenreArr.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    const genreSimilarity =
      matchingGenres.length /
      Math.max(userGenreArr.length, otherGenreArr.length);

    // Calculate artist similarity (percentage of matching artists)
    const matchingArtists = userArtistArr.filter((artist) =>
      otherArtistArr.some((a) => a.toLowerCase() === artist.toLowerCase())
    );
    const artistSimilarity =
      matchingArtists.length /
      Math.max(userArtistArr.length, otherArtistArr.length);

    // Weighted score
    score = genreSimilarity * genreWeight + artistSimilarity * artistWeight;

    // Normalize to a 0-1 score
    return parseFloat(score.toFixed(2));
  };