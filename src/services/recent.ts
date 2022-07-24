import { RecentData, recentData } from "../data/recent";

export const createRecentService = (recentData: RecentData) => {
  const setRecentlyUsed = (bookmarkId: string) => {
    const bookmarkLastUsed = recentData
      .getRecents()
      .filter((bookmark) => bookmark.bookmarkId !== bookmarkId);
    bookmarkLastUsed.push({ bookmarkId, lastUsed: new Date() });
    recentData.setRecents(bookmarkLastUsed);
  };

  const getLastUsedForBookmark = (bookmarkId: string) => {
    const recents = recentData.getRecents();
    const bookmark = recents.find((recent) => recent.bookmarkId === bookmarkId);
    return bookmark?.lastUsed;
  };

  const removeRecent = (bookmarkId: string) => {
    const r = recentData.getRecents();
    recentData.setRecents(r.filter((x) => x.bookmarkId !== bookmarkId));
  };

  return { getLastUsedForBookmark, removeRecent, setRecentlyUsed };
};

export const recentService = createRecentService(recentData);
export type RecentService = typeof recentService;
