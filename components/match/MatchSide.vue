<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useModeStore } from "~/stores/player";
const props = defineProps<{
  queue: number;
}>();
const statsData = ref<
  {
    _id: { championId: number };
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
    totalMatches: number;
    totalWins: number;
    totalCreeps: number;
    totalGold: number;
    totalDamageDealt: number;
    totalDamageTaken: number;
    totalStructureDamage: number;
    totalTime: number;
  }[]
>();
const config = useRuntimeConfig();
const SERVER_HOST = config.public.SERVER_HOST;
const router = useRouter();
const route = useRoute();
const { profileData } = storeToRefs(useModeStore());

async function getStats(refresh: boolean) {
  if (!profileData.value?.puuid.length) {
    return;
  }

  const url = refresh
    ? `${SERVER_HOST}/api/championstats/${profileData.value.puuid}?refresh=true`
    : `${SERVER_HOST}/api/championstats/${profileData.value.puuid}`;
  const data: {
    _id: { championId: number; gameMode: number };
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
    totalMatches: number;
    totalWins: number;
    totalCreeps: number;
    totalGold: number;
    totalDamageDealt: number;
    totalDamageTaken: number;
    totalStructureDamage: number;
    totalTime: number;
  }[] = await fetch(url, { method: "get" }).then((res) => res.json());

  if (props.queue === 420) {
    statsData.value = data.filter(
      (val: {
        _id: { championId: number; gameMode: number };
        totalKills: number;
        totalDeaths: number;
        totalAssists: number;
        totalMatches: number;
        totalWins: number;
        totalCreeps: number;
        totalGold: number;
        totalDamageDealt: number;
        totalDamageTaken: number;
        totalStructureDamage: number;
        totalTime: number;
      }) => val._id.gameMode === 420
    );
  } else if (props.queue === 440) {
    statsData.value = data.filter(
      (val: {
        _id: { championId: number; gameMode: number };
        totalKills: number;
        totalDeaths: number;
        totalAssists: number;
        totalMatches: number;
        totalWins: number;
        totalCreeps: number;
        totalGold: number;
        totalDamageDealt: number;
        totalDamageTaken: number;
        totalStructureDamage: number;
        totalTime: number;
      }) => val._id.gameMode === 440
    );
  } else if (props.queue === 400) {
    const newArr: {
      _id: { championId: number; gameMode: number };
      totalKills: number;
      totalDeaths: number;
      totalAssists: number;
      totalMatches: number;
      totalWins: number;
      totalCreeps: number;
      totalGold: number;
      totalDamageDealt: number;
      totalDamageTaken: number;
      totalStructureDamage: number;
      totalTime: number;
    }[] = [];
    data
      .filter((val) => val._id.gameMode === 420 || val._id.gameMode === 440)
      .forEach(
        (val: {
          _id: { championId: number; gameMode: number };
          totalKills: number;
          totalDeaths: number;
          totalAssists: number;
          totalMatches: number;
          totalWins: number;
          totalCreeps: number;
          totalGold: number;
          totalDamageDealt: number;
          totalDamageTaken: number;
          totalStructureDamage: number;
          totalTime: number;
        }) => {
          const ind = newArr.findIndex(
            (element) => element._id.championId === val._id.championId
          );
          if (ind !== -1) {
            newArr[ind] = {
              _id: {
                championId: val._id.championId,
                gameMode: val._id.gameMode,
              },
              totalKills: newArr[ind].totalKills + val.totalKills,
              totalDeaths: newArr[ind].totalDeaths + val.totalDeaths,
              totalAssists: newArr[ind].totalAssists + val.totalAssists,
              totalMatches: newArr[ind].totalMatches + val.totalMatches,
              totalWins: newArr[ind].totalWins + val.totalWins,
              totalCreeps: newArr[ind].totalCreeps + val.totalCreeps,
              totalGold: newArr[ind].totalGold + val.totalGold,
              totalDamageDealt:
                newArr[ind].totalDamageDealt + val.totalDamageDealt,
              totalDamageTaken:
                newArr[ind].totalDamageTaken + val.totalDamageTaken,
              totalStructureDamage:
                newArr[ind].totalStructureDamage + val.totalStructureDamage,
              totalTime: newArr[ind].totalTime + val.totalTime,
            };
          } else {
            newArr.push(val);
          }
        }
      );
    statsData.value = newArr;
  }

  return data;
}

getStats(true);
watch(profileData, () => {
  getStats(true);
});

watch(statsData, () => {
  console.log("hello stats");
});
</script>
<template>
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
            class="stats__firstdiv__img"
            :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${stats._id.championId}.png`"
          />
        </div>
        <div v-if="statsIndex < 13" class="stats__secondsdiv">
          <p class="stats__secondsdiv__kda1">
            {{
              Math.ceil(
                (stats.totalKills + stats.totalAssists) / stats.totalDeaths
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
                ? ((stats.totalWins / stats.totalMatches) * 100).toFixed(0)
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
          @click="router.push(`${route.fullPath}/champions/`)"
        >
          Show more + extra stats
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
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
</style>
