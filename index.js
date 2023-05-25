const axios = require("axios");
const errorsHandler = require("./utils/errors_handler");
const headers = require("./utils/headers.json");
const writeDataFile = require("./utils/writeDataFile");

const filePath = "./files/data.json";

const BASE_URL = "https://www.oreillyauto.com/";

async function main() {
  try {
    await typesHandler();
    //await yearsHandler(1)
    //await makesHandler(1)
    //await modelsHandler(1)
    // await submodelsHandler(1)
  } catch (error) {
    errorsHandler(error);
  }
}

async function typesHandler() {
  // types api endpoint
  const types_endpoint = BASE_URL + "vehicle/types";
  const field = "description";

  // fetch data from api
  const { data: types } = await axios.get(types_endpoint);

  // fetch prev file data
  const data = require(filePath);

  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    const typeName = type[field];

    // write received data to file
    data[type[field]] = {};
    writeDataFile(data, filePath);

    await yearsHandler({ type, typeName });
  }
}

async function yearsHandler({ type, typeName }) {
  // years api endpoint
  const years_endpoint = BASE_URL + "vehicle/years";

  // fetch data from api
  const payload = {
    typeId: type.id,
  };
  const { data: years } = await axios.post(years_endpoint, payload, {
    headers,
  });

  const data = require(filePath);

  for (let i = 0; i < years.length; i++) {
    const year = years[i];

    //write received data to file
    data[typeName][year] = {};
    writeDataFile(data, filePath);

    await makesHandler({ type, typeName, year });
  }

  console.log("years: ", years);
}

async function makesHandler({ type, typeName, year }) {
  // years api endpoint
  const makes_endpoint = BASE_URL + "vehicle/makes";
  const field = "name";

  // fetch data from api
  const payload = {
    typeId: type.id,
    year,
  };
  const { data: makes } = await axios.post(makes_endpoint, payload, {
    headers,
  });

  const data = require(filePath);

  for (let i = 0; i < makes.length; i++) {
    const make = makes[i];
    const makeName = make[field];

    // write received data to file
    data[typeName][year][makeName] = {};
    writeDataFile(data, filePath);

    await modelsHandler({ type, typeName, year, make, makeName });
  }

  console.log("makes: ", makes);
}

async function modelsHandler({ type, typeName, year, make, makeName }) {
  // models api endpoint
  const models_endpoint = BASE_URL + "vehicle/models";
  const field = "name";

  // fetch data from api
  const payload = {
    typeId: type.id,
    makeId: make.id,
    year: year,
  };
  const { data: models } = await axios.post(models_endpoint, payload, {
    headers,
  });

  const data = require(filePath);

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const modelName = model[field];

    // write received data to file
    data[typeName][year][makeName][modelName] = {};
    writeDataFile(data, filePath);

    await submodelsHandler({
      type,
      typeName,
      year,
      make,
      makeName,
      model,
      modelName,
    });
  }
  console.log("models: ", models);
}

async function submodelsHandler({
  type,
  typeName,
  year,
  make,
  makeName,
  model,
  modelName,
}) {
  // submodels api endpoint
  const submodels_endpoint = BASE_URL + "vehicle/submodels";
  const field = "name";

  // fetch data from api
  const payload = {
    typeId: type.id,
    makeId: make.id,
    modelId: model.id,
    year: year,
  };
  const { data: submodels } = await axios.post(submodels_endpoint, payload, {
    headers,
  });

  const data = require(filePath);

  const submodelsArr = [];

  for (let i = 0; i < submodels.length; i++) {
    const submodel = submodels[i];
    const submodelName = submodel[field];

    submodelsArr.push(submodelName);
  }
  // write received data to file
  data[typeName][year][makeName][modelName] = submodelsArr;
  writeDataFile(data, filePath);

  console.log("submodels: ", submodels);
}

main();
