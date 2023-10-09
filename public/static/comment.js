'use strict';
const img_picker = document.getElementById('img_picker');
const img = document.getElementById('myImg');
const img_upload = document.getElementById('img-upload');
const display = document.getElementById('display-box');

img_picker.addEventListener('change', function () {
  if (this.files && this.files[0]) {
    img.src = URL.createObjectURL(this.files[0]);
    img_upload.classList.remove('d-none');
  }
});


display.addEventListener("focus", () => display.innerHTML = ''); 
