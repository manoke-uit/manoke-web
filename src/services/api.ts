import axios from "@/services/api.customize";
export const loginAPI = (email: string, password: string) => {
  const url = `/auth/login`;
  return axios.post<ILogin>(url, { email, password });
};
export const fetchAccountAPI = () => {
  const url = `/profile`;
  return axios.get<IFetchUser>(url);
};
export const getAllSongs = () => {
  return axios.get("/songs");
};

export const logoutAPI = () => {
  const urlBackend = `/logout`;
  return axios.post<{ message: string }>(urlBackend);
};
export const createUserAPI = (
  email: string,
  password: string,
  name: string
) => {
  const url = `/auth/signup`;
  return axios.post<IRegister>(url, { email, password, name });
};
export const updateUserAPI = (
  id: string,
  email: string,
  displayName: string
) => {
  const url = `/users/${id}`;
  return axios.patch<IRegister>(url, { email, displayName });
};
export const deleteUserAPI = (id: string) => {
  const url = `/users/${id}`;
  return axios.delete<IRegister>(url);
};
export const getAllUsersAPI = (params: Record<string, any>) => {
  return axios.get("/users", { params });
};

export const deleteSongAPI = (id: string) => {
  const url = `/songs/${id}`;
  return axios.delete<{ message: string }>(url);
};
export const getCategories = () => {
  const url = `/users`;
  return axios.get<IPaginatedSongs>(url);
};

export const createSongAPI = (formData: FormData) => {
  return axios.post("/songs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const assignArtistToSong = (songId: string, artistId: string) => {
  return axios.get(`/songs/artists/${songId}`, {
    params: { artistId },
  });
};
export const createArtistAPI = (payload: ICreateArtistPayload) => {
  return axios.post("/artists", payload);
};
export const getAllArtistsAPI = (page: number) => {
  return axios.get("/artists", {
    params: { page },
  });
};

export const createGenreAPI = (payload: {
  name: string;
  songIds: string[];
}) => {
  return axios.post("/genres", payload);
};

export const getAllGenresAPI = () => {
  return axios.get("/genres");
};
export const updateSongAPI = (
  id: string,
  title: string,
  lyrics: string,
  songUrl: string
) => {
  const url = `/songs/${id}`;
  return axios.patch(url, {
    title,
    lyrics,
    songUrl,
  });
};
export const updateArtistAPI = (
  id: string,
  name: string,
  imageUrl: string,
  songIds: string[]
) => {
  const url = `/artists/${id}`;
  return axios.patch(url, {
    name,
    imageUrl,
    songIds,
  });
};
export const deleteArtistAPI = (id: string) => {
  return axios.delete(`/artists/${id}`);
};
export const updateGenreAPI = (id: string, name: string, songIds: string[]) => {
  return axios.patch(`/genres/${id}`, {
    name,
    songIds,
  });
};

export const deleteGenreAPI = (id: string) => {
  return axios.delete(`/genres/${id}`);
};
export const createKaraokeAPI = (formData: FormData) => {
  return axios.post("/karaokes/admin", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getAllKaraokesAPI = () => {
  return axios.get("/karaokes");
};
export const updateKaraokeAPI = (
  id: string,
  description: string,
  videoUrl: string,
  songId: string
) => {
  return axios.patch(`/karaokes/${id}`, {
    description,
    videoUrl,
    songId,
  });
};
export const deleteKaraokeAPI = (id: string) => {
  return axios.delete(`/karaokes/${id}`);
};
export const createPlaylistAPI = (
  title: string,
  imageUrl: string,
  description: string,
  isPublic: boolean,
  userId: string,
  songIds: string[]
) => {
  return axios.post("/playlists", {
    title,
    imageUrl,
    description,
    isPublic,
    userId,
    songIds,
  });
};
export const getAllPlaylistsAPI = (page: number) => {
  return axios.get(`/playlists`, {
    params: { page },
  });
};
export const deletePlaylistAPI = (id: string) => {
  return axios.delete(`/playlists/${id}`);
};
export const updatePlaylistAPI = (
  id: string,
  title: string,
  imageUrl: string,
  description: string,
  isPublic: boolean,
  songIds: string[]
) => {
  return axios.patch(`/playlists/${id}`, {
    title,
    imageUrl,
    description,
    isPublic,
    songIds,
  });
};
