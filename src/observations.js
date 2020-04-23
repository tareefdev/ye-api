const R = require("ramda");
//const observationsFile = require("../data/observations.json");
const observations = require("../data/units.json");
const search = require("../src/search");
//const observations = observationsFile.data;
const searchObservations = search.search;

const isTruthy = R.pipe(Boolean, R.equals(true));

function isQueryEmpty({ title, location, dateBefore, dateAfter }) {
  const hasTitle = R.isEmpty(title);
  const hasLocation = R.isEmpty(location);
  const hasDateBefore = R.isEmpty(dateBefore);
  const hasDateAfter = R.isEmpty(dateAfter);
  return hasTitle && hasLocation && hasDateBefore && hasDateAfter;
}

function filterObservations({ title, location, dateBefore, dateAfter, lang }) {
  const hasTitle = R.isEmpty(title) ? "or" : "and";
  const hasLocation = R.isEmpty(location) ? "or" : "and";
  const otherOptions = { dateBefore, dateAfter, lang };
  const searchQuery = [
    {
      field: `annotations:online_title_${lang}`,
      query: title,
      bool: hasTitle
    },
    { field: "location", query: location, bool: hasLocation }
  ];
  return isQueryEmpty({ title, location, dateBefore, dateAfter })
    ? listObservations({ lang })
    : searchObservations(searchQuery, otherOptions);
}

const listObservations = () => observations;

module.exports = {
  filter: filterObservations,
  list: listObservations
};
