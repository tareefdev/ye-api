const chemicalCollectionRaw = require("../data/chemical-dataset.json");

function getIncident({ id }) {
  const filtered = chemicalCollectionRaw.filter(obj => obj.id == id);
  return filtered;
}

module.exports = {
  get: getIncident
};
