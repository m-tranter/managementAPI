'use strict';

const myComment = document.getElementById("comment");
const myDisplay = document.getElementById("display");

function sendComment() {
 let msg = myComment.value;
 let myDate = new Date().toLocaleString();
 console.log(myDate);
 fetch("/comment", {
  method: "post",
  body: JSON.stringify({comment: msg, date: myDate}),
  headers: {
   "Content-Type": "application/json; charset=utf-8",
  },
 })
    .then((response) => {
      if (response.status === 200) {
        console.log("Success.");
        myDisplay.innerText = `We received your comment:\n"${msg}"`;
      } else {
        myDisplay.innerText = "Something went wrong.";
        throw Error('Server rejected comment.');
      }
    })
    .catch(err => console.log(err));
}



