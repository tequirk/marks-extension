import useLocalStorage from "../lib/useLocalStorage";
import { BookmarkLastUsed, LocalStorage } from "../types";

const { getValue, setValue } = useLocalStorage<LocalStorage>();

const mapRecentDataToRecent = (recent: BookmarkLastUsed) => ({
  ...recent,
  lastUsed: recent.lastUsed ? new Date(recent.lastUsed) : undefined,
});

const getRecents = () => getValue("recent")?.map(mapRecentDataToRecent) ?? [];
const setRecents = (recent: BookmarkLastUsed[]) => setValue("recent", recent);

export const recentData = { getRecents, setRecents };
export type RecentData = typeof recentData;
