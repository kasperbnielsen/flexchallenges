<script lang="ts" setup>
import { useRoute } from "vue-router";
import items from "~/assets/items";
import spells from "~/assets/summonerSpells";
const config = useRuntimeConfig();

const playerProfileData = ref();

const SERVER_HOST = config.public.SERVER_HOST;
const route = useRoute();
const matchList = ref();
const rateLimit = ref(false);

watch(rateLimit, () => {
  if (rateLimit.value) {
    setTimeout(() => {
      rateLimit.value = false;
    }, 120000);
  }
});

function encodeData(list: {}) {
  const stringified = JSON.stringify(list);

  const base64Filter = btoa(stringified);

  if (base64Filter.endsWith("=")) return base64Filter.replace(/=/g, "");

  return base64Filter;
}

const url = `${SERVER_HOST}/riot/id/${route.params.region}/${route.params.username}`;
const id = await fetch(url, { method: "GET" })
  .then((res) => res.json())
  .catch((err) => console.error(err));

const myData: { name: string; puuid: string } = {
  name: route.params.username.toString(),
  puuid: id.puuid.toString(),
};

console.log(route.params.username.toString(), id.puuid);

const profileData = ref<{
  name: string;
  puuid: string;
  profileIcon: number;
  summonerId: string;
  summonerLevel: number;
}>();

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

const statsData = ref();

async function getStats(puuid: string, refresh: boolean) {
  const url = refresh
    ? `${SERVER_HOST}/api/championstats/${puuid}?refresh=true`
    : `${SERVER_HOST}/api/championstats/${puuid}`;
  const data = await fetch(url, { method: "get" }).then((res) => res.json());
  statsData.value = data;
  return data;
}

watch(statsData, () => {
  console.log("hello stats");
});

const winArr = ref<Array<boolean>>([]);

async function fetchData() {
  const fetchedData = await fetch(
    `${SERVER_HOST}/riot/player/${encodeData({ data: myData.puuid })}`,
    {
      method: "get",
    }
  )
    .then((res) => {
      rateLimit.value = res.status === 429;
      if (res.status === 429) console.log("Ratelimit reached!");
      else if (res.ok) return res.json();
      else throw new Error("no matches");
    })
    .catch((err) => console.error(err));

  matchList.value = await fetchedData;

  if (matchList.value.data.length !== 0) {
    for (let i = 0; i < matchList.value.data[0].info.participants.length; i++) {
      if (matchList.value.data[0].info.participants[i].puuid === myData.puuid) {
        const profile = matchList.value.data[0].info.participants[i];
        profileData.value = {
          name: profile.summonerName,
          puuid: profile.puuid,
          profileIcon: profile.profileIcon,
          summonerId: profile.summonerId,
          summonerLevel: profile.summonerLevel,
        };
      }
    }

    for (let i = 0; i < matchList.value.data.length; i++) {
      for (
        let j = 0;
        j < matchList.value.data[i].info.participants.length;
        j++
      ) {
        if (matchList.value.data[i].info.participants[j].puuid === myData.puuid)
          winArr.value.push(matchList.value.data[i].info.participants[j].win);
      }
    }
  } else {
    matchList.value = [];
  }

  const fetchedData2 = await fetch(
    `${SERVER_HOST}/riot/profile/${encodeData({
      id: profileData.value?.summonerId,
    })}`,
    { method: "GET" }
  )
    .then((response) => {
      rateLimit.value = response.status === 429;
      if (response.status === 429) console.log("Ratelimit reached!");
      else if (response.ok) return response.json();
    })
    .catch((err) => console.error(err));

  playerProfileData.value = fetchedData2;
}

fetchData().then(() => {
  getStats(myData.puuid, false);
});
</script>
<template>
  <div class="outerbody">
    <div class="profile">
      <img
        class="profile__image"
        :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${profileData?.profileIcon}.jpg`"
      />
      <p class="profile__level">{{ profileData?.summonerLevel }}</p>
      <div>
        <p class="profile__username">{{ profileData?.name }}</p>
        <button
          class="btn btn-primary profile__button"
          @click="getStats(myData.puuid, true)"
        >
          Refresh
        </button>
      </div>
      <div
        v-for="(type, typeIndex) of playerProfileData?.data"
        :key="typeIndex"
      >
        <div
          v-if="type?.queueType !== 'RANKED_TFT_DOUBLE_UP'"
          class="profile__rank__flexqueue"
        >
          <img
            class="profile__rank__image"
            :src="`https://raw.communitydragon.org/13.19/plugins/rcp-fe-lol-shared-components/global/default/${playerProfileData.data[
              typeIndex
            ]?.tier.toLowerCase()}.png`"
          />
          <div class="profile__rank__textdiv">
            <p class="profile__rank__flexqueue__title">
              {{
                playerProfileData?.data[typeIndex]?.queueType ===
                "RANKED_FLEX_SR"
                  ? "Ranked Flex"
                  : "Ranked Solo"
              }}
            </p>
            <p class="profile__rank__text">
              {{ playerProfileData?.data[typeIndex]?.tier }}
              {{ playerProfileData?.data[typeIndex]?.rank }}
            </p>
            <p class="profile__rank__undertext">
              {{ playerProfileData?.data[typeIndex]?.leaguePoints }} LP
            </p>
          </div>
          <div class="profile__rank__winrate">
            <p>
              {{ playerProfileData?.data[typeIndex]?.wins }}W
              {{ playerProfileData?.data[typeIndex]?.losses }}L
            </p>
            <p>
              {{
                (
                  (playerProfileData?.data[typeIndex]?.wins /
                    (playerProfileData?.data[typeIndex]?.wins +
                      playerProfileData?.data[typeIndex]?.losses)) *
                  100
                ).toPrecision(4)
              }}% Win Rate
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
              class="nav-link active stats__navitem"
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
              class="nav-link stats__navitem"
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
              class="nav-link stats__navitem"
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
            <div
              v-for="(stats, statsIndex) of statsData"
              :key="statsIndex"
              class="stats__div"
            >
              <div class="stats__firstdiv">
                <img
                  :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${stats._id}.png`"
                  class="stats__firstdiv__img"
                />
              </div>
              <div class="stats__secondsdiv">
                <p class="stats__secondsdiv__kda1">
                  {{
                    Math.floor(
                      (stats.totalKills + stats.totalAssists) /
                        stats.totalDeaths
                    )
                      ? (
                          (stats.totalKills + stats.totalAssists) /
                          stats.totalDeaths
                        ).toPrecision(3)
                      : "0.00"
                  }}
                  KDA
                </p>
                <p class="stats__secondsdiv__kda2">
                  {{ (stats.totalKills / stats.totalMatches).toFixed(1) }} /
                  {{ (stats.totalAssists / stats.totalMatches).toFixed(1) }}
                  /
                  {{ (stats.totalDeaths / stats.totalMatches).toFixed(1) }}
                </p>
              </div>
              <div class="stats__thirddiv">
                <p class="stats__thirddiv__winrate">
                  {{
                    stats.totalWins
                      ? ((stats.totalWins / stats.totalMatches) * 100).toFixed(
                          0
                        )
                      : 0
                  }}%
                </p>
                <p class="stats__thirddiv__totalgames">
                  {{ stats.totalMatches }} Matches
                </p>
              </div>
            </div>
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
      <div v-if="matchList?.data" class="result">
        <div
          v-for="(match, matchIndex) of matchList?.data"
          :key="matchIndex"
          class="result__match"
          :style="
            winArr[matchIndex]
              ? { 'background-color': '#4F7942' }
              : { 'background-color': '#6D071A' }
          "
        >
          <div class="result__match__data">
            <div
              v-for="(participant, index) of matchList?.data[matchIndex]?.info
                ?.participants"
              :key="index"
            >
              <p v-if="participant?.puuid === myData.puuid">
                {{
                  match?.info?.queueId === 440
                    ? "Ranked Flex"
                    : match?.info?.queueId === 420
                    ? "Ranked Solo"
                    : "Unranked"
                }}
              </p>
              <p v-if="participant?.puuid === myData.puuid">
                {{
                  new Date(match?.info?.gameStartTimestamp)
                    .toString()
                    .substr(3, 8)
                }}
              </p>
              <p v-if="participant?.puuid === myData.puuid">
                {{ winArr[matchIndex] ? "Win" : "Loss" }}
              </p>
              <p v-if="participant?.puuid === myData.puuid">
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
              v-for="(participant, index) of matchList?.data[matchIndex]?.info
                ?.participants"
              :key="index"
              class="result__match__champion"
            >
              <img
                v-if="participant?.puuid === myData.puuid"
                :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${participant?.championId}.png`"
                class="result__match__champion__img"
              />
              <div v-if="participant?.puuid === myData.puuid">
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
              v-for="(participant, index) of matchList?.data[matchIndex]?.info
                ?.participants"
              :key="index"
            >
              <p
                v-if="participant?.puuid === myData.puuid"
                class="result__match__stats__kda"
              >
                <span>{{ participant?.kills }}</span>
                <span style="color: darkgrey">/</span>
                <span style="color: darkred">{{ participant?.deaths }}</span>
                <span style="color: darkgrey">/</span>
                <span>{{ participant?.assists }}</span>
              </p>

              <p
                v-if="participant?.puuid === myData.puuid"
                class="result__match__stats__computedkda"
              >
                {{
                  (
                    (participant?.kills + participant?.assists) /
                    participant?.deaths
                  ).toPrecision(3)
                }}
                KDA
              </p>
              <div
                v-if="participant?.puuid === myData.puuid"
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
              v-for="(participant, index) of matchList?.data[matchIndex]?.info
                ?.participants"
              :key="index"
            >
              <div v-if="participant?.puuid === myData.puuid">
                <p class="result__match__extrastats__vs">
                  VS {{ participant?.visionScore }}
                </p>
                <p class="result__match__extrastats__cs">
                  CS {{ participant?.totalMinionsKilled }}
                </p>
                <p class="result__match__extrastats__kp">
                  KP
                  {{
                    (
                      participant?.challenges?.killParticipation * 100
                    ).toPrecision(3)
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
              v-for="(player, playerIndex) of matchList?.data[matchIndex]?.info
                ?.participants"
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
                    v-if="player?.puuid === myData.puuid"
                    :style="'text-shadow: 1px 1px 2px black;'"
                  >
                    {{ player?.summonerName }}
                  </p>
                  <p v-else>
                    {{ player?.summonerName }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="result__match__team2">
            <div
              v-for="(player, playerIndex) of matchList?.data[matchIndex]?.info
                ?.participants"
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
                    v-if="player?.puuid === myData.puuid"
                    :style="'text-shadow: 1px 1px 2px black;'"
                  >
                    {{ player?.summonerName }}
                  </p>
                  <p v-else>
                    {{ player?.summonerName }}
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
.nav {
  border-bottom-color: black;
}

.nav-tabs .nav-item.show .nav-link,
.nav-tabs .nav-link.active {
  background-color: #25353b;
  border-color: black;
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
  &__level {
    background-color: black;
    height: fit-content;
    position: absolute;
    translate: 5.25rem 5.375rem;
    border-radius: 5px;
  }
  &__button {
    margin-left: 3rem;
    &:focus {
      box-shadow: none !important;
      outline: none !important;
    }
  }
  &__username {
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

.stats {
  border: 1px solid black;
  background-color: #25353b;
  border-radius: 5px;
  min-height: 36.25rem;
  height: fit-content;

  &__navitem {
    border-bottom-color: black;
    &:hover {
      border-color: black;
    }
  }

  &__div {
    margin: 1rem 0 1rem 0;
    display: flex;
    border-bottom: 1px solid black;
  }

  &__firstdiv {
    &__img {
      margin-left: 2rem;
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 35px;
      margin-bottom: 1rem;
      margin-right: 5rem;
    }
  }

  &__secondsdiv {
    text-align: center;
    &__kda2 {
      color: grey;
      font-size: 8px;
      margin-top: -0.5rem;
    }
    &__kda1 {
      margin-top: 0.25rem;
      color: #a6a6a7;
      font-size: 14px;
      font-weight: 700;
    }
  }

  &__thirddiv {
    margin-left: 8rem;
    text-align: center;

    &__winrate {
      margin-top: 0.25rem;
      color: #a6a6a7;
      font-size: 14px;
    }

    &__totalgames {
      color: grey;
      font-size: 10px;
      margin-top: -0.5rem;
    }
  }
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
    padding: 0.5rem;
    border-radius: 5px;
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 0.75fr 0.5fr 1fr 0.1fr 1fr 1fr;
    width: 50rem;
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

.bold {
}
</style>
