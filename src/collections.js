const R = require("ramda");
const chemicalCollectionRaw = require("../data/chemical-dataset.json");
const observations = require("../data/units.json");
const russianCollection = [];

// How many observations in each unit
function calcUnits(id) {
  const units = observations.filter(o => {
    if (o.clusters.incidents) {
      return o.clusters.incidents[0] == id;
    } else {
      return false;
    }
  });
  return units.length;
}

// Clean up data
const chemicalCollection = chemicalCollectionRaw.filter(
  collection =>
    collection.incident_date_time != null &&
    collection.latitude != null &&
    collection.longitude != null
);

// add units count of each incident
const chCollectionWCalc = chemicalCollection.map(o => {
  o.units = calcUnits(o.id);
  return o;
});

// Sort incidents by units length
const finalChCollection = R.reverse(R.sortBy(o => o.units, chCollectionWCalc));

const units = observations.map(o => {
  if (o.clusters.incidents) {
    o.incident = R.join(" ", o.clusters.incidents);
  } else {
    o.incident = "Null";
  }
  return o;
});

function getChemicalIncidents({ id }) {
  return units.filter(unit => unit.incident === id);
}

function getCollection({ collection, lang }) {
  switch (collection) {
    case "chemical":
      return finalChCollection;
      break;
    case "russian":
      return russianCollection.filter(collection => collection.lang == lang);
      break;
    default:
      return [];
  }
}

module.exports = {
  get: getCollection,
  getCh: getChemicalIncidents
};
