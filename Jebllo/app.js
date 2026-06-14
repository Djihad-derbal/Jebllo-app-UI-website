/* ============================================================
   JEBLLO — shared behaviour
   active nav · mobile drawer · tabs · toggles · table search/filter
   ============================================================ */
(function () {
  "use strict";

  /* ---- Active nav highlight (based on current file) ---- */
  function highlightNav() {
    var page = (location.pathname.split("/").pop() || "dashboard.html").toLowerCase();
    if (page === "" || page === "index.html") page = "dashboard.html";
    document.querySelectorAll(".nav__item[data-page]").forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-page") === page);
    });
  }

  /* ---- Mobile sidebar drawer ---- */
  function initDrawer() {
    var body = document.body;
    document.querySelectorAll("[data-menu-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () { body.classList.toggle("nav-open"); });
    });
    var scrim = document.querySelector(".scrim");
    if (scrim) scrim.addEventListener("click", function () { body.classList.remove("nav-open"); });
  }

  /* ---- Tabs ([data-tabs] wraps .tab buttons with data-tab; panels have data-panel) ---- */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (group) {
      var tabs = group.querySelectorAll(".tab");
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          var name = tab.getAttribute("data-tab");
          tabs.forEach(function (t) { t.classList.toggle("is-active", t === tab); });
          var scope = group.getAttribute("data-tabs-scope");
          var root = scope ? document.querySelector(scope) : document;
          root.querySelectorAll("[data-panel]").forEach(function (p) {
            p.classList.toggle("is-active", p.getAttribute("data-panel") === name);
          });
        });
      });
    });
  }

  /* ---- Client-side table search ([data-search] -> table [data-searchable]) ---- */
  function initSearch() {
    document.querySelectorAll("[data-search]").forEach(function (input) {
      var target = document.querySelector(input.getAttribute("data-search"));
      if (!target) return;
      input.addEventListener("input", function () {
        var q = input.value.trim().toLowerCase();
        target.querySelectorAll("tbody tr").forEach(function (row) {
          row.style.display = row.textContent.toLowerCase().indexOf(q) > -1 ? "" : "none";
        });
      });
    });
  }

  /* ---- Generic list filter for non-table cards ([data-filter-search] -> [data-filter-list]) ---- */
  function initCardFilter() {
    document.querySelectorAll("[data-filter-search]").forEach(function (input) {
      var list = document.querySelector(input.getAttribute("data-filter-search"));
      if (!list) return;
      input.addEventListener("input", function () {
        var q = input.value.trim().toLowerCase();
        list.querySelectorAll("[data-filter-item]").forEach(function (item) {
          item.style.display = item.textContent.toLowerCase().indexOf(q) > -1 ? "" : "none";
        });
      });
    });
  }

  /* ---- Status dropdown filter for tables ([data-status-filter] -> table) ---- */
  function initStatusFilter() {
    document.querySelectorAll("[data-status-filter]").forEach(function (sel) {
      var target = document.querySelector(sel.getAttribute("data-status-filter"));
      if (!target) return;
      sel.addEventListener("change", function () {
        var val = sel.value.toLowerCase();
        target.querySelectorAll("tbody tr").forEach(function (row) {
          var s = (row.getAttribute("data-status") || "").toLowerCase();
          row.style.display = (!val || val === "all" || s === val) ? "" : "none";
        });
      });
    });
  }

  /* ---- Generic modals ([data-modal-open="#id"] opens, [data-modal-close] closes) ---- */
  function openModal(sel) {
    var m = typeof sel === "string" ? document.querySelector(sel) : sel;
    if (m) m.classList.add("is-open");
    return m;
  }
  function closeModal(m) { if (m) m.classList.remove("is-open"); }
  function initModals() {
    document.querySelectorAll("[data-modal-open]").forEach(function (btn) {
      btn.addEventListener("click", function () { openModal(btn.getAttribute("data-modal-open")); });
    });
    document.querySelectorAll(".modal").forEach(function (m) {
      m.querySelectorAll("[data-modal-close], .modal__scrim").forEach(function (el) {
        el.addEventListener("click", function () { closeModal(m); });
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") document.querySelectorAll(".modal.is-open").forEach(closeModal);
    });
  }

  /* ---- Confirm dialog: Jebllo.confirm({title, message, confirmLabel, onConfirm}) ---- */
  var confirmEl = null;
  function buildConfirm() {
    var wrap = document.createElement("div");
    wrap.className = "modal";
    wrap.innerHTML =
      '<div class="modal__scrim" data-c-cancel></div>' +
      '<div class="modal__box" style="width:400px">' +
      '<div class="modal__body" style="text-align:center">' +
      '<div class="modal__icon modal__icon--danger" style="margin:0 auto 14px">' +
      '<svg class="icon" viewBox="0 0 24 24" style="width:26px;height:26px"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg></div>' +
      '<h3 style="margin:0 0 8px;font-size:18px" data-c-title>Confirmer</h3>' +
      '<p class="modal__msg" data-c-msg></p></div>' +
      '<div class="modal__foot"><button class="btn btn--ghost" data-c-cancel>Annuler</button>' +
      '<button class="btn btn--lime" data-c-ok style="background:var(--danger);color:#fff">Supprimer</button></div>' +
      "</div>";
    document.body.appendChild(wrap);
    return wrap;
  }
  function confirmDialog(opts) {
    opts = opts || {};
    if (!confirmEl) confirmEl = buildConfirm();
    confirmEl.querySelector("[data-c-title]").textContent = opts.title || "Confirmer la suppression";
    confirmEl.querySelector("[data-c-msg]").innerHTML = opts.message || "Cette action est irréversible.";
    var okBtn = confirmEl.querySelector("[data-c-ok]");
    okBtn.textContent = opts.confirmLabel || "Supprimer";
    var fresh = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(fresh, okBtn);
    confirmEl.querySelectorAll("[data-c-cancel]").forEach(function (el) {
      el.onclick = function () { closeModal(confirmEl); };
    });
    fresh.onclick = function () { closeModal(confirmEl); if (opts.onConfirm) opts.onConfirm(); };
    openModal(confirmEl);
  }

  /* ---- Wire delete buttons that opt in via [data-confirm-delete] (delegated, so dynamic rows work) ---- */
  function initDeletes() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-confirm-delete]");
      if (!btn) return;
      e.preventDefault(); e.stopPropagation();
      var row = btn.closest("tr, .product, [data-removable]");
      var label = btn.getAttribute("data-confirm-delete");
      if (!label) {
        var nameEl = row && row.querySelector(".cell-media__name, .product__name");
        label = nameEl ? nameEl.textContent.trim() : "cet élément";
      }
      confirmDialog({
        message: "Voulez-vous vraiment supprimer <b>" + label + "</b> ? Cette action est irréversible.",
        onConfirm: function () {
          if (row) row.remove();
          addLog("delete", "Suppression", label + " a été supprimé.");
          toast(label + " supprimé", "danger");
        }
      });
    });
  }

  /* ---- Toasts: Jebllo.toast(message, type) ---- */
  function toast(msg, type) {
    var wrap = document.querySelector(".toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
    var t = document.createElement("div");
    t.className = "toast" + (type === "danger" ? " toast--danger" : "");
    var path = type === "danger"
      ? '<path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>'
      : '<path d="M20 6 9 17l-5-5"/>';
    t.innerHTML = '<svg class="icon" viewBox="0 0 24 24">' + path + '</svg><span></span>';
    t.querySelector("span").textContent = msg;
    wrap.appendChild(t);
    setTimeout(function () { t.style.transition = "opacity .3s"; t.style.opacity = "0"; setTimeout(function () { t.remove(); }, 300); }, 2600);
  }

  /* ---- Activity log (persisted in localStorage) ---- */
  var LOG_KEY = "jebllo_logs";
  function getLogs() { try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch (e) { return []; } }
  function addLog(type, title, sub) {
    var logs = getLogs();
    logs.unshift({ type: type, title: title, sub: sub || "", at: Date.now() });
    try { localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(0, 60))); } catch (e) {}
  }
  function seedLogs() {
    if (getLogs().length) return;
    var now = Date.now(), min = 60000;
    var seed = [
      { type: "order",  title: "Commande livrée",      sub: "#ORD-8820 — STEACK RESTO → Lina K.",  at: now - 4 * min },
      { type: "return", title: "Client de retour",      sub: "Yacine B. a passé sa 8ᵉ commande.",   at: now - 8 * min },
      { type: "new",    title: "Nouvelle cliente",      sub: "Sofiane M. — première commande (#ORD-8819).", at: now - 12 * min },
      { type: "driver", title: "Driver en ligne",       sub: "Rachid H. a démarré son service.",     at: now - 20 * min },
      { type: "create", title: "Produit ajouté",        sub: "Pizza 4 Fromages ajoutée au menu.",    at: now - 55 * min },
      { type: "driver", title: "Driver hors ligne",     sub: "Walid Z. est passé offline.",          at: now - 90 * min }
    ];
    try { localStorage.setItem(LOG_KEY, JSON.stringify(seed)); } catch (e) {}
  }

  /* ---- Notifications (persisted) + bell dropdown ---- */
  var NOTIF_KEY = "jebllo_notifs";
  function getNotifs() {
    try { var n = JSON.parse(localStorage.getItem(NOTIF_KEY)); if (n) return n; } catch (e) {}
    return [
      { type: "return", title: "Client fidèle : Yacine B.", sub: "🔁 8ᵉ commande — client de retour", time: "il y a 2 min" },
      { type: "new",    title: "Nouvelle cliente : Sofiane M.", sub: "🎉 Première commande sur Jebllo (#ORD-8819)", time: "il y a 9 min" },
      { type: "return", title: "Cliente de retour : Lina K.", sub: "🔁 5ᵉ commande ce mois-ci", time: "il y a 12 min" },
      { type: "sys",    title: "Driver hors ligne", sub: "Walid Z. est passé offline", time: "il y a 20 min" }
    ];
  }
  function setNotifs(arr) { try { localStorage.setItem(NOTIF_KEY, JSON.stringify(arr)); } catch (e) {} }
  function notifIcon(type) {
    if (type === "new") return '<path d="M12 2l2.9 6 6.6.6-5 4.3 1.5 6.5L12 16l-6 3.4 1.5-6.5-5-4.3 6.6-.6z"/>';
    if (type === "return") return '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15"/>';
    return '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>';
  }
  function renderNotif(n) {
    var cls = n.type === "new" ? "notif-ic--new" : (n.type === "return" ? "notif-ic--return" : "notif-ic--sys");
    return '<div class="notif-item"><span class="notif-ic ' + cls + '"><svg class="icon" viewBox="0 0 24 24">' + notifIcon(n.type) + '</svg></span>' +
      '<div><div class="notif-item__title"></div><div class="notif-item__sub"></div><div class="notif-item__time"></div></div></div>';
  }
  function initNotifications() {
    var bell = document.querySelector('.icon-btn[aria-label="Notifications"]');
    if (!bell) return;
    var notifs = getNotifs();
    var wrap = document.createElement("div"); wrap.className = "notif";
    bell.parentNode.insertBefore(wrap, bell); wrap.appendChild(bell);
    var panel = document.createElement("div"); panel.className = "notif-panel";
    panel.innerHTML = '<div class="notif-panel__head">Notifications <span class="clear">Tout effacer</span></div><div class="notif-list"></div>';
    wrap.appendChild(panel);
    var list = panel.querySelector(".notif-list");
    function paint() {
      list.innerHTML = "";
      if (!notifs.length) { list.innerHTML = '<div class="notif-empty">Aucune notification</div>'; var d = bell.querySelector(".dot"); if (d) d.remove(); return; }
      notifs.forEach(function (n) {
        var tmp = document.createElement("div"); tmp.innerHTML = renderNotif(n);
        tmp.querySelector(".notif-item__title").textContent = n.title;
        tmp.querySelector(".notif-item__sub").textContent = n.sub;
        tmp.querySelector(".notif-item__time").textContent = n.time;
        list.appendChild(tmp.firstChild);
      });
    }
    paint();
    if (!notifs.length) { var d0 = bell.querySelector(".dot"); if (d0) d0.remove(); }
    bell.addEventListener("click", function (e) { e.stopPropagation(); panel.classList.toggle("is-open"); });
    panel.addEventListener("click", function (e) { e.stopPropagation(); });
    document.addEventListener("click", function () { panel.classList.remove("is-open"); });
    panel.querySelector(".clear").addEventListener("click", function () { notifs = []; setNotifs([]); paint(); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    highlightNav();
    initDrawer();
    initTabs();
    initSearch();
    initCardFilter();
    initStatusFilter();
    initModals();
    initDeletes();
    seedLogs();
    initNotifications();
  });

  /* expose for inline page scripts */
  window.Jebllo = {
    highlightNav: highlightNav, openModal: openModal, closeModal: closeModal, confirm: confirmDialog,
    toast: toast, log: addLog, getLogs: getLogs
  };
})();
