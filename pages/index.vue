<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
const currentRegion = ref<string>("EUW");
const username = ref("");

const router = useRouter();

const regionsList = ref([
  { name: "Europe West", region: "EUW" },
  { name: "North America", region: "NA" },
  { name: "Europe East", region: "EUNE" },
  { name: "Australia", region: "OCE" },
]);

async function search() {
  await router.push(
    `/player/${currentRegion.value.toLowerCase()}1/${username.value}/`
  );
  router.go(0);
}
</script>
<template>
  <div class="body bg-image">
    <video id="background-video" autoplay loop muted>
      <source src="background-video.webm" type="video/webm" />
    </video>
  </div>
  <div class="test">
    <button
      class="input__button dropdown-toggle"
      data-bs-toggle="dropdown"
      type="button"
    >
      {{ currentRegion }}
    </button>
    <ul class="dropdown-menu">
      <div v-for="(reg, regionIndex) of regionsList" :key="regionIndex">
        <li>
          <button
            class="dropdown-item"
            @click.prevent="currentRegion = reg.region"
          >
            {{ reg.name }}
          </button>
        </li>
      </div>
    </ul>
    <input
      v-model="username"
      aria-label="Text input with dropdown button"
      class="input"
      type="text"
      placeholder="Search for username"
      @keydown.enter="search"
    />
  </div>
</template>
<style scoped lang="scss">
.body {
  margin-left: -15rem;
}

.test {
  display: flex;
  justify-content: center;
}
.dropdown-menu {
  transition: none;
}
.input {
  display: flex;
  position: absolute;
  z-index: 1000;
  translate: 0 -70vh;
  width: 50rem;
  height: 3rem;
  padding: 0 1rem 0 1rem;
  border-radius: 20px;
  border: none;
  background: #494948;
  padding-left: 7rem;
  color: rgba(255, 255, 255, 0.575);
  font-weight: 700;
  &:focus {
    outline: none;
  }

  &__button {
    color: rgba(255, 255, 255, 0.575);
    display: flex;
    position: absolute;
    z-index: 1001;
    translate: -22rem -69.75vh;
    padding-left: 1.5rem;
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    padding-right: 1.5rem;
    background: transparent;
    width: 6rem;
    border: none;
    border-right: 2px solid black;
  }
}

#background-video {
  height: 100vh;
  width: 119rem;
  object-fit: fill;
  opacity: 0.5;
}
</style>
