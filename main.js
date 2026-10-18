(() => {
  const root = document.documentElement;

  // Theme toggle: dark by default, remembers the visitor's choice.
  const btn = document.querySelector(".theme-btn");
  if (!root.dataset.theme) root.dataset.theme = "dark";
  btn?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  });

  // Highlight the nav link for the section in view.
  const links = [...document.querySelectorAll(".nav a")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.setAttribute("aria-current", a.hash === "#" + e.target.id ? "true" : "false"));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const s = document.querySelector(a.hash); if (s) io.observe(s); });

  // Agent trace: every line is visible at rest; a highlight steps through the run.
  const steps = [...document.querySelectorAll(".trace li")];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (steps.length && !reduce) {
    let i = 0;
    setInterval(() => {
      steps.forEach((s, j) => s.classList.toggle("on", j === i));
      i = (i + 1) % (steps.length + 2);
    }, 900);
  }

  // Screenshot pager inside each project card.
  document.querySelectorAll(".shots[data-pager]").forEach((box) => {
    const imgs = [...box.querySelectorAll("img")];
    if (imgs.length < 2) return;
    const pager = document.createElement("div");
    pager.className = "pager";
    imgs.forEach((img, i) => {
      if (i) img.hidden = true;
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = i + 1;
      b.setAttribute("aria-label", "Screenshot " + (i + 1));
      b.setAttribute("aria-current", i ? "false" : "true");
      b.addEventListener("click", () => {
        imgs.forEach((im, j) => (im.hidden = j !== i));
        [...pager.children].forEach((x, j) => x.setAttribute("aria-current", j === i ? "true" : "false"));
      });
      pager.appendChild(b);
    });
    box.appendChild(pager);
  });

  // Copy email.
  document.querySelectorAll("[data-copy]").forEach((b) => {
    b.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
        const t = b.textContent; b.textContent = "Copied"; setTimeout(() => (b.textContent = t), 1500);
      } catch (e) {
        const r = document.createRange(); r.selectNodeContents(document.getElementById("email"));
        getSelection().removeAllRanges(); getSelection().addRange(r);
      }
    });
  });

  const y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
})();
