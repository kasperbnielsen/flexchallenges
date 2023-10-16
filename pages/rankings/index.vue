<script setup lang="ts">
import { ref } from "vue";
const config = useRuntimeConfig();
const SERVER_HOST = config.public.SERVER_HOST;

const players = ref();
const region = ref("EUW1");
const indexing = ref(0);
const count = ref(0);

async function getRankings() {
  const data = await fetch(`${SERVER_HOST}/leagues/${region.value.toLowerCase()}`).then((res) => res.json());
  players.value = data;
}

watch(indexing, () => {
  console.log(indexing.value);
});

watch(count, () => {
  if (count.value < 0) count.value = 0;

  if (count.value > players.value.entries.length / 50) count.value = players.value.entries.length / 50 - 1;
});

await getRankings();

players.value.entries = players.value.entries.sort((a, b) => b.leaguePoints - a.leaguePoints);
</script>
<template>
  <div class="body">
    <div class="body__descriptions">
      <p>#</p>
      <p>Summoner Name</p>
      <p class="body__descriptions__lp">LP</p>
      <p>Most Played</p>
      <p>Win Rate</p>
    </div>
    <div v-if="players">
      <div v-for="indexing in 50" :key="indexing" class="body__players">
        <p>{{ indexing + count * 50 }}</p>
        <p>{{ players.entries[indexing + count * 50 - 1].summonerName }}</p>
        <p>{{ players.entries[indexing + count * 50 - 1].leaguePoints }}</p>
        <p>123</p>
        <p>
          {{
            (
              (players.entries[indexing + count * 50 - 1].losses / players.entries[indexing + count * 50 - 1].wins) *
              100
            ).toFixed(2)
          }}%
        </p>
      </div>
    </div>
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <button class="page-link" @click="count -= 1">Previous</button>
        </li>
        <li class="page-item">
          <button class="page-link" @click="count = count">
            {{ count <= 1 ? 1 : count }}
          </button>
        </li>
        <li class="page-item">
          <button class="page-link" @click="count = count + 1">
            {{ count <= 1 ? 2 : count + 1 }}
          </button>
        </li>
        <li class="page-item">
          <button class="page-link" @click="count = count + 2">
            {{ count <= 1 ? 3 : count + 2 }}
          </button>
        </li>
        <li class="page-item">
          <button class="page-link" @click="count += 1">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>
<style scoped lang="scss">
.body {
  margin: 3rem;
  border-radius: 5px;
  height: fit-content;
  background-color: #252525;
  &__descriptions {
    border-top-left-radius: 5px;
    border-top-left-radius: 5px;
    color: #414141;
    padding-left: 1rem;
    padding-top: 1.25rem;
    font-weight: 700;
    align-content: center;
    display: grid;
    grid-template-columns: 0.4fr 5fr 0.5fr 2fr 1fr;
    height: 3rem;
    background-color: #0e0e0e33;
    &__lp {
    }
  }
  &__players {
    color: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.226);
    padding-top: 1.25rem;
    padding-left: 1rem;
    display: grid;
    grid-template-columns: 0.4fr 5fr 0.5fr 2fr 1fr;
  }
}
.page-link {
  background-color: #252525;
  border-color: #414141;
  color: white;
}
.pagination {
  margin-top: 2rem;
  padding-bottom: 2rem;
}
</style>
