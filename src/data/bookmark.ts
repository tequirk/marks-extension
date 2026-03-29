import * as browser from "webextension-polyfill";

import { Bookmark, NewBookmark } from "../types";

export const createBookmarkDataAccessor = (
  bookmarkApi: typeof browser.bookmarks
) => {
  const fromBrowserBookmarkUrl = (url: string) => {
    const isReaderMode = url.startsWith("about:reader");
    const baddassurl = isReaderMode
      ? new URLSearchParams(url.substring("about:reader".length)).get("url") ??
        ""
      : url;
    return { isReaderMode, url: baddassurl };
  };

  const toBrowserBookmarkUrl = (url: string, isReaderMode?: boolean) =>
    isReaderMode ? `about:reader?url=${encodeURIComponent(url)}` : url;

  const mapApiBookmarkToBookmark = (
    bookmark: browser.Bookmarks.BookmarkTreeNode
  ) => {
    const { id, title, url } = bookmark;
    return { id, title: title, ...fromBrowserBookmarkUrl(url ?? "") };
  };

  const updateBookmark = async (bookmark: Bookmark) =>
    mapApiBookmarkToBookmark(
      await bookmarkApi.update(bookmark.id, {
        title: bookmark.title,
        url: toBrowserBookmarkUrl(bookmark.url, bookmark.isReaderMode),
      })
    );

  const createBookmark = async (bookmark: NewBookmark) =>
    mapApiBookmarkToBookmark(
      await bookmarkApi.create({
        title: bookmark.title,
        url: toBrowserBookmarkUrl(bookmark.url, bookmark.isReaderMode),
      })
    );

  const removeBookmark = (bookmarkId: string) => bookmarkApi.remove(bookmarkId);

  const getBookmark = async (bookmarkId: string) =>
    mapApiBookmarkToBookmark((await bookmarkApi.get(bookmarkId))[0]);

  // Bookmarks api returns non-bookmarks so we need to filter them out
  const isBookmark = (bookmark: browser.Bookmarks.BookmarkTreeNode) =>
    bookmark.url &&
    !(bookmark?.type === "folder") &&
    !(bookmark?.type === "separator");

  const getBookmarks = async () =>
    (await bookmarkApi.search({}))
      .filter(isBookmark)
      .map(mapApiBookmarkToBookmark);

  const getSupportedProtocols = () => [
    "https://",
    "http://",
    "ftp://",
    "file://",
  ];
  return {
    createBookmark,
    getBookmark,
    getBookmarks,
    getSupportedProtocols,
    removeBookmark,
    updateBookmark,
  };
};

export const bookmarkData = createBookmarkDataAccessor(browser.bookmarks)
export type BookmarkData = typeof bookmarkData;
