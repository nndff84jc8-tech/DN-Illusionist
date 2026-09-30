(function () {
  var header = document.querySelector("header");
  if (!header) return;

  /* CSS incluso qui dentro */
  var css = `
  @media (min-width:721px){
    header button.nav-toggle{display:none !important}
    header nav.links{margin-left:auto !important}
  }
  @media (max-width:720px){
    header button.nav-toggle{
      display:flex !important;flex-direction:column;justify-content:center;gap:5px;
      width:44px;height:44px;padding:10px !important;margin:0 !important;
      background:none !important;border:none !important;box-shadow:none !important;
      transform:none !important;cursor:pointer;position:relative;z-index:1002;
    }
    header button.nav-toggle span{display:block !important;width:24px;height:2px;background:#e9e4d8;transition:transform .3s ease,opacity .3s ease}
    header button.nav-toggle[aria-expanded="true"] span:nth-child(1){transform:translateY(7px) rotate(45deg)}
    header button.nav-toggle[aria-expanded="true"] span:nth-child(2){opacity:0}
    header button.nav-toggle[aria-expanded="true"] span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
    header nav.links{
      position:fixed !important;top:0;right:0;height:100vh;height:100dvh;
      width:min(82vw,340px);background:#121110;
      flex-direction:column !important;justify-content:center;align-items:flex-start;
      padding:0 35px !important;gap:28px !important;margin:0 !important;
      transform:translateX(100%);visibility:hidden;
      transition:transform .5s cubic-bezier(.65,0,.35,1),visibility 0s .5s;
      z-index:1001;
    }
    header nav.links.open{
      transform:translateX(0) !important;visibility:visible !important;
      transition:transform .5s cubic-bezier(.65,0,.35,1),visibility 0s;
    }
    header nav.links a,header nav.links .nav-coming{font-size:13px;padding:8px 0}
  }`;
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  /* pulizia: via i nav vuoti o con "..." */
  var navs = header.querySelectorAll("nav.links");
  var menu = null;
  navs.forEach(function (n) {
    var t = n.textContent.replace(/\s+/g, "");
    if (t === "" || t === "..." ) n.remove();
    else if (!menu) menu = n;
  });
  if (!menu) return;
  menu.id = "menu";

  /* un solo bottone */
  var toggles = header.querySelectorAll(".nav-toggle");
  for (var i = 1; i < toggles.length; i++) toggles[i].remove();
  var toggle = toggles[0];
  if (!toggle) {
    toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", "Apri menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "<span></span><span></span><span></span>";
    header.appendChild(toggle);
  }
  toggle.setAttribute("aria-controls", "menu");

  function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest(".nav-toggle")) {
      e.preventDefault();
      e.stopImmediatePropagation();
      setMenu(!menu.classList.contains("open"));
    } else if (e.target.closest("header nav.links a")) {
      setMenu(false);
    }
  }, true);

  window.addEventListener("resize", function () {
    if (window.innerWidth > 720) setMenu(false);
  });

  /* navbar nera dopo lo scroll */
  function navbarScroll() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    header.classList.toggle("scrolled", y > 50);
  }
  window.addEventListener("scroll", navbarScroll, { passive: true });
  navbarScroll();
})();