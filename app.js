// An app to interface with the Contensis Management & Delivery APIs.
'use strict';

//console.log(`ENV: ${process.env}`);

// Modules
const express = require('express');
const path = require('path');
const manClient =
  require('contensis-management-api/lib/client').UniversalClient;
const { Client } = require('contensis-delivery-api');
const cors = require('cors');
//require('dotenv').config()

// Set some variables.
const port = 3001;
const dir = path.join(__dirname, 'public');

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
function sendComment(entry, client) {
  client.entries
    .create(entry)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error;
    });
}

async function send(entry, client) {
  let result;
  try {
    result = await sendComment(entry, client);
    console.log(result);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}

// Routes
app.post('/comment/', (req, res) => {
  let msg = req.body.comment;
  console.log(`New comment received: ${msg}\n${new Date().toLocaleString()}`);
  let date = req.body.date;
  const client = manClient.create({
    clientType: 'client_credentials',
    clientDetails: {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    projectId: 'website',
    rootUrl: process.env.ROOT_URL,
  });
  let newEntry = {
    myComment: msg,
    dateAndTime: date,
    sys: {
      contentTypeId: 'testComment',
      projectId: 'website',
      language: 'en-GB',
      dataFormat: 'entry',
    },
  };

  if (send(newEntry, client)) {
    res.status(200).send();
  } else {
    res.status(401).send();
  }
});

app.get('/getComments/', (_, res) => {
  let config = {
    rootUrl: 'https://cms-chesheast.cloud.contensis.com/',
    accessToken: 'QCpZfwnsgnQsyHHB3ID5isS43cZnthj6YoSPtemxFGtcH15I',
    projectId: 'website',
    language: 'en-GB',
  };
  let client = Client.create(config);
  client.entries
    .list({
      contentTypeId: 'testComment',
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
app.all('*', function (req, res) {
  res.status(404).send('Page not found.');
});


