'use strict';
import fs from 'fs';

// Makes date into date objects.
function createDates(arr) {
  return arr.map((e) => {
    e.date = new Date(e.date);
    e.dateString = e.date.toLocaleDateString('en-GB');
    return e;
  });
}

const sortDate = (a, b) => {
  return b.date - a.date;
};

const imgTag = (i) => {
  let arr = i ? i.asset.sys.uri.split('.') : [];
  return i
    ? `class="thumb img-fluid border border-secondary" src="https://preview-blockstest-chesheast.cloud.contensis.com${arr[0]}.${arr[2]}" onerror="this.oneerror=null;this.src='/static/reload.jpg';"`
    : 'class="thumb img-fluid" src="/static/placeholder.png"';
};

const makeTable = (arr) => {
  return arr.reduce((acc, e) => {
    return `${acc}
      <tr>
        <td>${e.dateString}</td>
        <td>${e.comment}</td>
        <td><img ${imgTag(e.image)}></img>
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
