import { defineStore } from "pinia";

export const useModeStore = defineStore("player", () => {
  const savedId = ref<string>();

  return { savedId };
});
