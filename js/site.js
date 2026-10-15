  // Links de pagamento: trocar "[PREENCHER]" pelos links do Stripe e do PayPal.
  // Enquanto um link não estiver preenchido, o botão abre o WhatsApp.
  var PAGAMENTO = {
    inicialCartao: "[PREENCHER: link Stripe da sessão avulsa]",
    inicialPaypal: "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=vany.torriani%40gmail.com&item_name=Sess%C3%A3o+avulsa+de+psican%C3%A1lise+%2850+minutos%29&amount=150.00&currency_code=BRL&no_shipping=1",
    mensalCartao: "[PREENCHER: link Stripe do plano mensal]",
    mensalPaypal: "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=vany.torriani%40gmail.com&item_name=Plano+mensal+de+psican%C3%A1lise+%284+sess%C3%B5es%29&amount=540.00&currency_code=BRL&no_shipping=1"
  };
  // Medição: cole aqui o ID do Google Analytics (ex.: "G-XXXXXXX"). Vazio, nada é carregado.
  var GA_ID = "";
  if (GA_ID) {
    var g = document.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID; document.head.appendChild(g);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", GA_ID);
  }
  function medir(nome, rotulo) { if (window.gtag) gtag("event", nome, { rotulo: rotulo }); }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest(".js-wa, .js-book, .pay-option");
    if (a) medir(a.dataset.method ? "clique_pagamento" : a.dataset.book ? "clique_agendar" : "clique_whatsapp", a.dataset.method || a.dataset.book || a.textContent.trim().slice(0, 60));
  });
  // Número da Vanessa (só dígitos, com 55 e DDD).
  var WHATSAPP = "5551993497223";
  var MSG = "Olá, Vanessa. Vi seu site e gostaria de agendar uma primeira conversa.";
  var waUrl = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(MSG);
  document.querySelectorAll(".js-wa").forEach(function (a) {
    a.href = a.dataset.msg ? "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(a.dataset.msg) : waUrl;
    a.target = "_blank"; a.rel = "noopener";
  });

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  function selectTab(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute("aria-selected", on);
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
    });
  }
  function tabFromHash() {
    var t = location.hash && document.getElementById("tab-" + location.hash.slice(1));
    if (t) { selectTab(t); t.scrollIntoView({ block: "center" }); }
  }
  if (tabs.length) { tabFromHash(); window.addEventListener("hashchange", tabFromHash); }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(t); });
    t.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { var n = tabs[(i + d + tabs.length) % tabs.length]; selectTab(n); n.focus(); }
    });
  });


  var ano = document.getElementById("ano"); if (ano) ano.textContent = new Date().getFullYear();

  // Menu lateral
  var menuBtn = document.querySelector(".menu-btn"), drawer = document.getElementById("drawer"), backdrop = document.querySelector(".drawer-backdrop");
  function openMenu() { drawer.hidden = false; backdrop.hidden = false; document.body.classList.add("menu-open"); menuBtn.setAttribute("aria-expanded", "true"); drawer.querySelector(".drawer-close").focus(); }
  function closeMenu() { drawer.hidden = true; backdrop.hidden = true; document.body.classList.remove("menu-open"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.focus(); }
  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", openMenu);
    drawer.querySelector(".drawer-close").addEventListener("click", closeMenu);
    backdrop.addEventListener("click", closeMenu);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !drawer.hidden) closeMenu(); });
    drawer.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { if (!drawer.hidden) closeMenu(); }); });
  }
  // Agendar: escolher a forma de pagamento
  var dlg = document.getElementById("pay-dialog");
  var PLANOS = {
    inicial: { nome: "Sessão inicial", resumo: "R$ 150, 50 minutos, online", msg: "a sessão inicial" },
    mensal: { nome: "Plano mensal", resumo: "R$ 540 por mês, 4 sessões", msg: "o plano mensal" }
  };
  function wa(texto) { return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto); }
  function abrirPagamento(plano) {
    var p = PLANOS[plano] || PLANOS.inicial;
    document.getElementById("pay-over").textContent = p.nome;
    document.getElementById("pay-summary").textContent = p.resumo;
    dlg.querySelectorAll(".pay-option[data-method]").forEach(function (o) {
      var m = o.dataset.method; if (m === "pix") return;
      var link = PAGAMENTO[plano + (m === "cartao" ? "Cartao" : "Paypal")] || "";
      o.href = link.indexOf("https://") === 0 ? link : wa("Olá, Vanessa. Quero agendar " + p.msg + " e pagar com " + (m === "cartao" ? "cartão" : "PayPal") + ".");
    });
    document.getElementById("pix-box").hidden = true;
    document.getElementById("pix-wa").href = wa("Olá, Vanessa. Paguei " + p.msg + " por Pix e gostaria de marcar o horário.");
    dlg.showModal();
  }
  if (dlg) {
    document.querySelectorAll(".js-book").forEach(function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); abrirPagamento(b.dataset.book); });
    });
    dlg.querySelector('[data-method="pix"]').addEventListener("click", function () {
      var box = document.getElementById("pix-box"); box.hidden = !box.hidden;
    });
    document.getElementById("pix-copy").addEventListener("click", function () {
      var btn = this, chave = document.getElementById("pix-key").textContent;
      function ok() { btn.textContent = "Copiado"; setTimeout(function () { btn.textContent = "Copiar"; }, 2000); }
      if (navigator.clipboard) navigator.clipboard.writeText(chave).then(ok, function () { selecionar(); });
      else selecionar();
      function selecionar() { var r = document.createRange(); r.selectNodeContents(document.getElementById("pix-key")); var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
    });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }
  // Efeitos simples: blocos abaixo da dobra aparecem ao rolar
  (function () {
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var alvos = document.querySelectorAll(".section-head, .card, .topic-card, .steps > li, .abroad, .final-band h2, .other-topics, .faq details");
    var io = new IntersectionObserver(function (itens) {
      itens.forEach(function (it) { if (it.isIntersecting) { it.target.classList.add("in"); io.unobserve(it.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    alvos.forEach(function (el, i) {
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add("reveal"); el.style.transitionDelay = (i % 3) * 70 + "ms"; io.observe(el); }
    });
  })();
