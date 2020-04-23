const chemicalCollectionRaw = require("../data/chemical-dataset.json");

function getIncident({ id }) {
  console.log("hello, id is", id);
  const filtered = chemicalCollectionRaw.filter(obj => obj.id == id);
  return filtered;
}

module.exports = {
  get: getIncident
};
