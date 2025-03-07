export interface SearchResultsType {
  songs: SongSchema[];
  playlists: PlayListsSchema[];
  artists: ArtistSchema[];
}

export interface SongSchema {
  id: number;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
  duration: any;
}

export interface PlayListsSchema {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  url: string;
}

export interface ArtistSchema {
  id: string;
  name: string;
  image: string;
  description: string;
}
