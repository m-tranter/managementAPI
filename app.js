// An app to interface with the Contensis Management & Delivery APIs.
'use strict';

// Modules.
import {} from 'dotenv/config'
import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import cors from 'cors';
import { regEx } from './swears.js';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Print the env vars.
/*
 *Object.keys(process.env).forEach(k => {
 *  console.log(`${k}: ${process.env[k]}`)
 *});
 */

// Set some variables.
const port = 3001;
const dir = path.join(__dirname, 'public');
const ROOT_URL = `https://cms-${process.env.alias}.cloud.contensis.com/`;
const PROJECT = process.env.projectId;

// Get an authorization token.
const response = await fetch(
  'https://cms-chesheast.cloud.contensis.com/authenticate/connect/token',
  {
    method: 'post',
    body: `grant_type=client_credentials&client_id=${process.env.clientId}&client_secret=${process.env.sharedSecret}&scope=Entry_Read ContentType_Read Project_Read Entry_Write`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  }
);
const data = await response.json();
const AUTH = data.access_token;

// Start the server.
const app = express();
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});

// Log all request to the server
const myLogger = function (req, _, next) {
  if (!req.url.startsWith('/?')) {
    console.log(`Incoming: ${req.url}`);
  }
  next();
};

// Middleware
// Not using the usuall express middleware.
//app.use(express.static(dir));
app.use(express.json());
app.use(cors());
app.use(myLogger);

async function sendComment(res, entry) {
  const response = await fetch(
    'https://cms-chesheast.cloud.contensis.com/api/management/projects/blockstest/entries',
    {
      method: 'post',
      headers: {
        Authorization: 'bearer ' + AUTH,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(entry),
    }
  );
  if (response.ok) {
    setTimeout(() => sendEntries(res, 200), 100);
  } else {
    res.status(400).send();
  }
}

async function sendEntries(res, status) {
  const response = await fetch(
    `${ROOT_URL}/api/delivery/projects/${PROJECT}/contenttypes/comment/entries?accessToken=QCpZfwnsgnQsyHHB3ID5isS43cZnthj6YoSPtemxFGtcH15I&versionStatus=latest`,
    { method: 'get' }
  );
  const data = await response.json();
  res.status(status).json(data);
}

// Routes
app.post('/leaveComment/', (req, res) => {
  let msg = req.body.comment;
  console.log(`New comment received: ${msg}\n${new Date().toLocaleString()}`);
  if (regEx.test(msg)) {
    console.log('Profanity detected.');
    sendEntries(res, 401);
    return;
  }
  let date = req.body.date;
  let newEntry = {
    comment: msg,
    date: date,
    sys: {
      contentTypeId: 'comment',
      projectId: PROJECT,
      language: 'en-GB',
      dataFormat: 'entry',
    },
  };
  sendComment(res, newEntry);
});

// Make sure request for .js files are fetched.
app.get('/*.js/', function (req, res) {
  let temp = req.url.split('?')[0].split('/');
  res.sendFile(path.join(dir, '/', temp[temp.length - 1]));
});

app.all('/comments*', function (_, res) {
  res.sendFile(path.join(dir, '/index.html'));
});
