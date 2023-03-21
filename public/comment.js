'use strict';

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
dateField.addEventListener('click', () => sortByField('dateAndTime'));
dateField.addEventListener(
  'mouseover',
  () => (dateField.style.backgroundColor = 'LightGreen')
);
dateField.addEventListener(
  'mouseout',
  () => (dateField.style.backgroundColor = 'White')
);
commentField.addEventListener('click', () => sortByField('myComment'));
commentField.addEventListener(
  'mouseover',
  () => (commentField.style.backgroundColor = 'LightGreen')
);
commentField.addEventListener(
  'mouseout',
  () => (commentField.style.backgroundColor = 'White')
);
var k = 1;
var j = 1;
var item;
var items = [];

loadEntries();
toggleDivs();

function loadEntries() {
  fetch(`/getComments`, { method: 'get' })
    .then((response) => {
      if (!response.ok) {
        myDisplay.innerHTML = 'Invalid URL.';
        throw Error('Bad URL');
      }
      return response.json();
    })
    .then((res) => {
      items = createDates(res.items.slice()).sort(
        sortObjDate('dateAndTime', 1)
      );
      clearTable();
      for (item of items) {
        addRow(item);
      }
    })
    .finally(() => {
      setTimeout(() => (myDisplay.innerHTML = '&nbsp;'), 100);
    });
}

function sortByField(f) {
  if (f === 'myComment') {
    items.sort(sortObjStr(f, -1));
  } else {
    items.sort(sortObjDate(f, -1));
  }
  clearTable();
  for (item of items) {
    addRow(item);
  }
}

function clearTable() {
  for (let i = 0; i < items.length; i++) {
    try {
      myTable.deleteRow(1);
    } catch (ignore) {}
  }
}

function addRow(item) {
  let row = myTable.insertRow(1);
  let date = row.insertCell(0);
  let comment = row.insertCell(1);
  date.innerHTML = item.dateAndTime.toLocaleDateString();
  comment.innerHTML = item.myComment;
}

function clear() {
  myDisplay.innerHTML = '&nbsp;';
}

function sortObjStr(field, op) {
  k *= op;
  return (a, b) => {
    let x = a[field].toLowerCase();
    let y = b[field].toLowerCase();
    if (x < y) {
      return -1 * k;
    }
    if (x > y) {
      return 1 * k;
    }
    return 0;
  };
}

function sortObjDate(field, op) {
  j *= op;
  return (a, b) => {
    return (a[field] - b[field]) * j;
  };
}

function createDates(arr) {
  return arr.map((e) => {
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

function refresh(msg) {
  loadEntries();
  if (!items.some((e) => e.myComment === msg)) {
    setTimeout(() => refresh(msg), 1000);
  } else {
    toggleDivs();
  }
}

function toggleDivs() {
  divs.forEach((e) => {
    if (e.classList.contains('d-none')) {
      e.classList.remove('d-none');
    } else {
      e.classList.add('d-none');
    }
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
    console.log(response);
      if (response.status === 200) {
        myDisplay.innerText = `We received your comment:\n"${msg}"`;
        setTimeout(() => {
          toggleDivs();
          refresh(msg);
        }, 2000);
      } else {
        myDisplay.innerText = 'Something went wrong.';
        throw Error('Server rejected comment.');
      }
    })
    .catch((err) => console.log(err));
  myBtn.disabled = false;
}

