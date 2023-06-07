// variable
let modal = document.querySelector(".modal-container");
let btn = document.getElementById("myBtn");
let closeBtn = document.querySelectorAll(".btn");

// EventListener
btn.addEventListener("click", () => {
  modal.classList.add("show");
});

closeBtn.forEach((eachBtn) => {
  eachBtn.addEventListener("click", () => {
    modal.classList.remove("show");
  });
});

window.onclick = function (event) {
  if (event.target == modal) {
    modal.classList.remove("show");
  }
};
