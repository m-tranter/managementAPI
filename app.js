// An app to interface with the Contensis Management & Delivery APIs.
'use strict';

// Modules.
//import {} from 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import cors from 'cors';
import { regEx } from './swears.js';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import index from './index.js';
import { delFile, createDates, sortDate, makeTable } from './helpers.js';

import ejs from 'ejs';
import { NodejsClient } from 'contensis-management-api/lib/client/nodejs-client.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set some variables.
const port = 3001;
const dir = path.join(__dirname, 'public');
const ROOT_URL = `https://cms-${process.env.alias}.cloud.contensis.com/`;
const PROJECT = process.env.projectId;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const client = NodejsClient.create({
  clientType: 'client_credentials',
  clientDetails: {
    clientId: process.env.CONTENSIS_CLIENT_ID,
    clientSecret: process.env.CONTENSIS_CLIENT_SECRET,
  },
  projectId: PROJECT,
  rootUrl: ROOT_URL,
});

// Start the server.
const app = express();
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});

// Log all requests to the server
const myLogger = function (req, _, next) {
  console.log(`Incoming: ${req.url}`);
  next();
};

// Middleware
app.use(express.json());
app.use(cors());
app.use(myLogger);

let display = '';

async function sendImage(file) {
  return client.entries
    .createAsset(
      {
        title: file.split('.')[0],
        sys: {
          projectId: PROJECT,
          language: 'en-GB',
          dataFormat: 'asset',
        },
      },
      file,
      '/images/comments'
    )
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}

async function sendEntries(res) {
  const response = await fetch(
    `${ROOT_URL}/api/delivery/projects/${PROJECT}/contenttypes/comment/entries?accessToken=QCpZfwnsgnQsyHHB3ID5isS43cZnthj6YoSPtemxFGtcH15I&versionStatus=latest`,
    { method: 'get' }
  );
  const data = await response.json();
  const table = makeTable(createDates(data.items).sort(sortDate));
  res.send(ejs.render(index, { table, display }));
}

// Routes
app.post('/', upload.single('image'), async (req, res) => {
  let msg = req.body.comment.trim();
  if (!msg.length) {
    display = 'Empty comments cannot be accepted.';
    sendEntries(res);
    return;
  }
  let date = new Date();
  console.log(`New comment received: ${msg}\n${date.toLocaleString()}`);
  let newEntry = {
    comment: msg,
    date: date,
    image: {
      asset: {
        sys: {
          id: undefined,
        },
      },
    },
    sys: {
      id: uuidv4(),
      contentTypeId: 'comment',
      projectId: PROJECT,
      language: 'en-GB',
      dataFormat: 'entry',
    },
  };
  if (req.file) {
    fs.writeFileSync(req.file.originalname, req.file.buffer);
    let apiRes = await sendImage(req.file.originalname);
    newEntry.image.asset.sys.id = apiRes.sys.id;
    display =
      'We received your comment. There may be a delay before your image is available.';
    setTimeout(() => delFile(req.file.originalname), 5000);
  } else {
    display = 'We received your comment.';
  }

  client.entries
    .create(newEntry)
    .then((result) => {
      res.writeHead(301, { Location: '/comments' });
      return res.end();
    })
    .catch((error) => {
      display = 'Something went wrong';
      res.writeHead(301, { Location: '/comments' });
      return res.end();
    });
});

// Make sure request for .js files are fetched.
app.get(/.*\.(js|css|png|jpg|jpeg)$/, (req, res) => {
  res.sendFile(path.join(dir, req.url));
});

app.get('*', function (_, res) {
  sendEntries(res);
});
