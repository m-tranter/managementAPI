/*
 * An app to interface witht the contensis management API. 
 */

'use strict';

// Modules
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Set some variables
dotenv.config();
const port = process.env.PORT || 3005;
const dir = path.join(__dirname, 'public');

// Start the server.
const app = express();
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});

// Middleware
app.use(express.static(dir));
app.use(express.json());

// Function to sent the comment.
function sendComment(entry, client) {
  client.entries.create(entry)
    .then(result => {      
      console.log('API call result: ', result);              
      return result;
    })
    .catch(error => {
      console.log('API call fetch error: ', error);      
      return error;
    });
}

async function send(entry, client) {
  let result;
  try {
    result = await sendComment(entry, client);
  } catch (error) {
    return false;
  }
    return true;
}

// Routes
app.post('/comment/', (req, res) => {
  let msg = req.body.comment;
  const Client = require('contensis-management-api/lib/client').UniversalClient;
  const client = Client.create({
    clientType: "client_credentials",
    clientDetails: {
      clientId: process.env.CLIENT_ID, 
      clientSecret: process.env.CLIENT_SECRET 
    },
    projectId: 'website',
    rootUrl: process.env.ROOT_URL 
  });

  let newEntry = { "myComment":  msg,
    "sys": {
      "contentTypeId": "testComment",
      "projectId": "website",
      "language": "en-GB",
      "dataFormat": "entry",
    }
  };

  if (send(newEntry, client)) {
    res.status(200).send();
  } else {
    res.status(401).send();
  }
});

// Anything else.
app.all('*', function(req, res) {
  res.status(404).send('Page not found.');
});


