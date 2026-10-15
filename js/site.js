  // Links de pagamento: trocar "[PREENCHER]" pelos links do Stripe e do PayPal.
  // Enquanto um link não estiver preenchido, o botão abre o WhatsApp.
  var PAGAMENTO = {
    avulsaCartao: "[PREENCHER: link Stripe da sessão avulsa]",
    avulsaPaypal: "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=vany.torriani%40gmail.com&item_name=Sess%C3%A3o+avulsa+de+psican%C3%A1lise+%2850+minutos%29&amount=150.00&currency_code=BRL&no_shipping=1",
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
    var a = e.target.closest && e.target.closest(".js-wa, [data-pay]");
    if (a) medir(a.dataset.pay ? "clique_pagamento" : "clique_whatsapp", a.dataset.pay || a.textContent.trim().slice(0, 60));
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

  document.querySelectorAll("[data-pay]").forEach(function (a) {
    var link = PAGAMENTO[a.dataset.pay] || "";
    var nome = a.dataset.pay.indexOf("Paypal") > -1 ? "PayPal" : "cartão";
    var plano = a.dataset.pay.indexOf("mensal") === 0 ? "o plano mensal" : "a sessão avulsa";
    a.href = link.indexOf("https://") === 0 ? link : "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent("Olá, Vanessa. Quero pagar " + plano + " com " + nome + ".");
    a.target = "_blank"; a.rel = "noopener";
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
