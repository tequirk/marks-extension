<script setup lang="ts">
import Chip from "./components/Chip.vue";
import ChipContainer from "./components/ChipContainer.vue";
import Combobox from "./components/Combobox.vue";
import CommandPalette from "./components/CommandPalette.vue";
import CommandPaletteControls from "./components/CommandPaletteControls.vue";
import Error from "./components/Error.vue";
import FormButton from "./components/FormButton.vue";
import FormGroup from "./components/FormGroup.vue";
import IconButton from "./components/IconButton.vue";
import IconButtonContainer from "./components/IconButtonContainer.vue";
import List from "./components/List.vue";
import ListItem from "./components/ListItem.vue";
import SearchInput from "./components/SearchInput.vue";
import SiteLayout from "./components/SiteLayout.vue";
import TextInput from "./components/TextInput.vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import ToggleInput from "./components/ToggleInput.vue";
import { useApp } from "./composables/useApp";
import { useBookmarkEditor } from "./composables/useBookmarkEditor";
import { useBookmarkList } from "./composables/useBookmarkList";
import { useTag } from "./composables/useTag";
import { useTheme } from "./composables/useTheme";
import { bookmarkService } from "./services/bookmark";
import { platformService } from "./services/platform";
import { themeService } from "./services/theme";
import { Icon } from "./types";
const { selectedBookmark } = useApp();

const {
  searchString,
  bookmarks,
  isSorting,
  isFiltering,
  isRecentSorting,
  getBookmarks,
  toggleSort,
  toggleFilter,
  toggleFavorite,
  openBookmark,
  toggleRecentSort,
} = useBookmarkList(bookmarkService);

const {
  tagOptions,
  tagInput,
  addTag,
  removeTag,
  getTagOptions,
  clearTagInput,
} = useTag(bookmarkService, selectedBookmark);

const {
  confirmation,
  error,
  editBookmark,
  addBookmark,
  remove,
  save,
  setConfirmation,
  setSelectedBookmark,
  isEditing,
  features,
} = useBookmarkEditor(
  platformService,
  bookmarkService,
  selectedBookmark,
  getBookmarks,
  getTagOptions,
  clearTagInput
);

const { toggleTheme, isDarkTheme } = useTheme(themeService);
</script>

<template>
  <SiteLayout :is-dark-theme="isDarkTheme">
    <template #header>
      <ThemeToggle :is-dark-theme="isDarkTheme" @toggle-theme="toggleTheme" />
    </template>
    <template #content>
      <CommandPalette :is-open="!!selectedBookmark">
        <template #content>
          <CommandPaletteControls>
            <SearchInput
              v-model="searchString"
              :placeholder="`${Icon.MagnifyingGlass} Search Bookmarks`"
              @go="
                bookmarks.length && bookmarks[0].url
                  ? openBookmark(bookmarks[0])
                  : undefined
              "
            />
            <IconButtonContainer>
              <IconButton
                title="Sort List by Recently Used"
                @click="toggleRecentSort"
              >
                {{ isRecentSorting ? Icon.QuadrantCircle : Icon.ClosedCircle }}
              </IconButton>
              <IconButton title="Sort List Alphabetically" @click="toggleSort">
                {{ isSorting ? Icon.Descending : Icon.Ascending }}
              </IconButton>
              <IconButton title="Filter List" @click="toggleFilter">
                {{ isFiltering ? Icon.Favorite : Icon.NotFavorite }}
              </IconButton>
              <IconButton title="Add Bookmark" @click="addBookmark()">{{
                Icon.Add
              }}</IconButton>
            </IconButtonContainer>
          </CommandPaletteControls>
          <List :items="bookmarks">
            <template #list>
              <ListItem
                v-for="bookmark in bookmarks"
                :key="bookmark.id"
                :bookmark="bookmark"
                :is-editing="isEditing(bookmark.id)"
                @favorite-clicked="toggleFavorite"
                @edit-clicked="editBookmark"
                @open-bookmark="openBookmark"
              />
            </template>
            <template #fallback>No bookmarks found</template>
          </List>
        </template>
        <template #drawer>
          <template v-if="confirmation">
            <FormGroup>
              <template #header>Remove Bookmark</template>
              <template #content>
                Are you sure you want to remove this bookmark?
              </template>
              <template #footer>
                <FormButton @click="remove">Remove</FormButton>
                <FormButton @click="setConfirmation(false)">
                  Cancel
                </FormButton>
              </template>
            </FormGroup>
          </template>
          <template v-else-if="selectedBookmark">
            <FormGroup>
              <template #header>
                {{ selectedBookmark.id ? `Edit` : `Add` }} Bookmark
              </template>
              <template #content>
                <TextInput
                  v-model="selectedBookmark.title"
                  placeholder="Title"
                />
                <TextInput v-model="selectedBookmark.url" placeholder="URL" />
                <ToggleInput
                  :label="'Favorite'"
                  @toggle-clicked="
                      selectedBookmark!.isFavorite =
                        !selectedBookmark!.isFavorite
                    "
                >
                  {{
                    selectedBookmark.isFavorite
                      ? Icon.Favorite
                      : Icon.NotFavorite
                  }}
                </ToggleInput>
                <ToggleInput
                  v-if="features.hasReaderMode"
                  :label="'View Mode'"
                  @toggle-clicked="
                      selectedBookmark!.isReaderMode =
                        !selectedBookmark!.isReaderMode
                    "
                >
                  {{ selectedBookmark.isReaderMode ? Icon.Book : Icon.Web }}
                </ToggleInput>
                <Combobox
                  v-model="tagInput"
                  :placeholder="'Add Tag'"
                  :options="tagOptions"
                  @add-tag="addTag"
                />
                <ChipContainer>
                  <Chip
                    v-for="tag in selectedBookmark.tags"
                    :key="tag"
                    :tag="tag"
                    @remove-tag="removeTag"
                  />
                </ChipContainer>
                <Error>{{ error }}</Error>
              </template>
              <template #footer>
                <FormButton @click="save">Save</FormButton>
                <FormButton
                  v-if="selectedBookmark.id"
                  @click="setConfirmation(true)"
                >
                  Remove
                </FormButton>
                <FormButton @click="setSelectedBookmark(undefined)">
                  Cancel
                </FormButton>
              </template>
            </FormGroup>
          </template>
        </template>
      </CommandPalette>
    </template>
    <template #footer>Created by Ryan Mason</template>
  </SiteLayout>
</template>
