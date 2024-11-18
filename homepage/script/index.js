let heart = document.getElementById("heart");

const green = function () {
  heart.addEventListener("click", function (e) {
    heart.classList.toggle("colorGreen");
    e.preventDefault;
  });
};
