import { FavoriteData, favoriteData } from "../data/favorite";

export const createFavoriteService = (favoriteData: FavoriteData) => {
  const addFavorite = (bookmarkId: string) => {
    const f = favoriteData.getFavorites();
    f.push(bookmarkId);
    favoriteData.setFavorites(f);
  };
  const removeFavorite = (bookmarkId: string) => {
    const f = favoriteData.getFavorites();
    favoriteData.setFavorites(f.filter((id) => id !== bookmarkId));
  };
  const isFavorite = (bookmarkId: string) =>
    favoriteData.getFavorites().some((id) => id === bookmarkId);

  const toggleFavorite = (bookmarkId: string) => {
    isFavorite(bookmarkId)
      ? removeFavorite(bookmarkId)
      : addFavorite(bookmarkId);
  };
  return {
    addFavorite,
    isFavorite,
    removeFavorite,
    toggleFavorite,
  };
};

export const favoriteService = createFavoriteService(favoriteData);
export type FavoriteService = typeof favoriteService;
