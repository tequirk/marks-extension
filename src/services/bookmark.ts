import { BookmarkData, bookmarkData } from "../data/bookmark";
import { FavoriteService, favoriteService } from "../services/favorite";
import { TagService, tagService } from "../services/tag";
import { Bookmark, NewBookmark } from "../types";
import { byLastUsed, byProperty } from "../utils/compare";
import { RecentService, recentService } from "./recent";
import { TabService, tabService } from "./tab";

export const createBookmarkService = (
  bookmarkData: BookmarkData,
  tagService: TagService,
  favoriteService: FavoriteService,
  tabService: TabService,
  recentService: RecentService
) => {
  const getSearchItems = (bookmark: Bookmark) =>
    [bookmark.title, bookmark.url, ...(bookmark.tags ?? [])].map((item) =>
      item.trim().toLowerCase()
    );

  const applySearch = (bookmarks: Bookmark[], search?: string) =>
    search
      ? bookmarks.filter((bookmark) =>
          getSearchItems(bookmark).some((item) =>
            item.includes(search?.toLowerCase())
          )
        )
      : bookmarks;

  const applyFilters = (bookmarks: Bookmark[], isFiltering: boolean) =>
    bookmarks.filter((bookmark) =>
      isFiltering ? favoriteService.isFavorite(bookmark.id) : true
    );

  const applyAlphabeticalSort = (bookmarks: Bookmark[], isSorting: boolean) =>
    [...bookmarks].sort(byProperty("title", isSorting));

  const applyRecentSort = (bookmarks: Bookmark[], isRecentSorting: boolean) =>
    isRecentSorting ? [...bookmarks].sort(byLastUsed) : bookmarks;

  const getBookmarks = async (
    search?: string,
    isSorting?: boolean,
    isFiltering?: boolean,
    isRecentSorting?: boolean
  ) => {
    const bookmarkItems = (await bookmarkData.getBookmarks()).map(
      (bookmark) => ({
        ...bookmark,
        isFavorite: favoriteService.isFavorite(bookmark.id),
        lastUsed: recentService.getLastUsedForBookmark(bookmark.id),
        tags: tagService.getTagsForBookmark(bookmark.id) ?? [],
        title: bookmark.title ? bookmark.title : "[No Title]",
      })
    );
    const searchResults = applySearch(bookmarkItems, search);
    const filteredBookmarks = applyFilters(searchResults, !!isFiltering);
    const alphabeticallySortedBookmarks = applyAlphabeticalSort(
      filteredBookmarks,
      !!isSorting
    );
    const recentlySortedBookmarks = applyRecentSort(
      alphabeticallySortedBookmarks,
      !!isRecentSorting
    );
    return recentlySortedBookmarks;
  };

  const getBookmark = async (bookmarkId: string) => {
    const bookmark = await bookmarkData.getBookmark(bookmarkId);
    return {
      ...bookmark,
      isFavorite: favoriteService.isFavorite(bookmark.id),
      tags: tagService.getTagsForBookmark(bookmark.id),
    };
  };

  const createBookmark = async (bookmark: NewBookmark) => {
    const newBookmark = await bookmarkData.createBookmark(bookmark);
    if (bookmark.isFavorite) favoriteService.addFavorite(newBookmark.id);
    if (bookmark.tags) tagService.setTags(newBookmark.id, bookmark.tags);
    return {
      ...newBookmark,
      isFavorite: bookmark.isFavorite,
      tags: bookmark.tags,
    };
  };

  const updateBookmark = async (bookmark: Bookmark) => {
    const result = await bookmarkData.updateBookmark(bookmark);
    bookmark.isFavorite
      ? favoriteService.addFavorite(bookmark.id)
      : favoriteService.removeFavorite(bookmark.id);
    tagService.setTags(bookmark.id, bookmark.tags ?? []);
    return result;
  };

  const removeBookmark = async (bookmarkId: string) => {
    await bookmarkData.removeBookmark(bookmarkId);
    favoriteService.removeFavorite(bookmarkId);
    tagService.setTags(bookmarkId);
    recentService.removeRecent(bookmarkId);
  };

  const getSupportedProtocols = () => bookmarkData.getSupportedProtocols();

  const openBookmark = async (bookmark: Bookmark) =>
    await tabService.openTab(bookmark.id, bookmark.url, bookmark.isReaderMode);

  return {
    createBookmark,
    getAllTags: tagService.getAllTags,
    getBookmark,
    getBookmarks,
    getSupportedProtocols,
    openBookmark,
    removeBookmark,
    toggleFavorite: favoriteService.toggleFavorite,
    updateBookmark,
  };
};

export const bookmarkService = createBookmarkService(
  bookmarkData,
  tagService,
  favoriteService,
  tabService,
  recentService
);
export type BookmarkService = typeof bookmarkService;
