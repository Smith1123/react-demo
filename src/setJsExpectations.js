import fetch from 'node-fetch';

async function setExpectation() {
  await fetch('http://localhost:1080/mockserver/expectation', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      httpRequest: {
        method: 'GET',
        path: '/js'
      },
      httpResponse: {
        statusCode: 200,
        headers: [
          { name: 'Access-Control-Allow-Origin', values: ['*'] }
        ],
        body: 'Hello from JavaScript'
      }
    })
  });

  console.log("JavaScript expectation set for /js");
}

setExpectation();
