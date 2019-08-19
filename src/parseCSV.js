const csv = require("csvtojson");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");

Promise.all([
  csv({
    output: "json"
  }).fromFile(path.resolve(__dirname, "./2014_lloguer_preu_trim.csv")),
  csv({
    output: "json"
  }).fromFile(path.resolve(__dirname, "./2015_lloguer_preu_trim.csv")),
  csv({
    output: "json"
  }).fromFile(path.resolve(__dirname, "./2016_lloguer_preu_trim.csv")),
  csv({
    output: "json"
  }).fromFile(path.resolve(__dirname, "./2017_lloguer_preu_trim.csv")),
  csv({
    output: "json"
  }).fromFile(path.resolve(__dirname, "./2018_lloguer_preu_trim.csv"))
]).then(arr => {
  const json = arr.reduce((acc, curr) => acc.concat(curr), []);
  // now we group
  var filtered = _.filter(json, {
    Lloguer_mitja: "Lloguer mitjà per superfície (Euros/m2 mes)"
  });
  var grouped = _.groupBy(filtered, sub => sub.Codi_Barri);
  grouped = _.mapValues(grouped, ob => _.groupBy(ob, sub => sub.Any));
  console.log(grouped);
  fs.writeFileSync("./data.json", JSON.stringify(grouped, null, 4));
});
