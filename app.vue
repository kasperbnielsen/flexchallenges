<template>
  <div class="body">
    <a v-if="false"
      class="banner1"
      href="https://metafy.gg?ref=ntrlnzn&campaign_name=tapfiliate&utm_source=website&utm_channel=affiliate&utm_medium=cpa&utm_campaign=paid_membership&utm_content=banner&market=mixed_markets&utm_campaign_id=968F9FB9&tap_a=130657-a837f7"
      rel="nofollow"
      target="_BLANK"
      ><img
        border="0"
        src="/metafy.jpeg"
    /></a>
    <a v-if="false"
      class="banner1 right"
      href="https://metafy.gg?ref=ntrlnzn&campaign_name=tapfiliate&utm_source=website&utm_channel=affiliate&utm_medium=cpa&utm_campaign=paid_membership&utm_content=banner&market=mixed_markets&utm_campaign_id=968F9FB9&tap_a=130657-a837f7"
      rel="nofollow"
      target="_BLANK"
      ><img
        border="0"
        src=/metafy.jpeg
    /></a>

    <div class="innerbody">
      <HeaderComp />
      <div>
        <NuxtPage />
      </div>
      <footer>
        <div class="footerdiv">
          FlexChallenges isn't endorsed by Riot Games and doesn't reflect the
          views or opinions of Riot Games or anyone officially involved in
          producing or managing Riot Games properties. Riot Games, and all
          associated properties are trademarks or registered trademarks of Riot
          Games, Inc.
          <p class="contact">
            For bussiness enquiries contact: Kasperboegvad@gmail.com
          </p>
        </div>
      </footer>
    </div>
  </div>
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

.body {
  background-color: black;
}

.right {
  right: 0;
}

.banner1 {
  display: flex;
  position: absolute;
  width: 15rem;
  height: 56.375rem;
}

.contact {
  padding-top: 0.5rem;
}

.innerbody {
  margin: 0 15rem;
  background-color: #242582;
}

footer {
  font-size: x-small;
  font-weight: 300;
  text-align: center;
  padding: 3rem 0 2.5rem 0;
  background-color: #2f2fa2;
  color: white;
}

.footerdiv {
  margin: 0 5rem;
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

input {
  color: black;
}
</style>
