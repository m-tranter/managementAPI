'use strict';
const img_picker = document.getElementById('img_picker');
const myBtn = document.getElementById('my-btn');
const img = document.getElementById('myImg');
const img_upload = document.getElementById('img-upload');
const display = document.getElementById('display-box');
const spinner = document.getElementById('spinner');

img_picker.addEventListener('change', function () {
  if (this.files && this.files[0]) {
    img.src = URL.createObjectURL(this.files[0]);
    img_upload.classList.remove('d-none');
  }
});

display.addEventListener('focus', () => (display.innerHTML = ''));

myBtn.addEventListener('click', () => {
  display.innerHTML = '';
  spinner.classList.remove('d-none');
});
