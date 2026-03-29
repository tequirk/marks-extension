import { TagData, tagData } from "../data/tag";

export const createTagService = (tagData: TagData) => {
  const getBookmarkTags = () => tagData.getTags();

  const getAllTags = () =>
    getBookmarkTags()
      .flatMap((tag) => tag.tags)
      .sort();

  const getTagsForBookmark = (bookmarkId: string) => {
    const tags = getBookmarkTags();
    const bookmark = tags.find((tag) => tag.bookmarkId === bookmarkId);
    return bookmark?.tags ? bookmark.tags.sort() : [];
  };

  const setTags = (bookmarkId: string, tags?: string[]) => {
    const bookmarkTags = getBookmarkTags().filter(
      (tag) => tag.bookmarkId !== bookmarkId
    );
    if (tags?.length) bookmarkTags.push({ bookmarkId, tags });
    tagData.setTags(bookmarkTags);
  };
  return {
    getAllTags,
    getTagsForBookmark,
    setTags,
  };
};

export const tagService = createTagService(tagData);
export type TagService = typeof tagService;
