const R = require("ramda");
var isBefore = require("date-fns/isBefore");
var isAfter = require("date-fns/isAfter");
const FlexSearch = require("flexsearch");
//const ObservationsFile = require("../data/observations.json");
const observations = require("../data/units.json");
// const arObservations = ObservationsFile.data.filter(
//   ({ lang }) => lang === "ar"
// );
// const enObservations = [...ObservationsFile.data].filter(
//   ({ lang }) => lang === "en"
// );

const units = observations.map(o => {
  if (o.clusters.locations) {
    o.location = R.join(" ", o.clusters.locations);
  } else {
    o.location = "غير محدد";
  }
  return o;
});

const arIndex = new FlexSearch({
  bencode: false,
  rtl: true,
  split: /\s+/,
  tokenize: "forward",
  doc: {
    id: "id",
    field: [
      "annotations:online_title_ar",
      "annotations:incident_date",
      "location"
    ]
  }
});

arIndex.add(units);

const enIndex = new FlexSearch({
  encode: "balance",
  tokenize: "forward",
  doc: {
    id: "id",
    field: [
      "annotations:online_title_en",
      "annotations:incident_date",
      "location"
    ]
  }
});

enIndex.add(units);

const isQueryEmpty = query => R.all(R.isEmpty)(query.map(obj => obj.query));

function localizeSearch(searchQuery, lang) {
  const isEn = lang === "en";
  return isQueryEmpty(searchQuery)
    ? units
    : isEn
    ? enIndex.search(searchQuery)
    : arIndex.search(searchQuery);
}

function filterbyDates(result, dateBefore, dateAfter) {
  const hasDateBefore = !R.isEmpty(dateBefore);
  const formatedDateBefore = new Date(dateBefore);
  const hasDateAfter = !R.isEmpty(dateAfter);
  const formatedDateAfter = new Date(dateAfter);
  let data = [...result];
  if (hasDateBefore) {
    data = data.filter(obj => {
      const date = new Date(obj.annotations.incident_date);
      return isBefore(date, formatedDateBefore);
    });
  }
  if (hasDateAfter) {
    data = data.filter(obj => {
      const date = new Date(obj.annotations.incident_date);
      return isAfter(date, formatedDateAfter);
    });
  }
  return data;
}

function searchObservations(searchQuery, otherOptions) {
  const { dateBefore, dateAfter, lang } = otherOptions;
  return filterbyDates(
    localizeSearch(searchQuery, lang),
    dateBefore,
    dateAfter
  );
}

module.exports = {
  search: searchObservations
};
