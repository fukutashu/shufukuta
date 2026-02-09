// assets/site-nav.js
// どのページでも “worksと同じヘッダー” を自動で出す（activeも自動）

(function () {
  function normalizePage() {
    let p = location.pathname || "";
    p = p.replace(/\/+$/, ""); // 末尾/削除
    let last = p.split("/").pop() || "index.html";

    // /works みたいな拡張子なしも吸収
    if (!last.includes(".")) last = last + ".html";
    if (last === "") last = "index.html";
    return last.toLowerCase();
  }

  function pageKey(file) {
    if (file === "index.html") return "cv";
    if (file === "works.html") return "works";
    if (file === "exhibitions.html") return "exhibitions";
    if (file === "blog.html") return "blog";
    if (file === "contact.html") return "contact";
    return "cv";
  }

  function buildHeader(activeFile) {
    const active = pageKey(activeFile);

    const header = document.createElement("div");
    header.className = "site-header";

    const brand = document.createElement("div");
    brand.className = "site-brand";

    const name = document.createElement("div");
    name.className = "site-name";
    name.textContent = "Shu Fukuta";

    const sub = document.createElement("div");
    sub.className = "site-sub";
    sub.textContent = active;

    brand.appendChild(name);
    brand.appendChild(sub);

    const nav = document.createElement("div");
    nav.className = "site-nav";
    nav.setAttribute("role", "navigation");
    nav.setAttribute("aria-label", "primary");

    const items = [
      ["index.html", "cv"],
      ["works.html", "works"],
      ["exhibitions.html", "exhibitions"],
      ["blog.html", "blog"],
      ["contact.html", "contact"],
    ];

    items.forEach(([href, label]) => {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      if (href.toLowerCase() === activeFile) a.classList.add("is-active");
      nav.appendChild(a);
    });

    header.appendChild(brand);
    header.appendChild(nav);

    return header;
  }

  function run() {
    const activeFile = normalizePage();

    // 置き場所：.wrap があればその先頭、なければ body
    const wrap = document.querySelector(".wrap") || document.body;

    // 既存のheaderタグがあれば消す（ページごとの差を根絶）
    const oldHeader = wrap.querySelector("header");
    if (oldHeader) oldHeader.remove();

    // 既に site-header があれば消して作り直し（保険）
    const old = wrap.querySelector(".site-header");
    if (old) old.remove();

    const newHeader = buildHeader(activeFile);
    wrap.insertBefore(newHeader, wrap.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();