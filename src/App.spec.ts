import { cleanup, fireEvent, render } from "@testing-library/vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { computed, ref } from "vue";

import App from "./App.vue";
import * as appState from "./composables/useApp";
import * as bookmarkEditor from "./composables/useBookmarkEditor";
import * as bookmarkList from "./composables/useBookmarkList";
import * as tag from "./composables/useTag";
import * as theme from "./composables/useTheme";
import { Bookmark, Icon } from "./types";
import { assertIsDefined } from "./utils/assertIsDefined";

const bookmark = (options?: Partial<Bookmark>): Bookmark => ({
  id: options?.id ?? "1",
  isFavorite: options?.isFavorite ?? false,
  tags: options?.tags ?? [],
  title: options?.title ?? "title",
  url: options?.url ?? "https://example.com",
});

const useTheme = (
  options?: Partial<ReturnType<typeof theme.useTheme>>
): ReturnType<typeof theme.useTheme> => ({
  isDarkTheme: options?.isDarkTheme ?? computed(() => true),
  toggleTheme: options?.toggleTheme ?? vi.fn(),
});

const useBookmarkList = (
  options?: Partial<ReturnType<typeof bookmarkList.useBookmarkList>>
) => ({
  bookmarks: options?.bookmarks ?? ref([]),
  getBookmarks: options?.getBookmarks ?? vi.fn().mockReturnValue([]),
  isFiltering: options?.isFiltering ?? ref(false),
  isRecentSorting: options?.isRecentSorting ?? ref(false),
  isSorting: options?.isSorting ?? ref(false),
  openBookmark: options?.openBookmark ?? vi.fn(),
  searchString: options?.searchString ?? ref(""),
  toggleFavorite: options?.toggleFavorite ?? vi.fn(),
  toggleFilter: options?.toggleFilter ?? vi.fn(),
  toggleRecentSort: options?.toggleRecentSort ?? vi.fn(),
  toggleSort: options?.toggleSort ?? vi.fn(),
});

const useBookmarkEditor = (
  options?: Partial<ReturnType<typeof bookmarkEditor.useBookmarkEditor>>
) => ({
  addBookmark: options?.addBookmark ?? vi.fn(),
  confirmation: options?.confirmation ?? ref(false),
  editBookmark: options?.editBookmark ?? vi.fn(),
  error: options?.error ?? ref(""),
  features:
    options?.features ??
    ref({
      hasReaderMode: false,
    }),
  isEditing: options?.isEditing ?? vi.fn().mockReturnValue(false),
  remove: options?.remove ?? vi.fn(),
  save: options?.save ?? vi.fn(),
  selectedBookmark: options?.selectedBookmark ?? ref(),
  setConfirmation: options?.setConfirmation ?? vi.fn(),
  setSelectedBookmark: options?.setSelectedBookmark ?? vi.fn(),
});

const useTag = (options?: Partial<ReturnType<typeof tag.useTag>>) => ({
  addTag: options?.addTag ?? vi.fn(),
  clearTagInput: options?.clearTagInput ?? vi.fn(),
  getTagOptions: options?.getTagOptions ?? vi.fn(),
  removeTag: options?.removeTag ?? vi.fn(),
  tagInput: options?.tagInput ?? ref(""),
  tagOptions: options?.tagOptions ?? ref([]),
});

// TODO: move this to a separate file
const fake = {
  bookmark,
  useBookmarkEditor,
  useBookmarkList,
  useTag,
  useTheme,
};

vi.mock("./composables/useApp", () => ({
  useApp: vi.fn().mockReturnValue({
    selectedBookmark: ref<Bookmark>(),
  }),
}));
vi.mock("./composables/useBookmarkList", () => ({
  useBookmarkList: vi.fn().mockReturnValue({
    bookmarks: ref([]),
    getBookmarks: vi.fn().mockReturnValue([]),
    go: vi.fn(),
    isFiltering: ref(false),
    isSorting: ref(false),
    searchString: ref(""),
    toggleFavorite: vi.fn(),
    toggleFilter: vi.fn(),
    toggleSort: vi.fn(),
  }),
}));
vi.mock("./composables/useTag", () => ({
  useTag: vi.fn().mockReturnValue({
    addTag: vi.fn(),
    clearTagInput: vi.fn(),
    getTagOptions: vi.fn().mockReturnValue([]),
    removeTag: vi.fn(),
    tagInput: ref(""),
    tagOptions: ref([]),
  }),
}));
vi.mock("./composables/useBookmarkEditor", () => ({
  useBookmarkEditor: vi.fn().mockReturnValue({
    addBookmark: vi.fn(),
    confirmation: ref(false),
    editBookmark: vi.fn(),
    error: ref(""),
    remove: vi.fn(),
    save: vi.fn(),
    selectedBookmark: ref(),
  }),
}));
vi.mock("./composables/useTheme", () => ({
  useTheme: vi.fn().mockReturnValue({
    isDarkTheme: computed(() => false),
    toggleTheme: vi.fn(),
  }),
}));

describe("App", () => {
  afterEach(() => cleanup());
  it("creates", () => {
    expect(render(App)).toBeDefined();
  });
  describe("ThemeToggle", () => {
    it("shows sun when dark", () => {
      const fakeTheme = fake.useTheme({
        isDarkTheme: computed(() => true),
      });
      vi.spyOn(theme, "useTheme").mockReturnValue(fakeTheme);
      const app = render(App);
      expect(app.getByText(Icon.Sun)).toBeDefined();
    });
    it("shows moon when light", () => {
      const fakeTheme = fake.useTheme({
        isDarkTheme: computed(() => false),
      });
      vi.spyOn(theme, "useTheme").mockReturnValue(fakeTheme);
      const app = render(App);
      expect(app.getByText(Icon.Moon)).toBeDefined();
    });
    it("calls toggleTheme when clicked", () => {
      const toggleTheme = vi.fn();
      const fakeTheme = fake.useTheme({
        toggleTheme: toggleTheme,
      });
      vi.spyOn(theme, "useTheme").mockReturnValue(fakeTheme);
      const app = render(App);
      app.getByText(Icon.Sun).click();
      expect(toggleTheme).toHaveBeenCalled();
    });
  });
  describe("SearchInput", () => {
    it("is bound to searchString", async () => {
      const searchString = ref("test");
      const fakeBookmarkList = fake.useBookmarkList({
        searchString,
      });
      vi.spyOn(bookmarkList, "useBookmarkList").mockReturnValue(
        fakeBookmarkList
      );
      const app = render(App);
      const input = app.container.querySelector("input");
      assertIsDefined(input);

      expect(input.value).toBe("test");
      await fireEvent.update(input, "test2");
      expect(input.value).toBe("test2");
    });
    it("calls openBookmark when enter is pressed", async () => {
      const bookmark = fake.bookmark();
      const openBookmark = vi.fn();
      const fakeBookmarkList = fake.useBookmarkList({
        bookmarks: ref([bookmark]),
        openBookmark,
      });
      vi.spyOn(bookmarkList, "useBookmarkList").mockReturnValue(
        fakeBookmarkList
      );
      const fakeBookmarkEditor = fake.useBookmarkEditor({
        isEditing: vi.fn().mockReturnValue(false),
      });
      vi.spyOn(bookmarkEditor, "useBookmarkEditor").mockReturnValue(
        fakeBookmarkEditor
      );
      const app = render(App);
      const input = app.container.querySelector("input");
      assertIsDefined(input);
      await fireEvent(input, new KeyboardEvent("keydown", { key: "Enter" }));
      expect(openBookmark).toHaveBeenCalled();
    });
  });
  describe("SortButton", () => {
    it("displays an icon for ascending when not sorting", () => {
      const fakeBookmarkList = fake.useBookmarkList();
      vi.spyOn(bookmarkList, "useBookmarkList").mockReturnValue(
        fakeBookmarkList
      );
      const app = render(App);
      expect(app.getByText(Icon.Ascending)).toBeDefined();
    });
    it("displays an icon for descending when sorting", () => {
      const fakeBookmarkList = fake.useBookmarkList({
        isSorting: ref(true),
      });
      vi.spyOn(bookmarkList, "useBookmarkList").mockReturnValue(
        fakeBookmarkList
      );
      const app = render(App);
      expect(app.getByText(Icon.Descending)).toBeDefined();
    });
    it("calls toggleSort when clicked", () => {
      const toggleSort = vi.fn();
      const fakeBookmarkList = fake.useBookmarkList({
        toggleSort,
      });
      vi.spyOn(bookmarkList, "useBookmarkList").mockReturnValue(
        fakeBookmarkList
      );
      const app = render(App);
      app.getByText(Icon.Ascending).click();
      expect(toggleSort).toHaveBeenCalled();
    });
  });
  describe("FilterButton", () => {
    it("displays an icon for not favorite when not filtering", () => {
      const fakeBookmarkList = fake.useBookmarkList();
      vi.spyOn(bookmarkList, "useBookmarkList").mockReturnValue(
        fakeBookmarkList
      );
      const app = render(App);
      expect(app.getByText(Icon.NotFavorite)).toBeDefined();
    });
    it("displays an icon for favorite when filtering", () => {
      const fakeBookmarkList = fake.useBookmarkList({
        isFiltering: ref(true),
      });
      vi.spyOn(bookmarkList, "useBookmarkList").mockReturnValue(
        fakeBookmarkList
      );
      const app = render(App);
      expect(app.getByText(Icon.Favorite)).toBeDefined();
    });
    it("calls toggleFilter when clicked", () => {
      const toggleFilter = vi.fn();
      const fakeBookmarkList = fake.useBookmarkList({
        toggleFilter,
      });
      vi.spyOn(bookmarkList, "useBookmarkList").mockReturnValue(
        fakeBookmarkList
      );
      const app = render(App);
      app.getByText(Icon.NotFavorite).click();
      expect(toggleFilter).toHaveBeenCalled();
    });
  });
  describe("AddButton", () => {
    it("calls addBookmark when clicked", () => {
      const addBookmark = vi.fn();
      const fakeBookmarkEditor = fake.useBookmarkEditor({
        addBookmark,
      });
      vi.spyOn(bookmarkEditor, "useBookmarkEditor").mockReturnValue(
        fakeBookmarkEditor
      );
      const app = render(App);
      app.getByText(Icon.Add).click();
      expect(addBookmark).toHaveBeenCalled();
    });
  });
  describe("BookmarksList", () => {
    it("displays 'No bookmarks found' when the bookmarks list is empty", () => {
      const fakeBookmarkList = fake.useBookmarkList({
        bookmarks: ref([]),
      });
      vi.spyOn(bookmarkList, "useBookmarkList").mockReturnValue(
        fakeBookmarkList
      );
      const app = render(App);
      expect(app.queryByText("No bookmarks found")).not.toBeNull();
    });
    it("does not display 'No bookmarks found' when the bookmarks list has bookmarks", () => {
      const bookmark = fake.bookmark();
      const fakeBookmarkList = fake.useBookmarkList({
        bookmarks: ref([bookmark]),
      });
      vi.spyOn(bookmarkList, "useBookmarkList").mockReturnValue(
        fakeBookmarkList
      );
      const app = render(App);
      expect(app.queryByText("No bookmarks found")).toBeNull();
    });
    it("displays a bookmark when the bookmarks list has bookmarks", () => {
      const bookmark = fake.bookmark({
        title: "title",
        url: "https://www.google.com/",
      });
      const fakeBookmarkList = fake.useBookmarkList({
        bookmarks: ref([bookmark]),
      });
      vi.spyOn(bookmarkList, "useBookmarkList").mockReturnValue(
        fakeBookmarkList
      );
      const app = render(App);
      expect(app.getByText(bookmark.title)).toBeDefined();
      expect(app.getByText(bookmark.url)).toBeDefined();
    });
    it("displays a bookmark with a favorite icon when the bookmark is favorite", () => {
      const bookmark = fake.bookmark({
        isFavorite: true,
      });
      const fakeBookmarkList = fake.useBookmarkList({
        bookmarks: ref([bookmark]),
      });
      vi.spyOn(bookmarkList, "useBookmarkList").mockReturnValue(
        fakeBookmarkList
      );
      const app = render(App);
      expect(app.queryByDisplayValue(Icon.Favorite)).toBeDefined();
    });
    it("displays a bookmark with a notfavorite icon when the bookmark is not favorite", () => {
      const bookmark = fake.bookmark({
        isFavorite: false,
      });
      const fakeBookmarkList = fake.useBookmarkList({
        bookmarks: ref([bookmark]),
      });
      vi.spyOn(bookmarkList, "useBookmarkList").mockReturnValue(
        fakeBookmarkList
      );
      const app = render(App);
      expect(app.queryByDisplayValue(Icon.NotFavorite)).toBeDefined();
    });
    it("calls toggleFavorite when the favorite icon is clicked", async () => {
      const toggleFavorite = vi.fn();
      const bookmark = fake.bookmark();
      const fakeBookmarkList = fake.useBookmarkList({
        bookmarks: ref([bookmark]),
        toggleFavorite: toggleFavorite,
      });
      vi.spyOn(bookmarkList, "useBookmarkList").mockReturnValue(
        fakeBookmarkList
      );
      const app = render(App);
      const button = app.container.querySelector("li * button");
      assertIsDefined(button);
      await fireEvent.click(button);
      expect(toggleFavorite).toHaveBeenCalled();
    });
    it("calls editBookmark when the edit icon is clicked", () => {
      const editBookmark = vi.fn();
      const fakeBookmarkList = fake.useBookmarkEditor({
        editBookmark,
      });
      vi.spyOn(bookmarkEditor, "useBookmarkEditor").mockReturnValue(
        fakeBookmarkList
      );
      const app = render(App);
      app.getByText(Icon.Pencil).click();
      expect(editBookmark).toHaveBeenCalled();
    });
    it("displays an arrow icon when the bookmark is being edited", () => {
      const fakeBookmarkEditor = fake.useBookmarkEditor({
        isEditing: () => true,
      });
      vi.spyOn(bookmarkEditor, "useBookmarkEditor").mockReturnValue(
        fakeBookmarkEditor
      );
      const app = render(App);
      expect(app.queryByText(Icon.RightArrow)).not.toBeNull();
    });
  });
  describe("BookmarkEditor", () => {
    it("titled 'Add Bookmark' if it is a new bookmark", () => {
      const bookmark = fake.bookmark({
        id: "",
      });
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const app = render(App);
      expect(app.getByText("Add Bookmark")).toBeDefined();
    });
    it("titled 'Edit Bookmark' if a bookmark is selected for editing", () => {
      const bookmark = fake.bookmark({
        id: "1",
      });
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const app = render(App);
      expect(app.getByText("Edit Bookmark")).toBeDefined();
    });
    it("title input binds to selectedBookmark title", () => {
      const bookmark = fake.bookmark({
        title: "title",
      });
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const app = render(App);
      const input = app.queryByText(bookmark.title, {
        selector: "input",
      });
      expect(input).toBeDefined();
    });
    it("url input binds to selectedBookmark url", () => {
      const bookmark = fake.bookmark({
        url: "https://example.com",
      });
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const app = render(App);
      const input = app.queryByText(bookmark.url, {
        selector: "input",
      });
      expect(input).toBeDefined();
    });
    it("favorite toggle binds to selectedBookmark favorite status", () => {
      const bookmark = fake.bookmark({
        isFavorite: true,
      });
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const app = render(App);
      const input = app.queryByText(Icon.Favorite, {
        selector: "button > div",
      });
      expect(input).toBeDefined();
    });
    it("tag input value binds", () => {
      const bookmark = fake.bookmark();
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const tagInput = ref("tag1");
      const fakeTag = fake.useTag({
        tagInput: tagInput,
      });
      vi.spyOn(tag, "useTag").mockReturnValue(fakeTag);
      const app = render(App);
      const input = app.queryByText(tagInput.value, {
        selector: "input",
      });
      expect(input).toBeDefined();
    });
    it("tag options bind", () => {
      const bookmark = fake.bookmark({
        tags: ["tag1", "tag2"],
      });
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const app = render(App);
      const tag = bookmark.tags?.[0];
      assertIsDefined(tag);
      const input = app.queryByText(tag, {
        selector: "option",
      });
      expect(input).toBeDefined();
    });
    it("add tag calls add tag", async () => {
      const addTag = vi.fn();
      const bookmark = fake.bookmark();
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const fakeTag = fake.useTag({
        addTag,
      });
      vi.spyOn(tag, "useTag").mockReturnValue(fakeTag);
      const app = render(App);
      const input = app.getByPlaceholderText("Add Tag");
      await fireEvent(input, new KeyboardEvent("keydown", { key: "Enter" }));
      expect(addTag).toHaveBeenCalled();
    });
    it("chips display for selectedBookmark tags", () => {
      const bookmark = fake.bookmark({
        tags: ["tag1", "tag2"],
      });
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const app = render(App);
      const tag = bookmark.tags?.[0];
      assertIsDefined(tag);
      const input = app.queryByText(tag, {
        selector: "div",
      });
      expect(input).toBeDefined();
    });
    it("remove tag calls remove tag", () => {
      const bookmark = fake.bookmark({
        tags: ["tag"],
      });
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const removeTag = vi.fn();
      const fakeTag = fake.useTag({
        removeTag,
      });
      vi.spyOn(tag, "useTag").mockReturnValue(fakeTag);
      const app = render(App);
      app.getByText(Icon.X).click();
      expect(removeTag).toHaveBeenCalled();
    });
    it("error displays error", () => {
      const bookmark = fake.bookmark();
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const error = "error";
      const fakeBookmarkEditor = fake.useBookmarkEditor({
        error: ref(error),
      });
      vi.spyOn(bookmarkEditor, "useBookmarkEditor").mockReturnValue(
        fakeBookmarkEditor
      );
      const app = render(App);
      const result = app.getByText(error);
      expect(result).toBeDefined();
    });
    it("save button calls save", () => {
      const bookmark = fake.bookmark();
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const save = vi.fn();
      const fakeBookmarkEditor = fake.useBookmarkEditor({
        save,
      });
      vi.spyOn(bookmarkEditor, "useBookmarkEditor").mockReturnValue(
        fakeBookmarkEditor
      );
      const app = render(App);
      app.getByText("Save").click();
      expect(save).toHaveBeenCalled();
    });
    it("remove button exists for existing bookmarks", () => {
      const bookmark = fake.bookmark({
        id: "1",
      });
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const app = render(App);
      const result = app.getByText("Remove");
      expect(result).toBeDefined();
    });
    it("remove button sets confirmation modal", () => {
      const bookmark = fake.bookmark();
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const setConfirmation = vi.fn();
      const fakeBookmarkEditor = fake.useBookmarkEditor({
        setConfirmation,
      });
      vi.spyOn(bookmarkEditor, "useBookmarkEditor").mockReturnValue(
        fakeBookmarkEditor
      );
      const app = render(App);
      app.getByText("Remove").click();
      expect(setConfirmation).toHaveBeenCalledWith(true);
    });
    it("cancel button unsets selectedBookmark", () => {
      const bookmark = fake.bookmark();
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const setSelectedBookmark = vi.fn();
      const fakeBookmarkEditor = fake.useBookmarkEditor({
        setSelectedBookmark: setSelectedBookmark,
      });
      vi.spyOn(bookmarkEditor, "useBookmarkEditor").mockReturnValue(
        fakeBookmarkEditor
      );
      const app = render(App);
      app.getByText("Cancel").click();
      expect(setSelectedBookmark).toHaveBeenCalledWith(undefined);
    });
  });
  describe("Confirmation", () => {
    it("displays when confirmation is true", () => {
      const bookmark = fake.bookmark();
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const fakeBookmarkEditor = fake.useBookmarkEditor({
        confirmation: ref(true),
      });
      vi.spyOn(bookmarkEditor, "useBookmarkEditor").mockReturnValue(
        fakeBookmarkEditor
      );
      const app = render(App);
      const result = app.getByText("Remove Bookmark");
      expect(result).toBeDefined();
    });
    it("remove button calls remove", () => {
      const bookmark = fake.bookmark();
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const remove = vi.fn();
      const fakeBookmarkEditor = fake.useBookmarkEditor({
        confirmation: ref(true),
        remove,
      });
      vi.spyOn(bookmarkEditor, "useBookmarkEditor").mockReturnValue(
        fakeBookmarkEditor
      );
      const app = render(App);
      app.getByText("Remove").click();
      expect(remove).toHaveBeenCalled();
    });
    it("cancel button unsets confirmation", () => {
      const bookmark = fake.bookmark();
      vi.spyOn(appState, "useApp").mockReturnValue({
        selectedBookmark: ref(bookmark),
      });
      const setConfirmation = vi.fn();
      const fakeBookmarkEditor = fake.useBookmarkEditor({
        confirmation: ref(true),
        setConfirmation,
      });
      vi.spyOn(bookmarkEditor, "useBookmarkEditor").mockReturnValue(
        fakeBookmarkEditor
      );
      const app = render(App);
      app.getByText("Cancel").click();
      expect(setConfirmation).toHaveBeenCalledWith(false);
    });
  });
});
