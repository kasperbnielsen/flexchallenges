<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useModeStore } from "@/stores/player";
const { playerData, profileData } = storeToRefs(useModeStore());
</script>
<template>
  <div class="profile">
    <img
      class="profile__image"
      :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${profileData?.profileIcon}.jpg`"
    />
    <p class="profile__level">{{ profileData?.summonerLevel }}</p>
    <div>
      <p class="profile__username">
        {{ profileData?.name + "#" + profileData?.tag }}
      </p>
      <button class="btn btn-primary profile__button">Refresh</button>
    </div>
    <div v-for="(type, typeIndex) of playerData?.data" :key="typeIndex">
      <div
        v-if="type?.queueType !== 'RANKED_TFT_DOUBLE_UP'"
        class="profile__rank__flexqueue"
      >
        <img
          class="profile__rank__image"
          :src="`https://raw.communitydragon.org/13.19/plugins/rcp-fe-lol-shared-components/global/default/${playerData?.data[
            typeIndex
          ]?.tier.toLowerCase()}.png`"
        />
        <div class="profile__rank__textdiv">
          <p class="profile__rank__flexqueue__title">
            {{
              playerData?.data[typeIndex]?.queueType === "RANKED_FLEX_SR"
                ? "Ranked Flex"
                : "Ranked Solo"
            }}
          </p>
          <p class="profile__rank__text">
            {{ playerData?.data[typeIndex]?.tier }}
            {{ playerData?.data[typeIndex]?.rank }}
          </p>
          <p class="profile__rank__undertext">
            {{ playerData?.data[typeIndex]?.leaguePoints }} LP
          </p>
        </div>
        <div class="profile__rank__winrate">
          <p>
            {{ playerData?.data[typeIndex]?.wins }}W
            {{ playerData?.data[typeIndex]?.losses }}L
          </p>
          <p>
            {{
              (
                (playerData?.data[typeIndex]?.wins /
                  (playerData?.data[typeIndex]?.wins +
                    playerData?.data[typeIndex]?.losses)) *
                100
              ).toPrecision(4)
            }}% Win Rate
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.profile {
  border: 1px solid black;
  background-color: #252525;
  border-radius: 5px;
  display: flex;
  padding: 1rem;
  margin-bottom: 1rem;
  flex-direction: row;
  &__level {
    background-color: black;
    height: fit-content;
    position: absolute;
    translate: 5.25rem 5.375rem;
    border-radius: 5px;
  }
  &__button {
    margin-left: 3rem;
    margin-top: 4rem;
    &:focus {
      box-shadow: none !important;
      outline: none !important;
    }
  }
  &__username {
    color: white;
    position: absolute;
    margin-left: 3rem;
    font-size: 28px;
    font-weight: 700;
  }

  &__rank {
    &__winrate {
      margin-left: 1rem;
      font-size: 14px;
      text-align: center;
      margin-top: 1.5rem;
      color: hsl(0, 3%, 27%);
    }
    &__flexqueue {
      display: flex;
      margin-left: 4rem;
      color: white;

      &__title {
        margin-left: 1rem;
        margin-top: 1rem;
        text-align: center;
      }
    }
    &__image {
      width: 7rem;
      height: 7rem;
      margin-left: 3rem;
    }

    &__image2 {
      width: 7rem;
      height: 7rem;
    }

    &__textdiv {
      text-align: center;
      margin-right: 1rem;
    }

    &__text {
      margin-top: -1rem;
      margin-left: 1rem;
      font-weight: 700;
      text-transform: capitalize;
    }

    &__undertext {
      margin-top: -1rem;
      margin-left: 1rem;
    }
  }
  &__image {
    border-radius: 10px;
    width: 7rem;
    height: 7rem;
  }
}
</style>
