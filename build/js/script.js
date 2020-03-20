let navToggle = document.querySelector('.main-nav__toggle');
let navMainList = document.querySelector('.main-nav__list');

navToggle.onclick = function() {
  navMainList.classList.toggle('main-nav__list-open');
};
