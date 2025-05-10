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
  const url = `/songs`;
  return axios.get<IPaginatedSongs>(url);
};
export const logoutAPI = () => {
  const urlBackend = `/logout`;
  return axios.post<IRegister>(urlBackend);
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
export const deleteUserAPI = () => {
  const url = `/users`;
  return axios.delete<IRegister>(url);
};
export const getAllUsersAPI = () => {
  const url = `/users`;
  return axios.get<IPaginatedSongs>(url);
};
export const updateSongAPI = (id: string) => {
  const url = `/songs/${id}`;
  return axios.patch<ISong>(url);
};
export const deleteSongAPI = (id: string) => {
  const url = `/songs/${id}`;
  return axios.delete<{ message: string }>(url);
};
export const getCategories = () => {
  const url = `/users`;
  return axios.get<IPaginatedSongs>(url);
};
export const createSongAPI = (
  title: string,
  youtubeUrl: string,
  albumTitle: string,
  imageUrl: string,
  releasedDate: string,
  duration: number,
  spotifyUrl: string,
  lyrics: string,
  audioUrl: string
) => {
  const url = "/songs";
  return axios.post(url, {
    title,
    youtubeUrl,
    albumTitle,
    imageUrl,
    releasedDate,
    duration,
    spotifyUrl,
    lyrics,
    audioUrl,
  });
};
