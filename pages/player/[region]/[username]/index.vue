<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import MatchList from "~/components/match/MatchList.vue";

import { useModeStore } from "@/stores/player";
const config = useRuntimeConfig();

const { playerData, profileData } = storeToRefs(useModeStore());

const playerProfileData = ref();

const SERVER_HOST = config.public.SERVER_HOST;
const route = useRoute();
const router = useRouter();
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

async function showMore() {
  await fetchData(matchList.value.data.length / 10 + 1);
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

async function fetchData(matchLimit: number) {
  const fetchedData = await fetch(
    `${SERVER_HOST}/riot/player/${encodeData({
      data: myData.puuid,
      limit: matchLimit,
    })}`,
    {
      method: "get",
    }
  )
    .then((res) => {
      console.log(res);
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
  playerData.value = await fetchedData2;
}

fetchData(1).then(() => {
  getStats(myData.puuid, false);
});
</script>
<template>
  <div class="outerbody">
    <ProfileDiv />
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
              Ranked Solo
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
              Ranked Flex
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
              :class="statsIndex < 13 ? 'stats__div' : ''"
            >
              <div v-if="statsIndex < 13" class="stats__firstdiv">
                <img
                  :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${stats._id}.png`"
                  class="stats__firstdiv__img"
                />
              </div>
              <div v-if="statsIndex < 13" class="stats__secondsdiv">
                <p class="stats__secondsdiv__kda1">
                  {{
                    Math.ceil(
                      (stats.totalKills + stats.totalAssists) /
                        stats.totalDeaths
                    )
                      ? (
                          (stats.totalKills + stats.totalAssists) /
                          (stats.totalDeaths ? stats.totalDeaths : 1)
                        ).toFixed(2)
                      : "0.00"
                  }}
                  KDA
                </p>
                <p class="stats__secondsdiv__kda2">
                  {{ (stats.totalKills / stats.totalMatches).toFixed(1) }} /
                  {{ (stats.totalDeaths / stats.totalMatches).toFixed(1) }}
                  /
                  {{ (stats.totalAssists / stats.totalMatches).toFixed(1) }}
                </p>
              </div>
              <div v-if="statsIndex < 13" class="stats__thirddiv">
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
            <div class="stats__extra">
              <button
                class="stats__extra__button"
                @click="router.push(`${route.fullPath}champions/`)"
              >
                Show more + extra stats
              </button>
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
        <MatchList
          :matchList="matchList?.data"
          :winArr="winArr"
          :region="route.params.region.toString()"
          :user="myData"
        />
        <button class="result__showmore" @click="showMore()">
          <font-awesome-icon
            class="result__showmore__icon"
            :icon="['fas', 'caret-down']"
          />
        </button>
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
  background-color: #3d3d3d;
  border: none;
  color: black;
}

.outerbody {
  margin: 3rem;
}

.result {
  border: 1px solid black;
  background-color: #252525;
  border-radius: 5px;
  margin-left: 1rem;
  padding-left: 2rem;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
}

.body {
  background-color: inherit;
  display: grid;
  grid-template-columns: 1fr 2fr;
}

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
  background-color: #252525;
  border-radius: 5px;
  min-height: 36.25rem;
  height: fit-content;
  &__extra {
    margin-top: 3.375rem;
    padding: 0.5rem 0;
    background-color: #3d3d3d;
    text-align: center;
    &__button {
      border: none;
      background: none;
    }
  }

  &__navitem {
    padding-left: 2rem;
    padding-right: 2rem;
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
    position: absolute;
    text-align: center;
    margin-left: 22rem;

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

.bold {
}
</style>
