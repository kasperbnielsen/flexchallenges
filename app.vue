<template>
  <HeaderComp />
  <div>
    <NuxtPage />
  </div>
  <footer>
    <div>
      FlexChallenges isn't endorsed by Riot Games and doesn't reflect the views
      or opinions of Riot Games or anyone officially involved in producing or
      managing Riot Games properties. Riot Games, and all associated properties
      are trademarks or registered trademarks of Riot Games, Inc.
    </div>
  </footer>
</template>
<style>
* {
  margin: 0;
  padding: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  transition: 0.4s;
  line-height: 1.6;
  font-family: montserrat;

  &::before,
  &::after {
    margin: 0;
    padding: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 1.6;
  }
}
footer {
  font-size: x-small;
  font-weight: 300;
  text-align: center;
  padding: 3rem 0;
  background-color: #818181;
}
body,
html {
  scroll-behavior: smooth;
  font-family: sans-serif;
  height: 100%;
  padding-top: 0;
  width: 100%;
  min-height: 100vh;
}
button {
  cursor: pointer;
}
</style>
