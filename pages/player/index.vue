<script lang="ts" setup>
import { Buffer as BufferPolyfill } from "buffer";
import { useRoute } from "vue-router";
declare let Buffer: typeof BufferPolyfill;
globalThis.Buffer = BufferPolyfill;
const config = useRuntimeConfig();

const playerProfileData = ref();

const SERVER_HOST = config.public.SERVER_HOST;
const route = useRoute();
const matchList = ref();

function encodeData(list: {}) {
  const stringified = JSON.stringify(list);

  const base64Filter = btoa(stringified);

  if (base64Filter.endsWith("=")) return base64Filter.replace(/=/g, "");

  return base64Filter;
}

function decode(input: string) {
  const padded = input.padEnd(input.length + (4 - (input.length % 4)), "=");

  const json = Buffer.from(padded, "base64").toString();
  return JSON.parse(json);
}

const myData: { name: string; puuid: string } = decode(
  Object.keys(route.query)[0]
);

watch(matchList, () => {
  console.log("updated matchlist");
});

const profileData = ref<{
  name: string;
  puuid: string;
  profileIcon: number;
  summonerId: string;
}>();

const winArr = ref<Array<boolean>>([]);

async function fetchData() {
  const fetchedData = await fetch(
    `${SERVER_HOST}/riot/player/${encodeData({ data: myData.puuid })}`,
    {
      method: "get",
    }
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));

  matchList.value = fetchedData;
  for (let i = 0; i < matchList.value.data[0].info.participants.length; i++) {
    if (matchList.value.data[0].info.participants[i].puuid === myData.puuid) {
      const profile = matchList.value.data[0].info.participants[i];
      profileData.value = {
        name: profile.summonerName,
        puuid: profile.puuid,
        profileIcon: profile.profileIcon,
        summonerId: profile.summonerId,
      };
    }
  }

  for (let i = 0; i < matchList.value.data.length; i++) {
    for (let j = 0; j < matchList.value.data[i].info.participants.length; j++) {
      if (matchList.value.data[i].info.participants[j].puuid === myData.puuid)
        winArr.value.push(matchList.value.data[i].info.participants[j].win);
    }
  }

  const fetchedData2 = await fetch(
    `${SERVER_HOST}/riot/profile/${encodeData({
      id: profileData.value?.summonerId,
    })}`,
    { method: "GET" }
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));

  playerProfileData.value = fetchedData2;
}

await fetchData();
</script>
<template>
  <div class="outerbody">
    <div class="profile">
      <img
        class="profile__image"
        :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${profileData?.profileIcon}.jpg`"
      />

      <p class="profile__username">{{ profileData?.name }}</p>
      <div v-for="(type, typeIndex) of playerProfileData.data" :key="typeIndex">
        <div
          v-if="type.queueType !== 'RANKED_TFT_DOUBLE_UP'"
          class="profile__rank__flexqueue"
        >
          <img
            class="profile__rank__image"
            :src="`https://raw.communitydragon.org/13.19/plugins/rcp-fe-lol-shared-components/global/default/${playerProfileData.data[
              typeIndex
            ].tier.toLowerCase()}.png`"
          />
          <div class="profile__rank__textdiv">
            <p class="profile__rank__flexqueue__title">
              {{
                playerProfileData.data[typeIndex].queueType === "RANKED_FLEX_SR"
                  ? "Flex queue"
                  : "Solo queue"
              }}
            </p>
            <p class="profile__rank__text">
              {{ playerProfileData.data[typeIndex].tier }}
              {{ playerProfileData.data[typeIndex].rank }}
            </p>
            <p class="profile__rank__undertext">
              {{ playerProfileData.data[typeIndex].leaguePoints }} LP
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="stats">
        <nav>
          <div id="nav-tab" class="nav nav-tabs" role="tablist">
            <button
              id="nav-home-tab"
              aria-controls="nav-home"
              aria-selected="true"
              class="nav-link active"
              data-bs-target="#nav-home"
              data-bs-toggle="tab"
              role="tab"
              type="button"
            >
              Total
            </button>
            <button
              id="nav-profile-tab"
              aria-controls="nav-profile"
              aria-selected="false"
              class="nav-link"
              data-bs-target="#nav-profile"
              data-bs-toggle="tab"
              role="tab"
              type="button"
            >
              Ranked Solo/duo
            </button>
            <button
              id="nav-contact-tab"
              aria-controls="nav-contact"
              aria-selected="false"
              class="nav-link"
              data-bs-target="#nav-contact"
              data-bs-toggle="tab"
              role="tab"
              type="button"
            >
              Ranked flex
            </button>
          </div>
        </nav>
        <div id="nav-tabContent" class="tab-content">
          <div
            id="nav-home"
            aria-labelledby="nav-home-tab"
            class="tab-pane fade show active"
            role="tabpanel"
          >
            ...
          </div>
          <div
            id="nav-profile"
            aria-labelledby="nav-profile-tab"
            class="tab-pane fade"
            role="tabpanel"
          >
            ...
          </div>
          <div
            id="nav-contact"
            aria-labelledby="nav-contact-tab"
            class="tab-pane fade"
            role="tabpanel"
          >
            ...
          </div>
        </div>
      </div>
      <div v-if="matchList" class="result">
        <div
          v-for="(match, matchIndex) of matchList.data"
          :key="matchIndex"
          class="result__match"
          :style="
            winArr[matchIndex]
              ? { 'background-color': 'green' }
              : { 'background-color': 'red' }
          "
        >
          <div class="result__match__data">
            <div
              v-for="(participant, index) of matchList.data[matchIndex].info
                .participants"
              :key="index"
            >
              <p v-if="participant.puuid === myData.puuid">
                {{
                  match.info.queueId === 440
                    ? "Ranked Flex"
                    : match.info.queueId === 420
                    ? "Ranked Solo"
                    : "Unranked"
                }}
              </p>
              <p v-if="participant.puuid === myData.puuid">3 days ago</p>
              <p v-if="participant.puuid === myData.puuid">
                {{ winArr[matchIndex] ? "Win" : "Loss" }}
              </p>
              <p v-if="participant.puuid === myData.puuid">
                {{
                  Math.floor(
                    (match.info.gameEndTimestamp -
                      match.info.gameStartTimestamp) /
                      60000
                  ) +
                  "m " +
                  ((match.info.gameEndTimestamp -
                    match.info.gameStartTimestamp) %
                    60) +
                  "s"
                }}
              </p>
            </div>
          </div>

          <div>
            <div
              v-for="(participant, index) of matchList.data[matchIndex].info
                .participants"
              :key="index"
              class="result__match__champion"
            >
              <img
                v-if="participant.puuid === myData.puuid"
                :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${participant.championId}.png`"
                class="result__match__champion__img"
              />
              <div v-if="participant.puuid === myData.puuid">
                <img
                  :src="
                    participant.summoner1Id === 4
                      ? `https://raw.communitydragon.org/latest/game/data/spells/icons2d/summoner_flash.png`
                      : 'https://raw.communitydragon.org/latest/game/data/spells/icons2d/summoner_teleport.png'
                  "
                  class="result__match__champion__summonerSpells"
                />
                <img
                  :src="
                    participant.summoner1Id !== 4
                      ? `https://raw.communitydragon.org/latest/game/data/spells/icons2d/summoner_flash.png`
                      : 'https://raw.communitydragon.org/latest/game/data/spells/icons2d/summoner_teleport.png'
                  "
                  class="result__match__champion__summonerSpells"
                />
              </div>
            </div>
          </div>

          <div class="result__match__team1">
            <div
              v-for="(player, playerIndex) of matchList.data[matchIndex].info
                .participants"
              :key="playerIndex"
              class="div1"
            >
              <div
                v-if="
                  matchList.data[matchIndex].info.gameVersion.substr(0, 2) ===
                    '13' && playerIndex < 5
                "
                class="result__match__players1"
              >
                <div class="result__match__players__player">
                  <img
                    class="result__match__players__player__image"
                    :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${player.championId}.png`"
                  />
                  <p>
                    {{ player.summonerName }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="result__match__team2">
            <div
              v-for="(player, playerIndex) of matchList.data[matchIndex].info
                .participants"
              :key="playerIndex"
              class="div2"
            >
              <div
                v-if="
                  matchList.data[matchIndex].info.gameVersion.substr(0, 2) ===
                    '13' && playerIndex > 4
                "
                class="result__match__players2"
              >
                <div class="result__match__players__player">
                  <img
                    class="result__match__players__player__image"
                    :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${player.championId}.png`"
                  />
                  <p>
                    {{ player.summonerName }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
* {
  color: white;
  font-family: Montserrat;
}

.outerbody {
  margin: 3rem;
}

.body {
  background-color: inherit;
  display: grid;
  grid-template-columns: 1fr 2fr;
}

.profile {
  border: 1px solid black;
  background-color: #25353b;
  border-radius: 5px;
  display: flex;
  padding: 1rem;
  margin-bottom: 1rem;
  flex-direction: row;
  &__username {
    margin-top: 2rem;
    margin-left: 3rem;
    font-size: 28px;
    font-weight: 700;
  }

  &__rank {
    &__flexqueue {
      display: flex;
      margin-left: 4rem;

      &__title {
        margin-left: 1rem;
        margin-top: 1rem;
        text-align: center;
      }
    }
    &__image {
      width: 7rem;
      height: 7rem;
      margin-left: 10rem;
    }

    &__image2 {
      width: 7rem;
      height: 7rem;
    }

    &__textdiv {
      text-align: center;
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

.stats {
  border: 1px solid black;
  background-color: #25353b;
  border-radius: 5px;
}

* {
  --new-var: red;
}
.result {
  border: 1px solid black;
  background-color: #25353b;
  border-radius: 5px;
  margin-left: 1rem;
  padding-left: 2rem;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;

  &__match {
    padding: 1rem;
    background-color: var(--new-var);
    border-radius: 5px;
    margin-top: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    width: max-content;
    &__data {
      &:nth-child(n) p {
        margin-bottom: 0rem;
        padding: 0;
      }
    }

    &__champion {
      display: flex;
      flex-direction: column;
      &__img {
        width: 5rem;
        height: 5rem;
      }
      &__summonerSpells {
        width: 2.5rem;
        height: 2.5rem;
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
        margin-bottom: -0.5rem;
        font-size: x-small;

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
