const axios = require("axios");

let serverHealthIsGood = true;

doManyRequests(30);
function doManyRequests(howMuch) {
  const requestors = [];
  console.log('Starting to perform requests now');
  for (i = 0; i < howMuch; i++) {
    requestors.push(doRequest());
  }

  Promise.all(requestors).then(response => {
    console.log("All requests completed, let's calculated results");
    const results = {succeeded:0, failed:0, aborted:0};
    response.forEach(singleRequestResponse => {
      results[singleRequestResponse]++;
    });

    console.log(`Results ${util.inspect(results)}`);
  });
}

async function doRequest() {
  let result;

  try {
    if(serverHealthIsGood === false)
      return "aborted";
    const healthCheckResponse = await axios.get(
      "http://localhost:8080/healthcheck"
    );
    if (healthCheckResponse.status !== 200) {
      serverHealthIsGood = false;
      return "aborted";
    }
    else{
      const response = await axios.get("http://localhost:8080/api/products");
      if (response.status !== 200) {
        return "failed";
      }
      else{
        return "succeeded"
      }
    }
  } catch (e) {
    return "failed"
  }

  return "failed";
}