import { defineStore } from "pinia";

export const useModeStore = defineStore("player", () => {
  const savedId = ref<string>();
  const playerData = ref();
  const profileData = ref<{
    name: string;
    tag: string;
    puuid: string;
    profileIcon: number;
    summonerId: string;
    summonerLevel: number;
  }>();

  return { savedId, playerData, profileData };
});
