<script setup lang="ts">
import { ref } from "vue";
import MatchExtra from "./MatchExtra.vue";
import items from "~/assets/items";
import spells from "~/assets/summonerSpells";
defineProps<{
  match: any;
  user: { name: string; puuid: string };
  region: string;
  win: boolean;
}>();

const openExtra = ref<boolean>(false);

function getSummonerSpell(id: number): string {
  let fullPath = "";
  spells.forEach((e) => {
    if (e.id === id) {
      fullPath = `https://raw.communitydragon.org/latest/game/data/spells/icons2d/${e.iconPath
        .substring(42, e.iconPath.length)
        .toLowerCase()}`;
    }
  });
  return fullPath;
}

function getImagePath(id: number): string {
  let fullPath = "";
  if (id === 0)
    fullPath =
      "/lol-game-data/assets/ASSETS/Items/Icons2D/gp_ui_placeholder.png";
  items.forEach((e) => {
    if (e.id === id) {
      fullPath = e.iconPath;
    }
  });

  return fullPath.substr(43, fullPath.length - 1);
}
</script>
<template>
  <div>
    <div
      class="result__match"
      :style="
        win
          ? { 'background-color': '#4F7942' }
          : { 'background-color': '#6D071A' }
      "
    >
      <div class="result__match__data">
        <div
          v-for="(participant, index) of match.info?.participants"
          :key="index"
        >
          <p v-if="participant?.puuid === user.puuid">
            {{
              match?.info?.queueId === 440
                ? "Ranked Flex"
                : match?.info?.queueId === 420
                ? "Ranked Solo"
                : "Unranked"
            }}
          </p>
          <p v-if="participant?.puuid === user.puuid">
            {{
              new Date(match?.info?.gameStartTimestamp).toString().substr(3, 8)
            }}
          </p>
          <p v-if="participant?.puuid === user.puuid">
            {{ win ? "Win" : "Loss" }}
          </p>
          <p v-if="participant?.puuid === user.puuid">
            {{
              Math.floor(
                (match?.info?.gameEndTimestamp -
                  match?.info?.gameStartTimestamp) /
                  60000
              ) +
              "m " +
              ((match?.info?.gameEndTimestamp -
                match?.info?.gameStartTimestamp) %
                60) +
              "s"
            }}
          </p>
        </div>
      </div>

      <div>
        <div
          v-for="(participant, index) of match.info?.participants"
          :key="index"
          class="result__match__champion"
        >
          <img
            v-if="participant?.puuid === user.puuid"
            :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${participant?.championId}.png`"
            class="result__match__champion__img"
          />
          <div v-if="participant?.puuid === user.puuid">
            <img
              :src="getSummonerSpell(participant?.summoner1Id)"
              class="result__match__champion__summonerSpells"
            />
            <img
              :src="getSummonerSpell(participant?.summoner2Id)"
              class="result__match__champion__summonerSpells"
            />
          </div>
        </div>
      </div>
      <div class="result_match__stats">
        <div
          v-for="(participant, index) of match.info?.participants"
          :key="index"
        >
          <p
            v-if="participant?.puuid === user.puuid"
            class="result__match__stats__kda"
          >
            <span>{{ participant?.kills }}</span>
            <span style="color: darkgrey">/</span>
            <span style="color: darkred">{{ participant?.deaths }}</span>
            <span style="color: darkgrey">/</span>
            <span>{{ participant?.assists }}</span>
          </p>

          <p
            v-if="participant?.puuid === user.puuid"
            class="result__match__stats__computedkda"
          >
            {{
              (
                (participant?.kills + participant?.assists) /
                (participant?.deaths ? participant?.deaths : 1)
              ).toPrecision(3)
            }}
            KDA
          </p>
          <div
            v-if="participant?.puuid === user.puuid"
            class="result__match__stats__itemsdiv1"
          >
            <img
              class="result__match__stats__items"
              :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getImagePath(
                participant?.item0
              ).toLowerCase()}`"
            />
            <img
              class="result__match__stats__items"
              :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getImagePath(
                participant?.item1
              ).toLowerCase()}`"
            />
            <img
              class="result__match__stats__items"
              :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getImagePath(
                participant?.item2
              ).toLowerCase()}`"
            />

            <img
              class="result__match__stats__items"
              :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getImagePath(
                participant?.item3
              ).toLowerCase()}`"
            />
            <img
              class="result__match__stats__items"
              :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getImagePath(
                participant?.item4
              ).toLowerCase()}`"
            />
            <img
              class="result__match__stats__items"
              :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getImagePath(
                participant?.item5
              ).toLowerCase()}`"
            />
          </div>
        </div>
      </div>
      <div class="result__match__extrastats">
        <div
          v-for="(participant, index) of match.info?.participants"
          :key="index"
        >
          <div v-if="participant?.puuid === user.puuid">
            <p class="result__match__extrastats__vs">
              VS {{ participant?.visionScore }}
            </p>
            <p class="result__match__extrastats__cs">
              CS
              {{
                participant?.totalMinionsKilled +
                participant?.challenges.enemyJungleMonsterKills +
                participant?.challenges.alliedJungleMonsterKills
              }}
            </p>
            <p class="result__match__extrastats__kp">
              KP
              {{
                (participant?.challenges?.killParticipation * 100).toPrecision(
                  3
                )
              }}%
            </p>
            <p class="result__match__extrastats__gpm">
              {{
                (
                  participant?.goldEarned /
                  ((match?.info?.gameEndTimestamp -
                    match?.info?.gameStartTimestamp) /
                    60000)
                ).toPrecision(3)
              }}g/m
            </p>
          </div>
        </div>
      </div>

      <div class="result__match__team1">
        <div
          v-for="(player, playerIndex) of match.info?.participants"
          :key="playerIndex"
          class="div1"
        >
          <div v-if="playerIndex < 5" class="result__match__players1">
            <div class="result__match__players__player">
              <img
                class="result__match__players__player__image"
                :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${player?.championId}.png`"
              />
              <p
                v-if="player?.puuid === user.puuid"
                :style="'text-shadow: 1px 1px 2px black;'"
              >
                {{ player?.summonerName }}
              </p>
              <p v-else>
                <a :href="`/player/${region}/${player?.summonerName}`">{{
                  player?.summonerName
                }}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="result__match__team2">
        <div
          v-for="(player, playerIndex) of match.info?.participants"
          :key="playerIndex"
          class="div2"
        >
          <div v-if="playerIndex > 4" class="result__match__players2">
            <div class="result__match__players__player">
              <img
                class="result__match__players__player__image"
                :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${player?.championId}.png`"
              />
              <p
                v-if="player?.puuid === user.puuid"
                :style="'text-shadow: 1px 1px 2px black;'"
              >
                {{ player?.summonerName }}
              </p>
              <p v-else>
                <a :href="`/player/${region}/${player?.summonerName}`">{{
                  player?.summonerName
                }}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <button
        class="result__match__showmore"
        :style="
          win
            ? { 'background-color': 'darkgreen' }
            : { 'background-color': 'darkred' }
        "
        @click="openExtra = !openExtra"
      >
        <font-awesome-icon
          class="result__match__showmore__img"
          :icon="['fas', 'sort-down']"
        />
      </button>
    </div>
    <MatchExtra v-if="openExtra" :match="match" />
  </div>
</template>
<style scoped lang="scss">
.result {
  border: 1px solid black;
  background-color: #252525;
  border-radius: 5px;
  margin-left: 1rem;
  padding-left: 2rem;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;

  &__showmore {
    width: 50rem;
    margin-bottom: -2rem;
    background-color: #3d3d3d;
    border: none;
    margin-top: 1rem;
  }

  &__match {
    padding: 0.5rem;
    border-radius: 5px;
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 0.75fr 0.5fr 1fr 0.1fr 1fr 1fr 0.25fr;
    width: 50rem;
    &__showmore {
      border: none;
      text-align: center;
      margin: -0.5rem;
      border-radius: 5px;
      &__img {
        margin-top: 5rem;
      }
    }
    &__data {
      &:nth-child(n) p {
        margin-bottom: 0rem;
        padding: 0;
        font-size: 12px;
      }
    }

    &__extrastats {
      width: 5rem;
      font-size: 9px;
      font-weight: 700;
      &__vs {
        margin-top: 0.5rem;
      }
      &__cs {
        margin-top: -0.75rem;
      }
      &__kp {
        margin-top: -0.75rem;
      }
      &__gpm {
        margin-top: -0.75rem;
      }
    }

    &__stats {
      &__kda {
        font-weight: 700;
      }
      &__computedkda {
        font-size: 11px;
        margin-top: -1rem;
      }
      &__items {
        margin-top: 1rem;
        width: 1.25rem;
        height: 1.25rem;
      }

      &__itemsdiv1 {
        margin-top: -1rem;
      }

      &__itemsdiv2 {
        margin-top: -0.25rem;
      }
    }

    &__champion {
      display: flex;
      flex-direction: column;
      &__img {
        width: 3rem;
        height: 3rem;
      }
      &__summonerSpells {
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    &__players {
      &__player2 {
        min-width: 10rem;
        margin-bottom: -0.5rem;
        font-size: x-small;
      }

      &__player {
        display: flex;
        width: max-content;
        min-width: 10rem;
        margin-bottom: -1rem;
        font-size: 10px;

        &__image {
          margin-right: 0.5rem;
          width: 1rem;
          height: 1rem;
        }
      }
    }
  }
}
</style>
