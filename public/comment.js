'use strict';

console.log("Loaded script.");

let item;
let items = [];
const rx_iso_date = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2})?(?:\.\d*)?Z?$/;
const myComment = document.getElementById('comment');
const divs = [
  document.getElementById('loading'),
  document.getElementById('tableDiv'),
];
const myDisplay = document.getElementById('display');
const myBtn = document.getElementById('myBtn');
const myTable = document.getElementById('myTable');
const dateField = document.getElementById('dateField');
const commentField = document.getElementById('commentField');

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
  items = data.items 
  ? createDates(data.items.slice()).sort(sortNum('date'))
  : [];
  redrawTable();
  if (myDisplay.innerHTML.startsWith("Contacting")) {
    myDisplay.innerHTML = '&nbsp';
  }
};

(function loadEntries() {
  myDisplay.innerText = 'Contacting the server.';
  fetch(`/getComments`, { method: 'get' })
    .then((response) => {
      if (!response.ok) {
        myDisplay.innerHTML = 'Something went wrong..';
      }
      return response.json();
    })
    .then((res) => {
      refresh(res);
    })
})();

function sortByField(f) {
  let temp = [...items];
  temp.sort(f === 'comment' ? sortStr(f) : sortNum(f));
  items = temp.some((e, i) => e.index !== items[i].index)
    ? (items = [...temp])
    : (items = [...temp].reverse());
  redrawTable();
}

function redrawTable() {
  items.forEach(() => {
    try {
      myTable.deleteRow(1);
    } catch (_) {}
  });
  items.forEach((item) => {
    addRow(item);
  });
}

function addRow(item) {
  let row = myTable.insertRow(1);
  let date = row.insertCell(0);
  let comment = row.insertCell(1);
  date.innerHTML = item.date.toLocaleDateString();
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
    return a[field] - b[field];
  };
}

// Makes date into date objects and adds an index.
function createDates(arr) {
  return arr.map((e, i) => {
    e.index = i;
    return Object.fromEntries(
      Object.entries(e).map(([k, v]) =>
        k.toLowerCase().includes('date') ||
        (typeof v === 'string' && v.match(rx_iso_date))
          ? [k, new Date(v)]
          : [k, v]
      )
    );
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
  fetch('/comment', {
    method: 'post',
    body: JSON.stringify({ comment: msg, date: myDate }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
    .then((response) => {
      if (response.ok) {
        myDisplay.innerText = `We received your comment:\n"${msg}"`;
        setTimeout(() => myDisplay.innerHTML = '&nbsp;', 1000);
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
