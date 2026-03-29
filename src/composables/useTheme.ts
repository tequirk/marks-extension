import { computed, onMounted, ref } from "vue";

import { ThemeService } from "../services/theme";
import { ThemeOption } from "../types";
import { withSetup } from "../utils/testHelpers";

export const useTheme = (themeService: ThemeService) => {
  const selectedTheme = ref<ThemeOption>();
  onMounted(() => (selectedTheme.value = themeService.getTheme()));
  const toggleTheme = () => (selectedTheme.value = themeService.toggleTheme());
  const isDarkTheme = computed(() => selectedTheme.value === ThemeOption.Dark);
  return { isDarkTheme, toggleTheme };
};
