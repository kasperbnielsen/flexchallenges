import { defineStore } from "pinia";

export const useModeStore = defineStore("mode", () => {
  const mode = ref(false);
  const server = ref("");

  return { mode, server };
});
