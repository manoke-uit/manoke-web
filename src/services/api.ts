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
  email: string,
  password: string,
  name: string
) => {
  const url = `/users`;
  return axios.patch<IRegister>(url, { email, password, name });
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

export const updateSongAPI = (
  id: string,
  payload: Partial<{
    title: string;
    youtubeUrl: string;
    albumTitle: string;
    imageUrl: string;
    releasedDate: string;
    duration: number;
    spotifyUrl: string;
    lyrics: string;
    audioUrl: string;
  }>
) => {
  const url = `/songs/${id}`;
  return axios.patch(url, payload);
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
