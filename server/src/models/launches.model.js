const axios = require("axios");
const launchesDataBase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

// const launch = {
//   flightNumber: 100,
//   mission: "Kepler Exporation X",
//   rocket: "Explorer IS1",
//   launchDate: new Date("December 27, 2030"),
//   target: "Kepler-442 b",
//   customers: ["ZTM", "NASA"],
//   upcoming: true,
//   success: true,
// };

// saveLaunch(launch);

async function populateLaunches() {
  console.log("downloading launches data.......");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem Loading data..");
    throw new Error("Launch data download failed");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];

    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers: customers,
    };

    console.log(
      `SN : ${launch.flightNumber} Mission : ${launch.mission} Customers : ${launch.customers}`
    );

    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launch Data Already Exists....");
    return;
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launchesDataBase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDataBase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1 && aborted.matchedCount === 1;
}

async function saveLaunch(launch) {
  try {
    const filter = { flightNumber: launch.flightNumber };
    const update = launch;
    const options = { upsert: true };

    // Update or insert the document
    await launchesDataBase.findOneAndUpdate(filter, update, options);
  } catch (error) {
    throw error;
  }
}

async function getLatestFLightNumber() {
  const launchLatest = await launchesDataBase.findOne({}).sort("-flightNumber");
  if (!launchLatest) {
    return DEFAULT_FLIGHT_NUMBER;
  } else {
    return launchLatest.flightNumber;
  }
}

async function getAllLaunches(skip, limit) {
  return await launchesDataBase
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No Matching Planet Found");
  }
  const newFlightNumber = (await getLatestFLightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

module.exports = {
  getAllLaunches,
  loadLaunchesData,
  existsLaunchWithId,
  scheduleNewLaunch,
  abortLaunchById,
};
