/* ==========================================================================
   Fair Property Services Ltd
   Navigation, price estimator, contact form
   ========================================================================== */

(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     Settings: edit these to match your business
     ---------------------------------------------------------------------- */
  var CONFIG = {
    locale: "en-GB",
    currency: "GBP",
    contactEmail: "fairpropertyservices@gmail.com",

    // Optional. Paste a form service URL (for example a Formspree endpoint)
    // to send messages directly. If empty, the form opens the visitor's
    // email app with the message filled in.
    formEndpoint: "",

    // Estimate range around the calculated price
    spreadLow: 0.9,
    spreadHigh: 1.15
  };

  // Rates used by the price estimator. Keep them in line with the
  // "from" prices shown in the Services section of index.html.
  var SERVICES = {
    painting:   { unit: ["room", "rooms"],       rate: 180, min: 180, qtyMin: 1,  qtyMax: 10,  step: 1,   qty: 3,  note: "Labour and standard paint. Ceilings and trim may vary." },
    pest:       { unit: ["treatment", "treatments"], rate: 70, min: 70,  qtyMin: 1,  qtyMax: 5,   step: 1,   qty: 1,  note: "Includes a follow-up visit if needed." },
    heating:    { unit: ["hour", "hours"],       rate: 65,  min: 65,  qtyMin: 1,  qtyMax: 16,  step: 0.5, qty: 2,  note: "Parts are billed separately at cost." },
    plumbing:   { unit: ["hour", "hours"],       rate: 60,  min: 60,  qtyMin: 1,  qtyMax: 16,  step: 0.5, qty: 2,  note: "Parts are billed separately at cost." },
    gassafety:  { unit: ["check", "checks"],     rate: 65,  min: 65,  qtyMin: 1,  qtyMax: 10,  step: 1,   qty: 1,  note: "Carried out by a Gas Safe registered engineer." },
    boiler:     { unit: ["hour", "hours"],       rate: 90,  min: 90,  qtyMin: 1,  qtyMax: 16,  step: 0.5, qty: 2,  note: "New installations are quoted after a home visit." }
  };

  var SERVICE_LABELS = {
    painting: "Painting and decorating",
    pest: "Pest control",
    heating: "Heating",
    plumbing: "Plumbing",
    gassafety: "Gas safety check",
    boiler: "Boiler installation and repair"
  };

  var money = new Intl.NumberFormat(CONFIG.locale, {
    style: "currency",
    currency: CONFIG.currency,
    maximumFractionDigits: 0
  });

  function $(selector, root) { return (root || document).querySelector(selector); }

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------------------
     Header: border appears once the page scrolls
     ---------------------------------------------------------------------- */
  var header = $(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-stuck", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */
  var toggle = $(".nav-toggle");
  var nav = $("#site-nav");

  function setNav(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        toggle.focus();
      }
    });

    // Reset when the layout switches to desktop
    window.matchMedia("(min-width: 860px)").addEventListener("change", function (e) {
      if (e.matches) setNav(false);
    });
  }

  /* ----------------------------------------------------------------------
     Price estimator
     ---------------------------------------------------------------------- */
  var estService = $("#est-service");
  var estQty = $("#est-qty");
  var estQtyOut = $("#est-qty-out");
  var estPrice = $("#est-price");
  var estNote = $("#est-note");
  var estCta = $("#est-cta");

  var lastEstimate = "";

  function formatQty(service, qty) {
    var unit = qty === 1 ? service.unit[0] : service.unit[1];
    return qty + " " + unit;
  }

  function roundTo5(n) { return Math.round(n / 5) * 5; }

  function updateEstimate() {
    var service = SERVICES[estService.value];
    if (!service) return;

    var qty = parseFloat(estQty.value);
    var total = Math.max(service.min, service.rate * qty);
    var low = roundTo5(total * CONFIG.spreadLow);
    var high = roundTo5(total * CONFIG.spreadHigh);

    estQtyOut.textContent = formatQty(service, qty);
    estQtyOut.setAttribute("value", estQtyOut.textContent);
    estPrice.textContent = money.format(low) + " to " + money.format(high);
    estNote.textContent = service.note;

    lastEstimate =
      SERVICE_LABELS[estService.value] + ", " + formatQty(service, qty) +
      ". Rough estimate from the website: " + estPrice.textContent + ".";
  }

  function loadService() {
    var service = SERVICES[estService.value];
    if (!service) return;
    estQty.min = service.qtyMin;
    estQty.max = service.qtyMax;
    estQty.step = service.step;
    estQty.value = service.qty;
    updateEstimate();
  }

  if (estService && estQty) {
    estService.addEventListener("change", loadService);
    estQty.addEventListener("input", updateEstimate);
    $("#estimator").addEventListener("submit", function (e) { e.preventDefault(); });
    loadService();

    // Carry the estimate into the contact form
    if (estCta) {
      estCta.addEventListener("click", function () {
        var contactService = $("#c-service");
        var message = $("#c-message");
        if (contactService) contactService.value = SERVICE_LABELS[estService.value] || "";
        if (message && !message.value.trim()) message.value = lastEstimate + "\n\n";
      });
    }
  }

  /* ----------------------------------------------------------------------
     Contact form
     ---------------------------------------------------------------------- */
  var form = $("#contact-form");
  var status = $("#form-status");

  function setStatus(text, state) {
    if (!status) return;
    status.textContent = text;
    if (state) status.setAttribute("data-state", state);
    else status.removeAttribute("data-state");
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      setStatus("", null);

      if (!form.reportValidity()) {
        setStatus("Please complete the highlighted fields.", "error");
        return;
      }

      var data = new FormData(form);

      // Honeypot: real visitors never fill this in
      if (data.get("website")) return;

      var name = String(data.get("name") || "").trim();
      var email = String(data.get("email") || "").trim();
      var phone = String(data.get("phone") || "").trim();
      var service = String(data.get("service") || "").trim();
      var message = String(data.get("message") || "").trim();

      if (CONFIG.formEndpoint) {
        var submitButton = form.querySelector("button[type='submit']");
        submitButton.disabled = true;
        setStatus("Sending your message…", null);

        fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ name: name, email: email, phone: phone, service: service, message: message })
        })
          .then(function (response) {
            if (!response.ok) throw new Error("Request failed");
            form.reset();
            setStatus("Thank you. We’ll reply within one working day.", "success");
          })
          .catch(function () {
            setStatus("The message didn’t send. Please try again, or email " + CONFIG.contactEmail + ".", "error");
          })
          .finally(function () {
            submitButton.disabled = false;
          });
        return;
      }

      // Fallback: open the visitor's email app with the message prepared
      var subject = "Quote request: " + service;
      var body =
        message + "\n\n" +
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        (phone ? "Phone: " + phone + "\n" : "");

      window.location.href =
        "mailto:" + CONFIG.contactEmail +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      setStatus("Your email app should open with the message ready to send. If it doesn’t, email us at " + CONFIG.contactEmail + ".", "success");
    });
  }
})();
