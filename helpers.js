'use strict';
import fs from 'fs';

// Makes date into date objects.
function createDates(arr) {
  return arr.map((e) => {
    e.date = new Date(e.date);
    e.dateString = e.date.toLocaleDateString();
    return e;
  });
}

const sortDate = (a, b) => {
  return b.date - a.date;
};

const imgUri = (i) => {
  let arr = i ? i.asset.sys.uri.split('.') : [];
  return i
    ? `https://preview-blockstest-chesheast.cloud.contensis.com${arr[0]}.${arr[2]}`
    : '/static/placeholder.png';
};

const makeTable = (arr) => {
  return arr.reduce((acc, e) => {
    return `${acc}
      <tr>
        <td>${e.dateString}</td>
        <td>${e.comment}</td>
        <td><img class="thumb img-fluid border border-secondary"
    src=${imgUri(
      e.image
    )} onerror="this.onerror=null;this.src='/static/reload.jpg';"</img>
        </td>
      </tr>`;
  }, '');
};

/** Delete files from the server. */
function delFile(file) {
  fs.unlink(file, function (err) {
    if (err) {
      console.log(`Error deleting file: ${file}.`);
    }
  });
}

export { delFile, makeTable, createDates, sortDate };
