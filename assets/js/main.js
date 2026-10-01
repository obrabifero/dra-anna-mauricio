/* Landing Dra. Anna Carolina Maurício — animações GSAP + anime.js */
(function () {
  "use strict";

  /* Fallback de segurança: se as libs não carregarem, mostra tudo */
  function showAll() {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.style.opacity = 1; el.style.transform = "none";
    });
    var p = document.getElementById("preloader");
    if (p) p.style.display = "none";
  }
  if (typeof gsap === "undefined" || typeof anime === "undefined") { showAll(); return; }
  gsap.registerPlugin(ScrollTrigger);

  var WA_NUMBER = "5521997709554";

  /* ---------- 1. Preloader (GSAP) ---------- */
  var preloaderEl = document.getElementById("preloader");
  var preTl = gsap.timeline({ onComplete: heroIntro });
  preTl
    .to(".pre-bar i", { width: "100%", duration: .7, ease: "power2.inOut" })
    .to("#preloader", {
      opacity: 0, duration: .5, ease: "power2.inOut",
      onComplete: function () { preloaderEl.style.display = "none"; }
    }, "+=0.12");
  /* rede de segurança: nunca prender a página no preloader */
  setTimeout(function () {
    if (preloaderEl.style.display !== "none") {
      preloaderEl.style.display = "none";
      if (!heroDone) heroIntro();
    }
  }, 4000);

  /* ---------- 2. Entrada do hero (GSAP) ---------- */
  var heroDone = false;
  function heroIntro() {
    if (heroDone) return;
    heroDone = true;
    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to('[data-hero="kicker"]', { opacity: 1, y: 0, duration: .7 }, 0)
      .to('[data-hero="title"] .line > span', { yPercent: 0, duration: 1, stagger: .12 }, .15)
      .to('[data-hero="sub"]', { opacity: 1, y: 0, duration: .7 }, .55)
      .to('[data-hero="ctas"] .btn', { opacity: 1, y: 0, scale: 1, duration: .65, stagger: .11 }, .7)
      .to('[data-hero="proof"]', { opacity: 1, y: 0, duration: .6 }, .9)
      .to('[data-hero="media"] .hero-frame', { opacity: 1, scale: 1, rotate: 2, duration: 1.1 }, .35)
      .to('[data-hero="card1"]', { opacity: 1, x: 0, duration: .7 }, 1)
      .to('[data-hero="card2"]', { opacity: 1, x: 0, duration: .7 }, 1.1)
      .add(function () {
        document.querySelector('[data-hero="card1"]').classList.add("floating");
        document.querySelector('[data-hero="card2"]').classList.add("floating");
      });
  }
  /* estado inicial (antes do preloader sair) */
  gsap.set('[data-hero="kicker"],[data-hero="sub"],[data-hero="proof"]', { opacity: 0, y: 18 });
  gsap.set('[data-hero="ctas"] .btn', { opacity: 0, y: 22, scale: .94 });
  gsap.set('[data-hero="media"] .hero-frame', { opacity: 0, scale: .94, rotate: 6 });
  gsap.set('[data-hero="card1"]', { opacity: 0, x: -24 });
  gsap.set('[data-hero="card2"]', { opacity: 0, x: 24 });
  gsap.set('[data-hero="title"] .line > span', { yPercent: 110 });

  /* ---------- 3. Reveals por scroll (GSAP ScrollTrigger) ---------- */
  /* itens dentro de grids com stagger são tratados no bloco seguinte */
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    if (el.closest(".treat-grid,.depo-grid,.check-list")) return;
    gsap.fromTo(el, { opacity: 0, y: 44 }, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    });
  });

  /* stagger natural para grids: anima os filhos quando o grid entra na tela */
  ["treat-grid", "depo-grid", "check-list"].forEach(function (cls) {
    var grids = document.getElementsByClassName(cls);
    Array.prototype.forEach.call(grids, function (grid) {
      var items = grid.querySelectorAll("[data-reveal]");
      items.forEach(function (item, i) {
        gsap.fromTo(item, { opacity: 0, y: 44 }, {
          opacity: 1, y: 0, duration: .9, delay: (i % 3) * .12, ease: "power3.out",
          scrollTrigger: { trigger: grid, start: "top 85%", once: true }
        });
      });
    });
  });

  /* ---------- 4. Parallax nas fotos ---------- */
  gsap.utils.toArray("[data-parallax] img").forEach(function (img) {
    gsap.fromTo(img, { yPercent: -8, scale: 1.12 }, {
      yPercent: 8, scale: 1.12, ease: "none",
      scrollTrigger: { trigger: img.closest("[data-parallax]"), start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  /* ---------- 5. Contadores ---------- */
  document.querySelectorAll(".count").forEach(function (el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || "0", 10);
    var obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: target, duration: 1.8, ease: "power2.out",
          onUpdate: function () {
            el.textContent = dec ? obj.v.toFixed(dec).replace(".", ",") : Math.round(obj.v);
          }
        });
      }
    });
  });

  /* ---------- 6. Tilt 3D nos cards ---------- */
  if (window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5;
        var y = (e.clientY - r.top) / r.height - .5;
        gsap.to(card, { rotateY: x * 10, rotateX: -y * 10, y: -4, duration: .4, ease: "power2.out", transformPerspective: 800 });
      });
      card.addEventListener("mouseleave", function () {
        gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: .7, ease: "elastic.out(1,.6)" });
      });
    });

    /* ---------- 7. Botões magnéticos ---------- */
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - r.left - r.width / 2) * .25,
          y: (e.clientY - r.top - r.height / 2) * .35,
          duration: .3, ease: "power2.out"
        });
      });
      btn.addEventListener("mouseleave", function () {
        gsap.to(btn, { x: 0, y: 0, duration: .6, ease: "elastic.out(1,.5)" });
      });
    });
  }

  /* ---------- 8. Header ao rolar ---------- */
  var header = document.getElementById("site-header");
  ScrollTrigger.create({
    start: 60, end: "max",
    onUpdate: function (self) { header.classList.toggle("scrolled", self.scroll() > 60); }
  });

  /* ---------- 9. Formulário → WhatsApp ---------- */
  var form = document.getElementById("lead-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nome = document.getElementById("f-nome");
    var fone = document.getElementById("f-fone");
    var interesse = document.getElementById("f-interesse");
    var ok = true;
    [nome, fone].forEach(function (f) {
      var bad = !f.value.trim() || (f === fone && f.value.replace(/\D/g, "").length < 10);
      f.classList.toggle("err", bad);
      if (bad) ok = false;
    });
    if (!ok) {
      anime({ targets: ".capture-form", translateX: [0, -10, 10, -6, 6, 0], duration: 400, easing: "easeInOutQuad" });
      return;
    }
    var msg = "Olá! Meu nome é " + nome.value.trim() +
      " (" + fone.value.trim() + "). Quero agendar uma avaliação com a Dra. Anna Carolina Maurício. Tenho interesse em: " +
      interesse.value + ".";
    window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg), "_blank");
    anime({ targets: form.querySelector('button[type="submit"]'), scale: [.96, 1], duration: 350, easing: "easeOutBack" });
  });
  ["f-nome", "f-fone"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function (e) { e.target.classList.remove("err"); });
  });
  /* máscara simples de telefone */
  document.getElementById("f-fone").addEventListener("input", function (e) {
    var d = e.target.value.replace(/\D/g, "").slice(0, 11);
    var out = d;
    if (d.length > 2) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 6) out = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length > 10 ? 7 : 6) + "-" + d.slice(d.length > 10 ? 7 : 6);
    e.target.value = out;
  });

  /* ---------- 10. Microinteração nos depoimentos (anime.js) ---------- */
  gsap.utils.toArray(".depo .depo-point").forEach(function (pt, i) {
    ScrollTrigger.create({
      trigger: pt, start: "top 85%", once: true,
      onEnter: function () {
        anime({ targets: pt.querySelectorAll(".stars"), scale: [0, 1], duration: 600, delay: 200 + i * 120, easing: "easeOutBack" });
      }
    });
  });

  /* recalibra os gatilhos de scroll depois que as imagens carregarem */
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
