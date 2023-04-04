'use strict';
let items = [];
const rx_iso_date = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2})?(?:\.\d*)?Z?$/;
const myComment = document.getElementById('comment');
const myDisplay = document.getElementById('display-box');
const myBtn = document.getElementById('myBtn');
const myTable = document.getElementById('myTable');
const dateField = document.getElementById('dateField');
const commentField = document.getElementById('commentField');
let firstSort;

myBtn.addEventListener('click', sendComment);
myComment.addEventListener('focus', clear);
dateField.addEventListener('click', () => sortByField('date'));
dateField.addEventListener(
  'mouseover',
  () => (dateField.style.backgroundColor = 'LightGreen')
);
dateField.addEventListener(
  'mouseout',
  () => (dateField.style.backgroundColor = 'White')
);
commentField.addEventListener('click', () => sortByField('comment'));
commentField.addEventListener(
  'mouseover',
  () => (commentField.style.backgroundColor = 'LightGreen')
);
commentField.addEventListener(
  'mouseout',
  () => (commentField.style.backgroundColor = 'White')
);

const refresh = (data) => {
  firstSort = true;
  items = data.items
    ? createDates(data.items.slice()).sort(sortNum('date')).reverse()
    : [];
  redrawTable();
  if (myDisplay.innerHTML.startsWith('Contacting')) {
    myDisplay.innerHTML = '&nbsp';
  }
};

(function loadEntries() {
  myDisplay.innerText = 'Contacting the server.';
  fetch(
    'https://cms-chesheast.cloud.contensis.com/api/delivery/projects/blockstest/contenttypes/comment/entries?accessToken=QCpZfwnsgnQsyHHB3ID5isS43cZnthj6YoSPtemxFGtcH15I&versionStatus=latest',
    { method: 'get' }
  )
    .then((response) => {
      if (!response.ok) {
        myDisplay.innerHTML = 'Something went wrong..';
      }
      return response.json();
    })
    .then((res) => {
      refresh(res);
    });
})();

function sortByField(f) {
  let temp = [...items];
  temp.sort(f === 'comment' ? sortStr(f) : sortNum(f));
  if (!firstSort) {
    items = temp.every((e, i) => e[f] === items[i][f])
      ? [...temp].reverse()
      : [...temp];
  } else {
    firstSort = false;
    items = [...temp].reverse();
  }
  updateTable();
}

function redrawTable() {
  let l = myTable.rows.length;
  if (l > 1) {
    for (let i = 1; i < l; i++) {
      myTable.deleteRow(1);
    }
  }
  items.forEach((item) => {
    addRow(item);
  });
}

function updateTable() {
  items.forEach((item, i) => {
    let row = myTable.rows[i + 1];
    row.cells[0].innerHTML = item.dateString;
    row.cells[1].innerHTML = item.comment;
  });
}

function addRow(item) {
  let row = myTable.insertRow(1);
  let date = row.insertCell(0);
  let comment = row.insertCell(1);
  date.innerHTML = item.dateString;
  comment.innerHTML = item.comment;
}

function clear() {
  myDisplay.innerHTML = '&nbsp;';
}

function sortStr(field) {
  return (a, b) => {
    let x = a[field].toLowerCase();
    let y = b[field].toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };
}

function sortNum(field) {
  return (a, b) => {
    return b[field] - a[field];
  };
}

// Makes date into date objects.
function createDates(arr) {
  return arr.map((e) => {
    e.date = new Date(e.date);
    e.dateString = e.date.toLocaleDateString();
    return e;
  });
}

function sendComment() {
  let msg = myComment.value.trim();
  if (!msg) {
    return;
  }
  myComment.value = '';
  myBtn.disabled = true;
  myDisplay.innerText = 'Contacting the server.';
  let myDate = new Date().toLocaleString();
  fetch('/leaveComment', {
    method: 'post',
    body: JSON.stringify({ comment: msg, date: myDate }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
    .then((response) => {
      if (response.ok) {
        myDisplay.innerText = `We received your comment:\n"${msg}"`;
        setTimeout(() => (myDisplay.innerHTML = '&nbsp;'), 1000);
      } else if (response.status === 401) {
        myDisplay.innerText =
          'We cannot accept comments that contain profanity.';
      } else {
        myDisplay.innerText = 'Something went wrong.';
      }
      return response.json();
    })
    .then((res) => {
      refresh(res);
    })
    .catch((err) => console.log(err));
  myBtn.disabled = false;
}
