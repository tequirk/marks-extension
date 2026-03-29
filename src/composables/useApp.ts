import { ref } from "vue";

import { Bookmark } from "../types";
import { withSetup } from "../utils/testHelpers";
export const useApp = () => {
  const selectedBookmark = ref<Bookmark>();
  return { selectedBookmark };
};
