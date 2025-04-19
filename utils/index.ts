export const calculateSimilarityScoreHelper = (userGenres: string, userArtists: string, otherGenres: string, otherArtists: string): number => {
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


export const calculateSimilarityScore = (userGenres: string, userArtists: string,otherUsers:{
  first_name: string;
  last_name: string;
  fav_artist: string;
  genre: string;
  avatar: string;
  id: string,
  pushToken: string,
}[])=>{
  const results = otherUsers.map(other=>{
    const similarScore = (calculateSimilarityScoreHelper(userGenres,userArtists,other.genre,other.fav_artist)*100).toFixed(2);
    return {
      ...other,
      score : similarScore
    }
  })
  return results;
}
