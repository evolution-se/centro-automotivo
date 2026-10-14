/* ============================================================
   TORQUE FORTE CENTRO AUTOMOTIVO — script.js (vanilla, sem deps)
   Blocos:
   01 WhatsApp (numero central + montador de link)
   02 Flag .js (reveal CSS so com JS ativo)
   03 Ano automatico no rodape
   04 CTAs WhatsApp (data-whatsapp-message)
   05 Header transparente -> solido + voltar ao topo
   06 Menu mobile (fecha ao navegar)
   07 Scroll spy (link ativo)
   08 Reveal on scroll
   09 Galeria (modal + teclado)
   10 Mascara de telefone
   11 Formulario -> WhatsApp
   ============================================================ */

/* ---------- 01. WhatsApp ---------- */
// SUBSTITUIR pelo numero real da oficina (somente digitos, com DDI+DDD).
const WHATSAPP_NUMBER = "5511900000000"; // SUBSTITUIR pelo número real

function waLink(message) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}

/* ---------- 02. Flag .js ---------- */
// O CSS esconde .reveal somente com .js: sem JS, tudo visível.
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 03. Ano automatico ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  var year2 = document.getElementById("year2");
  if (year2) {
    year2.textContent = new Date().getFullYear();
  }

  /* ---------- 04. CTAs WhatsApp ---------- */
  // Todo <a data-whatsapp-message="..."> ganha href wa.me pronto.
  document.querySelectorAll("[data-whatsapp-message]").forEach(function (el) {
    var msg = el.getAttribute("data-whatsapp-message");
    if (msg) {
      el.setAttribute("href", waLink(msg));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    }
  });

  /* ---------- 05. Header + voltar ao topo ---------- */
  // Transparente só na home (tem .hero); nas demais, sempre sólido.
  var header = document.getElementById("siteHeader");
  var isHome = !!document.querySelector(".hero");

  function onScroll() {
    if (isHome && window.scrollY <= 40) {
      header.classList.remove("scrolled");
      header.classList.add("transparent");
    } else {
      header.classList.add("scrolled");
      header.classList.remove("transparent");
    }
    var backTop = document.getElementById("backTop");
    if (backTop) {
      backTop.classList.toggle("show", window.scrollY > 600);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
/*__JS2__*/
  /* ---------- 06. Menu mobile ---------- */
  // Fecha o collapse do Bootstrap ao tocar em um link ou CTA.
  document.querySelectorAll("#navMenu .nav-link, #navMenu .btn-cta").forEach(function (a) {
    a.addEventListener("click", function () {
      var menu = document.getElementById("navMenu");
      if (menu && menu.classList.contains("show")) {
        var toggler = document.querySelector('[data-bs-target="#navMenu"]');
        if (toggler) {
          toggler.click();
        }
      }
    });
  });

  /* ---------- 07. Scroll spy ---------- */
  // Marca o link da seção visível com .active (sublinhado laranja).
  var sectionIds = ["servicos", "oficina", "diferenciais", "orcamento", "estrutura", "faq", "contato"];
  var sections = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = [].slice.call(document.querySelectorAll("#navMenu .nav-link"));

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 08. Reveal on scroll ---------- */
  // Fade + translateY com stagger de 80ms em grids.
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = ((i % 6) * 80) + "ms";
          entry.target.classList.add("is-visible");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (r) { revealObs.observe(r); });
  } else {
    revealEls.forEach(function (r) { r.classList.add("is-visible"); });
  }
/*__JS3__*/
  /* ---------- 09. Galeria (modal + teclado) ---------- */
  // Cards .g-item abrem via data-bs-toggle; Enter/Espaço no teclado.
  document.querySelectorAll(".g-item").forEach(function (item) {
    item.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        item.click();
      }
    });
  });

  var galModal = document.getElementById("galModal");
  if (galModal) {
    galModal.addEventListener("show.bs.modal", function (ev) {
      var trigger = ev.relatedTarget;
      if (!trigger) {
        return;
      }
      var src = trigger.getAttribute("data-full") || trigger.querySelector("img").src;
      var caption = trigger.getAttribute("data-cap") || "";
      document.getElementById("galModalImg").src = src;
      document.getElementById("galModalCap").textContent = caption;
    });
  }

  /* ---------- 10. Mascara de telefone ---------- */
  // Formato visual (00) 00000-0000; validação conta os dígitos.
  var phoneInput = document.getElementById("fFone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      var digits = phoneInput.value.replace(/\D/g, "").slice(0, 11);
      if (digits.length > 10) {
        phoneInput.value = "(" + digits.slice(0, 2) + ") " + digits.slice(2, 7) + "-" + digits.slice(7);
      } else if (digits.length > 6) {
        phoneInput.value = "(" + digits.slice(0, 2) + ") " + digits.slice(2, 6) + "-" + digits.slice(6);
      } else if (digits.length > 2) {
        phoneInput.value = "(" + digits.slice(0, 2) + ") " + digits.slice(2);
      } else {
        phoneInput.value = digits;
      }
    });
  }

  /* ---------- 11. Formulario -> WhatsApp ---------- */
  // Valida, monta a mensagem e abre o wa.me em nova aba.
  var quoteForm = document.getElementById("orcForm");
  if (quoteForm) {
    quoteForm.addEventListener("submit", function (ev) {
      ev.preventDefault();

      var nameField = document.getElementById("fNome");
      var phoneField = document.getElementById("fFone");
      var vehicleField = document.getElementById("fVeiculo");
      var serviceField = document.getElementById("fServico");
      var descField = document.getElementById("fDesc");
      var privacyCheck = document.getElementById("fPriv");

      var allValid = true;

      [
        [nameField, function (v) { return v.trim().length >= 2; }],
        [phoneField, function (v) { return v.replace(/\D/g, "").length >= 10; }],
        [vehicleField, function (v) { return v.trim().length >= 2; }],
        [descField, function (v) { return v.trim().length >= 5; }]
      ].forEach(function (pair) {
        var field = pair[0];
        var isValid = pair[1](field.value);
        field.classList.toggle("is-invalid", !isValid);
        field.setAttribute("aria-invalid", String(!isValid));
        if (!isValid) {
          allValid = false;
        }
      });

      if (!privacyCheck.checked) {
        privacyCheck.classList.add("is-invalid");
        allValid = false;
      } else {
        privacyCheck.classList.remove("is-invalid");
      }

      if (!allValid) {
        document.getElementById("formMsg").textContent = "Verifique os campos destacados e tente novamente.";
        return;
      }

      var message =
        "Olá! Meu nome é " + nameField.value.trim() +
        ". Veículo: " + vehicleField.value.trim() +
        ". Telefone: " + phoneField.value.trim() +
        ". Serviço: " + serviceField.value +
        ". Problema: " + descField.value.trim();

      window.open(waLink(message), "_blank", "noopener");
    });
  }

});
