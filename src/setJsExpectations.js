import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Betöltjük a .env fájlt
dotenv.config();

console.log(`MOCKSERVER_URL env variable: ${process.env.MOCKSERVER_URL}`)
const MOCKSERVER_URL = process.env.MOCKSERVER_URL || 'http://localhost:1080';

async function setExpectation() {
  await fetch(`${MOCKSERVER_URL}/mockserver/expectation`, {
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
