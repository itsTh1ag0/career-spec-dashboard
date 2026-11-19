(function () {
  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");
  var status = document.getElementById("status");
  var sheet = document.getElementById("sheet");

  var ABSENT_LABELS = {
    team_sizes: "Team sizes",
    coworker_counts: "Co-workers",
    skills_count: "Skills count",
    skills_categories: "Skill categories",
    timezones: "Timezones",
    roles: "Roles",
    escalations_handled: "Escalations handled",
    careertaskforce: "Career Taskforce"
  };

  function currentTheme() {
    return root.dataset.theme === "light" ? "light" : "dark";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (!toggle) return;
    var dark = theme === "dark";
    toggle.setAttribute("aria-pressed", dark ? "true" : "false");
    toggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }

  applyTheme(currentTheme());

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("career-spec-theme", next);
      } catch (e) {}
      applyTheme(next);
    });
  }

  var themeQuery = new URLSearchParams(location.search);
  if (!themeQuery.has("theme")) {
    var media = window.matchMedia("(prefers-color-scheme: dark)");
    var onScheme = function () {
      var saved = null;
      try {
        saved = localStorage.getItem("career-spec-theme");
      } catch (e) {}
      if (saved === "light" || saved === "dark") return;
      applyTheme(media.matches ? "dark" : "light");
    };
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onScheme);
    }
  }

  function fillList(id, items) {
    var list = document.getElementById(id);
    list.replaceChildren();
    items.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
  }

  function fillPairs(id, pairs) {
    var dl = document.getElementById(id);
    dl.replaceChildren();
    pairs.forEach(function (pair) {
      var dt = document.createElement("dt");
      var dd = document.createElement("dd");
      dt.textContent = pair[0];
      dd.textContent = pair[1];
      dl.appendChild(dt);
      dl.appendChild(dd);
    });
  }

  function formatUsd(amount) {
    if (typeof amount !== "number" || !isFinite(amount)) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(amount);
  }

  function splitImpact(statement) {
    var match = /^(\d+(?:\.\d+)?%)\s+(.+)$/.exec(statement || "");
    if (!match) return { figure: statement || "—", detail: "" };
    return { figure: match[1], detail: match[2] };
  }

  function render(data) {
    document.title = data.name + " — Career Spec";
    document.getElementById("person-name").textContent = data.name;
    document.getElementById("brand-name").textContent = data.name;
    document.getElementById("colophon-name").textContent = data.name + " · Career Spec";
    document.getElementById("lede").textContent = data.showcase + ".";

    fillList("goals", data.goals || []);
    document.getElementById("years").textContent = String(data.experience_years);
    fillList("markets", data.markets || []);

    var languages = data.languages || [];
    fillList("language-codes", languages.map(function (language) { return language.code; }));
    document.getElementById("language-names").textContent = languages.map(function (language) {
      return language.name;
    }).join(" · ");

    fillList("companies", data.companies || []);
    document.getElementById("companies-note").textContent = data.companies_note || "";

    var impact = splitImpact((data.key_impacts || [])[0] || "");
    document.getElementById("impact-figure").textContent = impact.figure;
    document.getElementById("impact-detail").textContent = impact.detail;

    var cadence = data.compensation_cadence || "month";
    document.getElementById("pay").textContent = formatUsd(data.compensation_baseline_usd);
    document.getElementById("pay-unit").textContent = "USD / " + cadence;
    document.getElementById("schedule").textContent = data.schedule_preference || "";

    var languageLine = languages.map(function (language) {
      return language.name + " (" + language.code + ")";
    }).join(", ");

    fillPairs("spec-list", [
      ["Experience", data.experience_years + " years"],
      ["Markets", (data.markets || []).join(", ")],
      ["Languages", languageLine],
      ["Companies", (data.companies || []).join(", ") + (data.companies_list_complete ? "" : " (partial list)")],
      ["Key impact", (data.key_impacts || []).join("; ")],
      ["Compensation baseline", formatUsd(data.compensation_baseline_usd) + " USD per " + cadence],
      ["Schedule", data.schedule_preference || ""]
    ]);

    fillList("sources", data.sources || []);

    var absent = data.absent || {};
    fillPairs("gap-list", Object.keys(absent).map(function (key) {
      return [ABSENT_LABELS[key] || key, absent[key]];
    }));
  }

  fetch("data/metrics.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("status " + res.status);
      return res.json();
    })
    .then(function (data) {
      render(data);
      status.hidden = true;
      sheet.hidden = false;
    })
    .catch(function () {
      status.textContent = "The spec sheet reads data/metrics.json. Serve this folder over a local web server, then open the page from that server.";
    });
})();
