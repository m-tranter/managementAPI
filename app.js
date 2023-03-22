// An app to interface with the Contensis Management & Delivery APIs.
'use strict';

// Modules
const express = require('express');
const path = require('path');
const manClient =
  require('contensis-management-api/lib/client').UniversalClient;
const { Client } = require('contensis-delivery-api');
const cors = require('cors');
const {regEx} = require("./swears.js");
//require('dotenv').config();

// Set some variables.
const port = 3001;
const dir = path.join(__dirname, 'public');
const ROOT_URL = `https://cms-${process.env.alias}.cloud.contensis.com/`;
const PROJECT = process.env.projectId;

// Start the server.
const app = express();
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});

// Middleware
app.use(express.static(dir));
app.use(express.json());
app.use(cors());

// Function to sent the comment.
function sendComment(res, entry, client) {
  client.entries
    .create(entry)
    .then((result) => {
      if (result !== undefined) {
        res.status(200).send();
      } else {
        res.status(400).send();
      }
    })
    .catch((error) => {
      res.status(400).send();
    });
}

// Routes
app.post('/comment/', (req, res) => {
  let msg = req.body.comment;
  if (regEx.test(msg)) {
    res.status(401).send();
    return;
  }
  console.log(`New comment received: ${msg}\n${new Date().toLocaleString()}`);
  let date = req.body.date;
  const client = manClient.create({
    clientType: 'client_credentials',
    clientDetails: {
      clientId: process.env.clientId,
      clientSecret: process.env.sharedSecret,
    },
    projectId: PROJECT,
    rootUrl: ROOT_URL,
  });
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
  sendComment(res,newEntry,client);
});

app.get('/getComments/', (_, res) => {
  let config = {
    rootUrl: 'https://cms-chesheast.cloud.contensis.com/',
    accessToken: process.env.accessToken,
    projectId: PROJECT,
    language: 'en-GB',
  };
  let client = Client.create(config);
  client.entries
    .list({
      contentTypeId: 'comment',
      versionStatus: 'latest',
      pageOptions: { pageIndex: 0, pageSize: 500 },
      orderBy: ['sys.id'],
    })
    .then((data) => {
      console.log(
        `Received a request for data: ${new Date().toLocaleString()}`
      );
      res.json(data);
    });
});

// Anything else.
app.all('*', function (_, res) {
  res.status(404).send('Page not found.');
});
