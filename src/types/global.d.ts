export {};
declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }
  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }

  export interface IPaginationMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }
  interface IRegister {
    displayName: string;
    email: string;
    password: string;
  }
  interface ILogin {
    accessToken: string;
  }
  export interface IFetchUser {
    userId: string;
    email: string;
    adminSecret?: string;
  }

  export interface ISong {
    id: string;
    title: string;
    songUrl: string;
    artists: string[];
    playlists: string[];
    lyrics: string;
  }
  export interface IPaginatedSongs {
    items: ISong[];
    meta: IPaginationMeta;
  }
  export interface IPaginatedUsers {
    items: IUserTable[];
    meta: IPaginationMeta;
  }
  export interface IScore {
    id: string;
    audioUrl: string;
    finalScore: number;
    userId: string;
    songId: string;
    createdAt: string;
  }
  export interface IPaginatedScores {
    items: IScore[];
    meta: IPaginationMeta;
  }
  export interface IPlaylist {
    title: string;
    userId: string;
    imageUrl: string;
    description: string;
    songIds: string[];
  }

  export interface IPaginatedPlaylists {
    items: IPlaylist[];
    meta: IPaginationMeta;
  }
  interface IYoutubeResult {
    title: string;
    videoId: string;
    embedUrl: string;
    isEmbedded: boolean;
    thumbnailUrl: string;
  }

  interface IYoutubeSearchResponse {
    results: IYoutubeResult[];
    nextPageToken: string;
    prevPageToken: string;
  }
  interface IUserTable {
    id: string;
    displayName: string;
    adminSecret: string;
    email: string;
    password: string;
    imageUrl: string;
    createdAt: Date;
  }
  export interface ICreateArtistPayload {
    name: string;
    imageUrl: string;
    songIds: string[];
  }
  export interface IArtists {
    id: string;
    name: string;
    imageUrl: string;
    songIds: string[];
  }
  export interface IGenre {
    id: string;
    name: string;
    songs: string[];
  }
  export interface IKaraoke {
    id: string;
    description: string;
    videoUrl: string;
    createdAt: Date;
    song: {
      id: string;
      title: string;
      lyrics: string;
      songUrl: string;
    };
    userId: string;
  }

  interface IPlaylist {
    id: string;
    title: string;
    imageUrl: string;
    description: string;
    isPublic: boolean;
  }
}
