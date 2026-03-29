import { nextTick, onMounted, ref, watch } from "vue";

import { BookmarkService } from "../services/bookmark";
import { Bookmark } from "../types";
import { withSetup } from "../utils/testHelpers";

export const useBookmarkList = (bookmarkService: BookmarkService) => {
  const isSorting = ref(false);
  const toggleSort = () => (isSorting.value = !isSorting.value);

  const isFiltering = ref(false);
  const toggleFilter = () => (isFiltering.value = !isFiltering.value);

  const isRecentSorting = ref(false);
  const toggleRecentSort = () =>
    (isRecentSorting.value = !isRecentSorting.value);

  const searchString = ref<string>();
  const bookmarks = ref<Bookmark[]>([]);
  const getBookmarks = async () =>
    (bookmarks.value = await bookmarkService.getBookmarks(
      searchString.value,
      isSorting.value,
      isFiltering.value,
      isRecentSorting.value
    ));

  onMounted(async () => await getBookmarks());

  watch(
    [searchString, isSorting, isFiltering, isRecentSorting],
    async () => await getBookmarks()
  );
  const toggleFavorite = async (bookmarkId: string) => {
    bookmarkService.toggleFavorite(bookmarkId);
    await getBookmarks();
  };
  const openBookmark = async (bookmark: Bookmark) =>
    await bookmarkService.openBookmark(bookmark);

  return {
    bookmarks,
    getBookmarks,
    isFiltering,
    isRecentSorting,
    isSorting,
    openBookmark,
    searchString,
    toggleFavorite,
    toggleFilter,
    toggleRecentSort,
    toggleSort,
  };
};
