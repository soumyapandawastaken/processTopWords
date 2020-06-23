const fetch = require("node-fetch");
var topWords = [];
console.log("Start reading file.");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = new XMLHttpRequest();
request.open("GET", "http://norvig.com/big.txt", true);
request.send(null);
request.onreadystatechange = function () {
  if (request.readyState === 4 && request.status === 200) {
    var type = request.getResponseHeader("Content-Type");
    if (type.indexOf("text") !== 1) {
      console.log("Text fetched for processing.");
      console.log("Get top 10 words.");
      topWords = wordFreq(request.responseText);
      console.log("Get details for top 10 words.");
      topWords.forEach((element) => {
        var output = {};
        LookUp(element[0]).then((data) => {
          var Output = {};
          Output["count"] = element[1];
          var synonms = [];
          if (data["def"][0] != undefined) {
            Output["pos"] = data["def"][0]["pos"];
            data["def"][0]["tr"].forEach((element) => {
              if (element["syn"] != undefined) {
                element["syn"].forEach((element1) => {
                  synonms.push(element1["text"]);
                });
              }
            });
          }
          Output["syn"] = synonms;
          output[element[0]] = Output;
          console.log(output);
        });
      });
    }
  }
};

function wordFreq(string) {
  var words = string.replace(/[.]/g, "").split(/\s/);
  var wordFrequencies = {};
  words.forEach(function (w) {
    if (!wordFrequencies[w]) {
      wordFrequencies[w] = 0;
    }
    wordFrequencies[w] += 1;
  });
  // Create items array
  var items = Object.keys(wordFrequencies).map(function (key) {
    if (key != "") {
      return [key, wordFrequencies[key]];
    }
  });

  // Sort the array based on the second element
  items.sort(function (first, second) {
    return second[1] - first[1];
  });
  return items.slice(0, 10);
}

async function LookUp(text) {
  const APIkey =
    "dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf";
  const baseUrl =
    "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=" +
    APIkey +
    "&lang=en-en&text=";
  const response = await fetch(baseUrl + text);
  const data = await response.json();
  return data;
}
