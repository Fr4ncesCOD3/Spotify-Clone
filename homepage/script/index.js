let heart = document.getElementById("heart");
let button = document.getElementById("cancel_button");
let card = document.getElementById("card");

const green = function () {
  heart.addEventListener("click", function (e) {
    heart.classList.toggle("colorGreen");
    e.preventDefault;
  });
};

const toggle = function () {
  button.addEventListener("click", function (e) {
    card.id = "toggle";
    if (window.on) e.preventDefault;
  });
};

const add = function () {};
