function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));
}

function initHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const toggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const line1 = document.getElementById("menu-line-1");
  const line2 = document.getElementById("menu-line-2");

  const setScrolled = () => {
    const scrolled = window.scrollY > 8;
    header.classList.toggle("backdrop-blur-xl", scrolled);
    header.classList.toggle("bg-background/70", scrolled);
    header.classList.toggle("border-b", scrolled);
    header.classList.toggle("border-border", scrolled);
    header.classList.toggle("bg-transparent", !scrolled);
  };

  const setMenuOpen = (open) => {
    if (!toggle || !mobileMenu || !line1 || !line2) return;
    toggle.dataset.open = open ? "true" : "false";
    mobileMenu.classList.toggle("hidden", !open);
    line1.classList.toggle("translate-y-[3px]", open);
    line1.classList.toggle("rotate-45", open);
    line2.classList.toggle("-translate-y-[3px]", open);
    line2.classList.toggle("-rotate-45", open);
  };

  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  if (toggle && mobileMenu) {
    setMenuOpen(false);
    toggle.addEventListener("click", () => {
      const open = toggle.dataset.open !== "true";
      setMenuOpen(open);
    });
    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMenuOpen(false));
    });
  }
}

function initNavActive() {
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-nav]").forEach((el) => {
    const href = (el.getAttribute("href") || "").toLowerCase();
    const isActive = href === path || (path === "" && href === "index.html");
    if (isActive) {
      el.classList.add("text-foreground");
      el.classList.remove("text-muted-foreground");
    }
  });
}

function initHorizontalScroll() {
  document.querySelectorAll("[data-hscroll]").forEach((root) => {
    const scroller = root.querySelector("[data-hscroll-scroller]");
    const prev = root.querySelector("[data-hscroll-prev]");
    const next = root.querySelector("[data-hscroll-next]");
    if (!scroller || !prev || !next) return;

    const update = () => {
      const canPrev = scroller.scrollLeft > 4;
      const canNext = scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 4;
      prev.disabled = !canPrev;
      next.disabled = !canNext;
    };

    const scrollBy = (dir) => {
      const step = scroller.clientWidth * 0.7;
      scroller.scrollBy({ left: step * dir, behavior: "smooth" });
    };

    prev.addEventListener("click", () => scrollBy(-1));
    next.addEventListener("click", () => scrollBy(1));
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e) => {
      isDown = true;
      startX = e.pageX;
      startScroll = scroller.scrollLeft;
      scroller.style.cursor = "grabbing";
      scroller.style.scrollBehavior = "auto";
    };
    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      scroller.scrollLeft = startScroll - (e.pageX - startX);
    };
    const onUp = () => {
      if (!isDown) return;
      isDown = false;
      scroller.style.cursor = "grab";
      scroller.style.scrollBehavior = "smooth";
    };

    scroller.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    update();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavActive();
  initHeader();
  initReveal();
  initHorizontalScroll();
});
