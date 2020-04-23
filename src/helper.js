const OBSERVATIONS_PER_PAGE = 50; // return 50 observations in each page, so user doesn't resive a huge json respons.

function splitData(results, pageNumber) {
  const limit = OBSERVATIONS_PER_PAGE;
  const itemCount = results.length;
  const pageCount = Math.ceil(itemCount / limit);
  const page =
    (parseInt(pageNumber, 10) || 1) > pageCount
      ? pageCount
      : parseInt(pageNumber, 10) || 1;
  const from = page * limit - limit;
  const to = page * limit;
  const data = results.slice(from, to);
  return { page, pageCount, data };
}

module.exports = {
  splitData: splitData
};
