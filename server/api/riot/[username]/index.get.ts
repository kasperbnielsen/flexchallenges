import axios, { Axios, all, type AxiosResponse } from "axios";

type Mastery = Array<{
  championId: number;
  championLevel: number;
  championPoints: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  chestGranted: boolean;
  lastPlayTime: number;
  puuid: string;
  summonerId: string;
  tokensEarned: number;
}>;

const APIKEY = "RGAPI-559a75b2-6333-4572-b1ae-874b853e433d";

async function getMastery(puuid: number, apiKey: string) {
  const url =
    "https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/" +
    puuid +
    "?api_key=" +
    apiKey;
  let res = await fetch(url, {method: 'GET'}).then((response) => {
    return response;
  });

  return await res.json();
}

async function getId(username: string, apiKey: string) {
  const url =
    "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
    username +
    "?api_key=" +
    apiKey;
  let resp = await fetch(url, {method: 'GET'}).then((response) => {
    return response;
  })
  return await resp.json();
}

export default defineCachedEventHandler(async (event) => {
  if (!event?.context?.params?.username) {
    return;
  }
  const tempName = decodeURI(event.context.params.username);
  let id = await getId(tempName, APIKEY);
  console.log("ID =                                   " + id);
  let mastery = await getMastery(id.puuid, APIKEY);
  return mastery;
});
