import { nextTick, onMounted, Ref, ref, watch } from "vue";

import { BookmarkService } from "../services/bookmark";
import { PlatformService } from "../services/platform";
import { Bookmark } from "../types";
import { assertIsDefined } from "../utils/assertIsDefined";
import { withSetup } from "../utils/testHelpers";

export const useBookmarkEditor = (
  platformService: PlatformService,
  bookmarkService: BookmarkService,
  selectedBookmark: Ref<Bookmark | undefined>,
  getBookmarks: () => Promise<Bookmark[]>,
  getTagOptions: () => string[],
  clearTagInput: () => void
) => {
  const editBookmark = async (bookmarkId: string) => {
    selectedBookmark.value =
      bookmarkId === selectedBookmark.value?.id
        ? undefined
        : await bookmarkService.getBookmark(bookmarkId);
    clearTagInput();
    getTagOptions();
  };

  const supportedProtocols = ref<string[]>([]);
  onMounted(
    () => (supportedProtocols.value = bookmarkService.getSupportedProtocols())
  );

  const hasError = (bookmark: Bookmark) =>
    supportedProtocols.value.some((protocol) =>
      bookmark.url?.startsWith(protocol)
    )
      ? undefined
      : `URL must start with ` + supportedProtocols.value.join(", ");

  const error = ref<string>();
  watch(selectedBookmark, () => (error.value = undefined), { deep: true });

  const save = async () => {
    assertIsDefined(selectedBookmark.value);
    error.value = hasError(selectedBookmark.value);
    if (!error.value) {
      try {
        if (selectedBookmark.value.id)
          await bookmarkService.updateBookmark(selectedBookmark.value);
        else
          selectedBookmark.value = await bookmarkService.createBookmark(
            selectedBookmark.value
          );
      } catch (err) {
        error.value = "Something went wrong";
      }
    }
    await getBookmarks();
  };

  const confirmation = ref(false);
  const remove = async () => {
    assertIsDefined(selectedBookmark.value);
    await bookmarkService.removeBookmark(selectedBookmark.value.id);
    selectedBookmark.value = undefined;
    confirmation.value = false;
    await getBookmarks();
  };

  const addBookmark = () =>
    (selectedBookmark.value = {
      id: "",
      isFavorite: false,
      isReaderMode: false,
      tags: [],
      title: "",
      url: "",
    });

  const setConfirmation = (value: boolean) => (confirmation.value = value);

  const setSelectedBookmark = (bookmark?: Bookmark) =>
    (selectedBookmark.value = bookmark);

  const isEditing = (bookmarkId: string) =>
    bookmarkId === selectedBookmark.value?.id;

  const features = ref({
    hasReaderMode: false,
  });

  onMounted(async () => {
    features.value = await platformService.getFeatures();
  });

  return {
    addBookmark,
    confirmation,
    editBookmark,
    error,
    features,
    isEditing,
    remove,
    save,
    selectedBookmark,
    setConfirmation,
    setSelectedBookmark,
  };
};
