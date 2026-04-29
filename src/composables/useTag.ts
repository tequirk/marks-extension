import { Ref, ref } from "vue";

import { BookmarkService } from "../services/bookmark";
import { Bookmark } from "../types";
import { assertIsDefined } from "../utils/assertIsDefined";
import { withSetup } from "../utils/testHelpers";

export const useTag = (
  bookmarkService: BookmarkService,
  selectedBookmark: Ref<Bookmark | undefined>
) => {
  const tagInput = ref<string>("");
  const tagOptions = ref<string[]>([]);
  const getTagOptions = () => (tagOptions.value = bookmarkService.getAllTags());

  const clearTagInput = () => (tagInput.value = "");

  const addTag = () => {
    assertIsDefined(selectedBookmark.value);
    const value = tagInput.value?.trim();
    if (value) {
      if (!selectedBookmark.value.tags) selectedBookmark.value.tags = [];
      if (!selectedBookmark.value.tags.includes(value))
        selectedBookmark.value.tags.push(value);
      clearTagInput();
    }
  };
  const removeTag = (tag: string) => {
    assertIsDefined(selectedBookmark.value);
    selectedBookmark.value.tags = selectedBookmark.value.tags?.filter(
      (t) => t !== tag
    );
  };

  return {
    addTag,
    clearTagInput,
    getTagOptions,
    removeTag,
    tagInput,
    tagOptions,
  };
};
