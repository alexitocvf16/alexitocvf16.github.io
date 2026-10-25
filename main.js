/* Alejandro Sánchez Moreno · Portfolio — JS clásico (sin módulos) */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safe(name, fn) {
    try { fn(); } catch (err) { if (window.console) console.warn("[" + name + "]", err); }
  }

  /* ---------- Reveal al hacer scroll (el contenido ya está en el HTML) ---------- */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window)) return;

    // lo que ya está a la vista se muestra sin esperar
    var vh = window.innerHeight;
    items.forEach(function (el) {
      if (el.getBoundingClientRect().top < vh * 0.95) el.classList.add("is-in");
    });
    doc.classList.add("js");

    // escalonado suave entre hermanos de una misma rejilla
    items.forEach(function (el) {
      var parent = el.parentElement;
      var siblings = Array.prototype.filter.call(parent.children, function (c) { return c.classList.contains("reveal"); });
      var i = siblings.indexOf(el);
      if (i > 0) el.style.setProperty("--d", Math.min(i, 5) * 70 + "ms");
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });

    items.forEach(function (el) { if (!el.classList.contains("is-in")) io.observe(el); });

    // red de seguridad: nada se queda oculto si el observer falla
    setTimeout(function () {
      items.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
      });
    }, 2500);
  }

  /* ---------- Navegación ---------- */
  function initNav() {
    var nav = document.getElementById("nav");
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");

    function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 8); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function close() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
    }
    toggle.addEventListener("click", function () {
      var open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    links.addEventListener("click", function (e) { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    // enlace activo según la sección visible
    if (!("IntersectionObserver" in window)) return;
    var map = {};
    Array.prototype.forEach.call(links.querySelectorAll("a:not(.btn)"), function (a) {
      map[a.getAttribute("href").slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = map[e.target.id];
        if (!a) return;
        if (e.isIntersecting) {
          Object.keys(map).forEach(function (k) { map[k].classList.remove("is-current"); });
          a.classList.add("is-current");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  /* ---------- Rol con efecto de escritura ---------- */
  function initTypewriter() {
    var el = document.getElementById("typeText");
    if (!el) return;
    var roles = [
      "Administrador de Sistemas",
      "Técnico de Ciberseguridad",
      "Junior Pentester (eJPTv2)",
      "Estudiante de 2º de ASIR",
      "Ethical Hacking & Bug Bounty",
      "Automatizaciones con n8n e IA",
      "Desarrollo web seguro"
    ];
    var r = 0, c = roles[0].length, deleting = true;
    function tick() {
      var word = roles[r];
      c += deleting ? -1 : 1;
      el.textContent = word.slice(0, c);
      var wait = deleting ? 38 : 75;
      if (!deleting && c === word.length) { deleting = true; wait = 2200; }
      else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; wait = 350; }
      setTimeout(tick, wait);
    }
    setTimeout(tick, 2600);
  }

  /* ---------- Red de nodos animada (fondo fijo de toda la página) ---------- */
  function initNet() {
    var canvas = document.getElementById("bgNet");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, nodes = [], running = false, raf = 0;
    var mouse = { x: -9999, y: -9999 };
    var LINK = 140;

    function build() {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(22, Math.min(75, Math.round((w * h) / 20000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.4 + 0.8,
          hub: Math.random() < 0.12
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            var alpha = (1 - Math.sqrt(d2) / LINK) * 0.2;
            ctx.strokeStyle = "rgba(122,170,255," + alpha.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        var mdx = a.x - mouse.x, mdy = a.y - mouse.y;
        var near = mdx * mdx + mdy * mdy < 160 * 160;
        if (near) {
          ctx.strokeStyle = "rgba(69,200,245,0.25)";
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = a.hub ? "rgba(69,200,245,0.8)" : near ? "rgba(165,210,255,0.9)" : "rgba(122,170,255,0.5)";
        ctx.beginPath(); ctx.arc(a.x, a.y, a.hub ? a.r + 1.2 : a.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    function step() {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
      }
      draw();
      raf = requestAnimationFrame(step);
    }

    function start() { if (!running && !document.hidden && !reduced) { running = true; raf = requestAnimationFrame(step); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    build();
    draw(); // con movimiento reducido queda una red estática
    start();

    var resizeT, lastW = window.innerWidth;
    window.addEventListener("resize", function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () {
        // en móvil la barra del navegador cambia el alto al hacer scroll: solo se reconstruye si cambia el ancho
        if (window.innerWidth === lastW && Math.abs(window.innerHeight - h) < 160) return;
        lastW = window.innerWidth;
        build(); draw();
      }, 150);
    });
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      mouse.x = e.clientX; mouse.y = e.clientY;
      if (reduced) draw();
    }, { passive: true });
    document.addEventListener("mouseleave", function () { mouse.x = mouse.y = -9999; if (reduced) draw(); });
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  }

  /* ---------- Foco de luz en tarjetas ---------- */
  function initSpotlight() {
    if (window.matchMedia && matchMedia("(hover: none)").matches) return;
    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".card");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  /* ---------- Filtro de proyectos ---------- */
  function initFilters() {
    var buttons = document.querySelectorAll(".filter");
    var cards = document.querySelectorAll(".project");
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        Array.prototype.forEach.call(buttons, function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", String(on));
        });
        Array.prototype.forEach.call(cards, function (card) {
          var show = f === "all" || card.getAttribute("data-cat") === f;
          card.classList.toggle("is-hidden", !show);
          if (show) card.classList.add("is-in");
        });
      });
    });
  }

  /* ---------- Copiar email ---------- */
  function initCopy() {
    var btn = document.getElementById("copyMail");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var mail = btn.getAttribute("data-mail");
      function done(ok) {
        btn.textContent = ok ? "Copiado ✓" : mail;
        setTimeout(function () { btn.textContent = "Copiar email"; }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(mail).then(function () { done(true); }, function () { done(false); });
      } else { done(false); }
    });
  }

  /* ---------- Terminal interactiva (salida construida con textContent, sin innerHTML) ---------- */
  function initTerminal() {
    var form = document.getElementById("termForm");
    var input = document.getElementById("termIn");
    var out = document.getElementById("termOut");
    if (!form || !input || !out) return;

    var history = [], hIndex = 0;

    function line(text, cls) {
      var p = document.createElement("p");
      p.className = "term__res" + (cls ? " " + cls : "");
      p.textContent = text;
      out.appendChild(p);
    }
    function lines(arr) { arr.forEach(function (t) { line(t); }); }
    function go(id) {
      var el = document.getElementById(id);
      if (el) setTimeout(function () { el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); }, 350);
    }

    var commands = {
      help: function () {
        lines([
          "Comandos disponibles:",
          "  whoami        quién soy",
          "  skills        competencias por área",
          "  certs         certificaciones",
          "  proyectos     ir a los proyectos",
          "  writeups      ir a las máquinas resueltas",
          "  contacto      datos de contacto",
          "  cv            abrir el currículum",
          "  clear         limpiar la pantalla"
        ]);
      },
      whoami: function () {
        lines([
          "Alejandro Sánchez Moreno",
          "Administrador de sistemas y técnico de ciberseguridad · 2º ASIR",
          "Toledo, España · carnet B y coche propio · disponibilidad inmediata"
        ]);
      },
      skills: function () {
        lines([
          "[seguridad]  bug bounty · eJPTv2 · Nmap · Burp Suite · Wireshark · Splunk · AD",
          "[sistemas]   Windows Server · Active Directory · GPO · Linux · Cisco IOS",
          "[virt]       VMware · VirtualBox · Docker · Portainer",
          "[cloud/ia]   n8n · agentes de IA · Azure · Entra ID · AWS · Python",
          "[web]        Next.js · Supabase · Vercel · TLS y cabeceras de seguridad"
        ]);
      },
      certs: function () {
        lines([
          "eJPTv2 ............................ INE Security",
          "CCST Cybersecurity ................ Cisco",
          "SC-900 ............................ Microsoft",
          "Azure AI Fundamentals ............. Microsoft",
          "IT Specialist · Cybersecurity ..... Certiport"
        ]);
        go("certificaciones");
      },
      proyectos: function () { line("Abriendo proyectos…"); go("proyectos"); },
      writeups: function () { line("Abriendo máquinas resueltas…"); go("hacking"); },
      contacto: function () {
        lines([
          "email     sanchezalexmoreno16@gmail.com",
          "linkedin  linkedin.com/in/alexitosm16",
          "github    github.com/alexitocvf16",
          "web       grootitech.es"
        ]);
        go("contacto");
      },
      cv: function () { line("Abriendo Curriculum.pdf…"); window.open("Curriculum.pdf", "_blank", "noopener"); },
      clear: function () { out.textContent = ""; },
      sudo: function () { line("guest no está en el fichero sudoers. Este incidente quedará registrado.", "term__res--err"); },
      ls: function () { line("proyectos/  writeups/  certs/  Curriculum.pdf"); }
    };
    commands.projects = commands.proyectos;
    commands.contact = commands.contacto;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var raw = input.value.trim();
      input.value = "";
      if (!raw) return;
      history.push(raw); hIndex = history.length;

      var echo = document.createElement("p");
      var ps = document.createElement("span");
      ps.className = "term__ps";
      ps.textContent = "guest@alejandro:~$";
      echo.appendChild(ps);
      echo.appendChild(document.createTextNode(" " + raw));
      out.appendChild(echo);

      var cmd = raw.toLowerCase().split(/\s+/)[0];
      if (cmd === "sudo" || Object.prototype.hasOwnProperty.call(commands, cmd)) {
        commands[cmd]();
      } else {
        line("comando no encontrado: " + cmd + " · prueba con help", "term__res--err");
      }
      out.scrollTop = out.scrollHeight;
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp" && hIndex > 0) { hIndex--; input.value = history[hIndex]; e.preventDefault(); }
      else if (e.key === "ArrowDown") {
        hIndex = Math.min(history.length, hIndex + 1);
        input.value = history[hIndex] || "";
        e.preventDefault();
      }
    });

    out.addEventListener("click", function () { input.focus({ preventScroll: true }); });
  }

  function init() {
    safe("reveal", initReveal);
    safe("nav", initNav);
    safe("typewriter", initTypewriter);
    safe("net", initNet);
    safe("spotlight", initSpotlight);
    safe("filters", initFilters);
    safe("copy", initCopy);
    safe("terminal", initTerminal);
    safe("year", function () { document.getElementById("year").textContent = new Date().getFullYear(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
