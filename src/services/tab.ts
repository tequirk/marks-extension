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

if (import.meta.vitest) {
  const { describe, expect, it, vi } = import.meta.vitest;
  vi.mock("webextension-polyfill", vi.fn());
  describe("createTabService", () => {
    describe("openTab", () => {
      it("sets recently used, creates a tab, and closes the current", async () => {
        const id = "1";
        const url = "https://example.com";
        const openInReaderMode = true;
        const recentService: RecentService = {
          getLastUsedForBookmark: vi.fn(),
          removeRecent: vi.fn(),
          setRecentlyUsed: vi.fn(),
        };

        const tabData: TabData = {
          closeCurrentTab: vi.fn().mockReturnValue(Promise.resolve()),
          createTab: vi.fn().mockReturnValue(Promise.resolve()),
        };
        const tabService = createTabService(tabData, recentService);
        await tabService.openTab(id, url, openInReaderMode);
        expect(recentService.setRecentlyUsed).toHaveBeenCalledWith(id);
        expect(tabData.createTab).toHaveBeenCalledWith(url, openInReaderMode);
        expect(tabData.closeCurrentTab).toHaveBeenCalled();
      });
    });
  });
}
