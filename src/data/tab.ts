import * as browser from "webextension-polyfill";

import { assertIsDefined } from "../utils/assertIsDefined";
import { isFirefox } from "../utils/detectPlatform";

export const createTabDataAccessor = (tabApi: typeof browser.tabs) => {
  const createTab = async (url: string, openInReaderMode?: boolean) => {
    let options: browser.Tabs.CreateCreatePropertiesType = { url };
    if (await isFirefox()) options = { ...options, openInReaderMode };
    await browser.tabs.create(options);
  };
  const closeCurrentTab = async () => {
    const currentTabId = (await tabApi.getCurrent()).id;
    assertIsDefined(currentTabId);
    await tabApi.remove(currentTabId);
  };
  return { closeCurrentTab, createTab };
};

export const tabData = createTabDataAccessor(browser.tabs)
export type TabData = typeof tabData;
