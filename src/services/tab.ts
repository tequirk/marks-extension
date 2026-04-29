import { TabData, tabData } from "../data/tab";
import { RecentService, recentService } from "./recent";

export const createTabService = (
  tabData: TabData,
  recentService: RecentService
) => {
  const openTab = async (
    bookmarkId: string,
    url: string,
    openInReaderMode?: boolean
  ) => {
    recentService.setRecentlyUsed(bookmarkId);
    await tabData.createTab(url, openInReaderMode);
    await tabData.closeCurrentTab();
  };
  return { openTab };
};

export const tabService = createTabService(tabData, recentService);
export type TabService = typeof tabService;
