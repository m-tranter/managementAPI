// An app to interface with the Contensis Management & Delivery APIs.
'use strict';

// Modules.
const express = require('express');
const path = require('path');
const manClient =
  require('contensis-management-api/lib/client').UniversalClient;
const { Client } = require('contensis-delivery-api');
const cors = require('cors');
const { regEx } = require('./swears.js');
//require('dotenv').config();

// Set some variables.
const port = 3001;
const dir = path.join(__dirname, 'public');
const ROOT_URL = `https://cms-${process.env.alias}.cloud.contensis.com/`;
const PROJECT = process.env.projectId;
const config = {
  rootUrl: ROOT_URL,
  accessToken: process.env.accessToken,
  projectId: PROJECT,
  language: 'en-GB',
};
const client = Client.create(config);
const managementClient = manClient.create({
  clientType: 'client_credentials',
  clientDetails: {
    clientId: process.env.clientId,
    clientSecret: process.env.sharedSecret,
  },
  projectId: PROJECT,
  rootUrl: ROOT_URL,
});

console.log(process.env.accessToken);
console.log(process.env.alias);
console.log(process.env.clientId);
console.log(process.env.projectId);
console.log(process.env.alias);


// Start the server.
const app = express();
app.listen(port, () => {
  console.log("Testing.");
  console.log(`Server listening on port ${port}.`);
});

const myLogger = function (req, res, next) {
  if (!req.url.startsWith('/?') {
  console.log(`Incoming: ${req.url}`);
  }
  next()
}

// Middleware
//app.use(express.static(dir));
app.use(express.json());
app.use(cors());
app.use(myLogger);

// Function to sent the comment.
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
  client.entries
    .list({
      contentTypeId: 'comment',
      versionStatus: 'latest',
      pageOptions: { pageIndex: 0, pageSize: 500 },
      orderBy: ['sys.id'],
    })
    .then((data) => {
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

app.get('/getComments/', (_, res) => {
  console.log(`Received a request for data: ${new Date().toLocaleString()}`);
  sendEntries(res, 200);
});


app.all('/comments*', function (_, res) {
  res.sendFile(path.join(dir, '/index.html'));
});


app.get("*", (req, res) => {
  res.send("PAGE NOT FOUND.");
});
