(function () {
  const menu = document.getElementById("menu");
  const menuLinks = document.querySelectorAll('a[href="#menu"]');
  let locked = false;

  function lock() {
    if (locked) return false;
    locked = true;
    setTimeout(() => {
      locked = false;
    }, 350);
    return true;
  }

  function show() {
    if (lock()) document.body.classList.add("is-menu-visible");
  }

  function hide() {
    if (lock()) document.body.classList.remove("is-menu-visible");
  }

  function toggle() {
    if (lock()) document.body.classList.toggle("is-menu-visible");
  }

  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });
  });

  menu.addEventListener("click", (e) => {
    if (e.target === menu) {
      e.preventDefault();
      hide();
    }
  });

  menu.querySelector(".inner").addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hide();
  });
})();
