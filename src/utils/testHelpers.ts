import { createApp, onMounted, ref } from "vue";

// https://vuejs.org/guide/scaling-up/testing.html#recipes
export const withSetup = <T>(composable: () => T) => {
  let result: T | undefined = undefined;
  const app = createApp({
    setup() {
      result = composable();
      return () => {
        //
      };
    },
  });
  app.mount(document.createElement("div"));
  return { app, composable: result as unknown as T };
};
