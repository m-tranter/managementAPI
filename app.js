// An app to interface with the Contensis Management & Delivery APIs.
'use strict';

// Modules.
import express from "express";
import path from "path";
import { NodejsClient } from "contensis-management-api/lib/client/nodejs-client.js";
import cors from "cors";
import {regEx} from "./swears.js";
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import {} from 'dotenv/config'

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
const managementClient = NodejsClient.create({
  clientType: 'client_credentials',
  clientDetails: {
    clientId: process.env.clientId,
    clientSecret: process.env.sharedSecret,
  },
  projectId: PROJECT,
  rootUrl: ROOT_URL,
});

// Start the server.
const app = express();
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});

// Log all request to the server
const myLogger = function (req, res, next) {
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

function sendComment(res, entry, client) {
  client.entries
    .create(entry)
    .then((result) => {
      if (result) {
        sendEntries(res, 200);
      } else {
        res.status(400).send();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send();
    });
}

const sendEntries = (res, status) => {
  fetch(
    `${ROOT_URL}/api/delivery/projects/${PROJECT}/contenttypes/comment/entries?accessToken=QCpZfwnsgnQsyHHB3ID5isS43cZnthj6YoSPtemxFGtcH15I&versionStatus=latest`,
    { method: 'get' }
  ).then((data) => {
    res.status(status).json(data);
  });
};

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
  sendComment(res, newEntry, managementClient);
});

// Make sure request for .js files are fetched.
app.get('/*.js/', function (req, res) {
  let temp = req.url.split('?')[0].split('/');
  res.sendFile(path.join(dir, '/', temp[temp.length - 1]));
});

app.all('/comments*', function (_, res) {
  res.sendFile(path.join(dir, '/index.html'));
});
