'use strict';
const myComment = document.getElementById('comment');
const table = document.getElementById('tbody');
const img_picker = document.getElementById('img_picker');
const img = document.getElementById('myImg');
const img_upload = document.getElementById('img-upload');

img_picker.addEventListener('change', function () {
  if (this.files && this.files[0]) {
    img.src = URL.createObjectURL(this.files[0]);
    img_upload.classList.remove('d-none');
  }
});

(function loadEntries() {
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
      console.log(res.items);
      drawTable(createDates(res.items).sort(sortDate));
    });
})();

function drawTable(items) {
  table.innerHTML = '';
  items.forEach((e) => {
    let row = table.insertRow();
    let date = row.insertCell(0);
    let comment = row.insertCell(1);
    let image = row.insertCell(2);
    date.innerHTML = e.dateString;
    comment.innerHTML = e.comment;
    let img = document.createElement('img');
    img.classList.add(
      'thumb',
      'img-fluid',
      'border',
      'border',
      'border-secodary'
    );
    img.src = e.image
      ? `https://preview-blockstest-chesheast.cloud.contensis.com/${imgUri(
          e.image
        )}`
      : '';
    image.appendChild(img);
  });
}

const imgUri = (str) => {
  let temp = str.asset.sys.uri.split('.');
  return `${temp[0]}.${temp[2]}`;
};

function sortDate(a, b) {
  return b.date - a.date;
}

// Makes date into date objects.
function createDates(arr) {
  return arr.map((e) => {
    e.date = new Date(e.date);
    e.dateString = e.date.toLocaleDateString();
    return e;
  });
}

