import axios from "@/services/api.customize";
export const loginAPI = (email: string, password: string) => {
  const url = `/auth/login`;
  return axios.post<ILogin>(url, { email, password });
};
export const fetchAccountAPI = () => {
  const url = `/profile`;
  return axios.get<IFetchUser>(url);
};
export const getAllSongs = (genreId?: string, artistId?: string) => {
  const params: any = {};
  if (genreId) params.genreId = genreId;
  if (artistId) params.artistId = artistId;

  return axios.get("/songs", { params });
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
  return axios.delete(url);
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
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("image", payload.image); // dạng File
  payload.songIds.forEach((id) => formData.append("songIds", id));

  return axios.post("/artists", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllArtistsAPI = (page: number) => {
  return axios.get("/artists", {
    params: { page },
  });
};

export const createGenreAPI = (payload: { name: string }) => {
  return axios.post("/genres", payload);
};

export const getAllGenresAPI = () => {
  return axios.get("/genres");
};
export const updateSongAPI = (id: string, formData: FormData) => {
  const url = `/songs/${id}`;
  return axios.patch(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
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
  return axios.post("/karaokes", formData, {
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
  image: File,
  description: string,
  isPublic: boolean,
  userId: string,
  songIds: string[]
) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("image", image);
  formData.append("description", description);
  formData.append("isPublic", String(isPublic));
  formData.append("userId", userId);
  songIds.forEach((id) => formData.append("songIds", id));

  return axios.post("/playlists", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllPlaylistsAPI = () => {
  return axios.get(`/playlists`);
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
export const searchSongsByTitleAPI = (q: string) => {
  return axios.get("/songs/search/title", {
    params: { q },
  });
};
export const searchSongsByArtistAPI = (q: string) => {
  return axios.get("/songs/search/artist", {
    params: { q },
  });
};
export const searchPlaylistsByTitleAPI = (searchTitle: string) => {
  return axios.get(`/playlists/${searchTitle}`);
};
export const getSongsInPlaylistAPI = (playlistId: string) => {
  return axios.get(`/playlists/${playlistId}/songs`);
};
const updatePlaylistSongsIndividually = async (
  playlistId: string,
  songIds: string[]
) => {
  for (const songId of songIds) {
    try {
      await axios.patch(`/playlists/${playlistId}/songs/${songId}`);
    } catch (err) {
      console.error(`Lỗi khi cập nhật bài hát ${songId}:`, err);
    }
  }
};
export const sendNotificationToAllUserAPI = async (data: {
  title: string;
  description: string;
}) => {
  const res = await axios.post(
    "/notifications/sendNotificationToAllUser",
    data
  );
  return res;
};

export const sendNotificationToUserAPI = async (data: {
  title: string;
  description: string;
  userId: string;
}) => {
  const res = await axios.post("/notifications/sendNotificationToUser", data);
  return res.data;
};
export const getExpoPushTokensByUserIdAPI = async (
  userId: string
): Promise<string[]> => {
  const res = await axios.get(`/users/userTokenList/${userId}`);
  return res;
};
