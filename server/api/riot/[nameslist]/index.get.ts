import { Redis } from "ioredis";
import { MongoClient } from "mongodb";
import champions from "~/assets/champions";

const runtimeConfig = useRuntimeConfig();

const APIKEY = runtimeConfig.API_KEY;
const REDISHOST = runtimeConfig.REDIS_HOST;
//const MONGODBHOST = runtimeConfig.MONGODB_HOST;

//const databaseClient = new MongoClient(MONGODBHOST);
const client = new Redis(REDISHOST);
//const connection = databaseClient.connect().then((c) => c.db("flexchallenges"));

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

function getChampions(region: string[]) {
  const champList = new Set<string>();

  while (champList.size < 5) {
    const n = Math.floor(Math.random() * region.length);
    champList.add(region[n]);
  }
  return Array.from(champList);
}

function getEasyChampions(region: string[]) {
  const champList = new Set<string>();
  const roles = [
    champions.bot,
    champions.support,
    champions.jungler,
    champions.mid,
    champions.top,
  ];
  for (let j = 0; j < 5; j++) {
    const shuffledArray = Object.keys(region).sort(() => 0.5 - Math.random());
    for (let k = 0; k < region.length; k++) {
      if (roles[j].includes(region[+shuffledArray[k]])) {
        champList.add(region[+shuffledArray[k]]);
        break;
      }
    }
  }
  while (champList.size < 5) {
    champList.add(region[Math.floor(Math.random() * region[0].length)]);
  }

  console.log(champList);
  return Array.from(champList);
}

function getPlayerMastery(champs: Mastery, champList: string[]) {
  const playerMasteries: number[] = [1, 1, 1, 1, 1];
  for (let i = 0; i < champList.length; i++) {
    for (let j = 0; j < champs.length; j++) {
      if (champs[j].championId.toString() === champList[i]) {
        playerMasteries[i] = champs[j].championPoints;
      }
    }
  }
  return playerMasteries;
}

let random: number;

function getKeys(championList: string[]) {
  const keyList: string[] = [];
  championList.forEach((element) => {
    if (champions.champions.hasOwnProperty(element)) {
      keyList.push(
        champions.champions[element as keyof typeof champions.champions]
      );
    }
  });
  return keyList;
}

function decode(input: string) {
  const padded = input.padEnd(input.length + (4 - (input.length % 4)), "=");

  const json = Buffer.from(padded, "base64").toString();
  return JSON.parse(json);
}

function getMax(arr: number[]) {
  let tempMax = 0;
  arr.forEach((element) => {
    if (element > tempMax) {
      tempMax = element;
    }
  });
  return tempMax;
}

// Returns which index point[index], contains the biggest number
function getHighest(points: number[][]) {
  let maximum = 0;
  let index = 0;
  points.forEach((element, i) => {
    const temp = getMax(element);
    if (maximum < temp) {
      maximum = temp;
      index = i;
    }
  });
  return index;
}

async function getMastery(puuid: string, apiKey: string) {
  const url = `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}?api_key=${apiKey}`;
  return await fetch(url, { method: "GET" })
    .then((res) => {
      console.log("fetch mastery");
      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getId(username: string, apiKey: string, region: string) {
  const url = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`;
  /* const collection = (await connection).collection<{
    username: string;
    puuid: string;
    region: string;
  }>("puuid");
  const user = await collection.findOne({ username, region });
  if (user) {
    return user;
  } */
  const data = await fetch(url, { method: "GET" }).then((response) => {
    console.log("fetch id");
    return response.json();
  });
  if (data?.status?.status_code === 429) {
    throw new Error("Ratelimit reached");
  }

  /* return collection.findOneAndUpdate(
    { username, region },
    {
      $set: {
        ...data,
        username,
        region,
      },
    },
    { upsert: true, returnDocument: "after" }
  ); */
  return data;
}

export default defineEventHandler(async (event) => {
  if (!event?.context?.params?.nameslist) {
    return;
  }

  const names: {
    list: string[];
    options: string[];
    isRegions: boolean;
    easyMode: boolean;
    serverRegion: string;
  } = decode(event?.context?.params?.nameslist);
  let region: string[];

  names.list = names.list.map((e) => e.toLowerCase().trim());

  console.log(names.easyMode ? "true" : "false");
  const randomRegion = Math.floor(Math.random() * names.options.length);

  if (names.options.length === 0) {
    region = names.isRegions
      ? champions.regionsList[randomRegion]
      : champions.teamCompsList[randomRegion];
  } else {
    region = names.isRegions
      ? // @ts-expect-error Shitty type
        champions.regions[names.options[randomRegion]]
      : // @ts-expect-error Shitty type
        champions.teamComps[names.options[randomRegion]];
  }

  const champs = names.easyMode
    ? getEasyChampions(region)
    : getChampions(region);

  const keys = getKeys(champs);

  const masteryPoints: Array<Array<number>> = [];

  const hash = new Map<string, string>();

  for (const name of names.list) {
    const id = await getId(name, APIKEY, names.serverRegion);
    if (id === "") {
      setResponseStatus(event, 429);
    }
    const mastery = await getMastery(id?.puuid, APIKEY);

    for (let i = 0; i < mastery.length; i++) {
      hash.set(mastery[i].championId, mastery[i].championPoints.toString());
    }
    await client.set(name, hash);
    const playerMastery = getPlayerMastery(mastery, keys);
    masteryPoints.push(playerMastery);
  }
  console.log(masteryPoints);

  const newChampList = [];
  const orderList = [];
  const assignedChamps = [];

  for (let i = 0; i < 5; i++) {
    const indexOfPlayer = getHighest(masteryPoints);
    const indexOfChampion = masteryPoints[indexOfPlayer].findIndex(
      (element) => element === getMax(masteryPoints[indexOfPlayer])
    );

    assignedChamps[indexOfPlayer] = keys[indexOfChampion];
    newChampList[indexOfPlayer] = champs[indexOfChampion];
    orderList[indexOfPlayer] = indexOfChampion;

    masteryPoints[indexOfPlayer] = [0, 0, 0, 0, 0];

    for (let j = 0; j < 5; j++) {
      masteryPoints[j][indexOfChampion] = 0;
    }
  }

  const myObject2 = {
    players: {
      player1: {
        name: names.list[0],
        assignedChamp: assignedChamps[0],
        key: newChampList[0],
      },
      player2: {
        name: names.list[1],
        assignedChamp: assignedChamps[1],
        key: newChampList[1],
      },
      player3: {
        name: names.list[2],
        assignedChamp: assignedChamps[2],
        key: newChampList[2],
      },
      player4: {
        name: names.list[3],
        assignedChamp: assignedChamps[3],
        key: newChampList[3],
      },
      player5: {
        name: names.list[4],
        assignedChamp: assignedChamps[4],
        key: newChampList[4],
      },
    },
    region: names.options[randomRegion],
    order: orderList,
  };

  return myObject2;
});
