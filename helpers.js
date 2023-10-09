'use strict';
import fs from 'fs';

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
  let temp = i.asset.sys.uri.split('.');
  return `${temp[0]}.${temp[2]}`;
};

const makeTable = (arr) => {
  return arr.reduce((acc, e) => {
    return `${acc}
      <tr>
        <td>${e.dateString}</td>
        <td>${e.comment}</td>
        <td><img class="thumb img-fluid border border-secondary"
    src=${imgUri(e.image)}></img>
        </td>
      </tr>`;
  }, '');
};

function delFile(file) {
    fs.unlink(file, function(err) {
      if (err) {
        console.log(`Error deleting file: ${file}.`);
      }
    });
}

export { delFile, makeTable, createDates, sortDate };
