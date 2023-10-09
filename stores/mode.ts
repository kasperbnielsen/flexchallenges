import { defineStore } from "pinia";

export const useModeStore = defineStore("mode", () => {
  const mode = ref(false);
  const server = ref("EUW");
  const dataObject = ref();
  const showRolesRef = ref(false);

  return { mode, server, dataObject, showRolesRef };
});
