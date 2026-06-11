/* ============================================
   app.js — 知识幻灯片首页（magazine 方案）
   - fetch courses.json，失败 fallback 到内嵌 MOCK
   - CSS columns 瀑布流，4 种 aspect 变体
   - tag chips 筛选 + 关键词搜索
   ============================================ */
(function () {
  // ---------- 兜底数据 ----------
  var MOCK_COURSES = [
    { slug: "transformer-intro", entry: "transformer-intro/index.html", title: "Transformer 入门", description: "30 分钟讲清楚 Attention 机制与 Transformer 架构核心原理", tags: ["AI", "深度学习", "NLP"], author: "panzhipiao", updatedAt: "2026-06-10", slides: 6 },
    { slug: "rust-ownership", entry: "rust-ownership/index.html", title: "Rust 所有权与生命周期", description: "从零理解 Rust 最独特的内存管理模型", tags: ["Rust", "系统编程"], author: "panzhipiao", updatedAt: "2026-06-08", slides: 12 },
    { slug: "design-patterns", entry: "design-patterns/index.html", title: "设计模式实战", description: "23 种经典设计模式的现代 JavaScript 实现", tags: ["架构", "设计模式", "OOP"], author: "panzhipiao", updatedAt: "2026-06-05", slides: 24 },
    { slug: "data-viz", entry: "data-viz/index.html", title: "数据可视化入门", description: "用 D3.js 让数据讲故事的完整指南", tags: ["D3.js", "可视化", "数据"], author: "panzhipiao", updatedAt: "2026-05-28", slides: 16 },
    { slug: "wasm-principles", entry: "wasm-principles/index.html", title: "WebAssembly 原理", description: "深入理解 WASM 的编译管线与浏览器运行时", tags: ["WASM", "浏览器", "性能"], author: "panzhipiao", updatedAt: "2026-05-20", slides: 10 },
    { slug: "functional-programming", entry: "functional-programming/index.html", title: "函数式编程思想", description: "从 Haskell 到日常编程的函数式思维迁移", tags: ["FP", "Haskell", "编程范式"], author: "panzhipiao", updatedAt: "2026-05-15", slides: 20 }
  ];

  // ---------- tag → CSS class 映射 ----------
  var TAG_CLASS_MAP = {
    "AI": "tag-ai", "深度学习": "tag-deep-learning", "NLP": "tag-nlp",
    "Rust": "tag-rust", "系统编程": "tag-system",
    "架构": "tag-arch", "设计模式": "tag-design-pattern", "OOP": "tag-oop",
    "D3.js": "tag-d3", "可视化": "tag-viz", "数据": "tag-data",
    "WASM": "tag-wasm", "浏览器": "tag-browser", "性能": "tag-perf",
    "FP": "tag-fp", "Haskell": "tag-haskell", "编程范式": "tag-paradigm"
  };

  // ---------- 封面色 / 手写标注 / 卡片变体 ----------
  var COVER_COLORS = [
    { bg: "var(--terracotta)" },
    { bg: "var(--forest)" },
    { bg: "var(--indigo)" },
    { bg: "var(--warm-brown)" }
  ];
  var ANNOTATIONS = ["新", "Hot", "必读", "推荐", "精选", "Classic"];
  var CARD_VARIANTS = ["", "tall", "compact", "hero-card", "tall", "compact"];

  function hashSlug(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
    return Math.abs(h);
  }
  function slugColor(s) { return COVER_COLORS[hashSlug(s) % COVER_COLORS.length]; }
  function slugAnnotation(s) { return ANNOTATIONS[hashSlug(s) % ANNOTATIONS.length]; }
  function slugVariant(i) { return CARD_VARIANTS[i % CARD_VARIANTS.length]; }

  // ---------- 去重收集 tag ----------
  function allTags(courses) {
    var seen = {};
    var arr = [];
    courses.forEach(function (c) {
      (c.tags || []).forEach(function (t) {
        if (!seen[t]) { seen[t] = 1; arr.push(t); }
      });
    });
    return arr.sort();
  }

  // ---------- 渲染 tag chips ----------
  function renderChips(tags, active, onToggle) {
    var el = document.getElementById("chips");
    el.innerHTML = "";
    var all = document.createElement("button");
    all.className = "chip" + (active === null ? " active" : "");
    all.textContent = "全部";
    all.addEventListener("click", function () { onToggle(null); });
    el.appendChild(all);
    tags.forEach(function (t) {
      var btn = document.createElement("button");
      btn.className = "chip" + (active === t ? " active" : "");
      btn.textContent = t;
      btn.addEventListener("click", function () { onToggle(active === t ? null : t); });
      el.appendChild(btn);
    });
  }

  // ---------- 渲染单卡片 ----------
  function renderCard(course, idx) {
    var color = slugColor(course.slug);
    var firstChar = (course.title || "?").charAt(0);
    var variant = slugVariant(idx);
    var annotation = slugAnnotation(course.slug);

    var a = document.createElement("a");
    a.className = "card" + (variant ? " " + variant : "");
    a.href = course.entry;
    a.target = "_blank";
    a.rel = "noopener";

    var cover = document.createElement("div");
    cover.className = "card-cover";
    cover.style.background = color.bg;
    var letter = document.createElement("span");
    letter.className = "card-cover-letter";
    letter.setAttribute("data-letter", firstChar);
    letter.textContent = firstChar;
    cover.appendChild(letter);
    var badge = document.createElement("span");
    badge.className = "card-badge";
    badge.textContent = (course.slides || 0) + " 页";
    cover.appendChild(badge);
    var ann = document.createElement("span");
    ann.className = "card-annotation";
    ann.textContent = annotation;
    cover.appendChild(ann);
    a.appendChild(cover);

    var body = document.createElement("div");
    body.className = "card-body";
    var title = document.createElement("div");
    title.className = "card-title";
    title.textContent = course.title;
    body.appendChild(title);
    var desc = document.createElement("div");
    desc.className = "card-desc";
    desc.textContent = course.description || "";
    body.appendChild(desc);
    var tags = document.createElement("div");
    tags.className = "card-tags";
    (course.tags || []).forEach(function (t) {
      var sp = document.createElement("span");
      sp.className = "card-tag " + (TAG_CLASS_MAP[t] || "tag-ai");
      sp.textContent = t;
      tags.appendChild(sp);
    });
    body.appendChild(tags);
    var meta = document.createElement("div");
    meta.className = "card-meta";
    var dateSpan = document.createElement("span");
    dateSpan.textContent = course.updatedAt || "";
    meta.appendChild(dateSpan);
    var authorSpan = document.createElement("span");
    authorSpan.textContent = course.author || "";
    meta.appendChild(authorSpan);
    body.appendChild(meta);
    a.appendChild(body);
    return a;
  }

  // ---------- 渲染卡片网格 ----------
  function renderGrid(courses) {
    var el = document.getElementById("masonry");
    el.innerHTML = "";
    if (!courses.length) {
      var empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = "<h3>没有找到匹配的课题</h3><p>试试换个关键词或清除筛选条件</p>";
      el.appendChild(empty);
      return;
    }
    courses.forEach(function (c, i) { el.appendChild(renderCard(c, i)); });
  }

  // ---------- 渲染错误横幅 ----------
  function renderErrorBanner(msg) {
    var el = document.getElementById("masonry");
    var err = document.createElement("div");
    err.className = "error-state";
    err.innerHTML =
      "<h3>无法加载课题列表</h3>" +
      "<p>" + (msg || "未知错误") + "</p>" +
      "<p>请运行 <code>node scripts/build-courses.mjs</code> 生成 courses.json，" +
      "或确认通过本地服务器访问；以下为示例数据：</p>";
    el.insertBefore(err, el.firstChild);
  }

  // ---------- 更新统计 ----------
  function updateStats(courses) {
    var tags = allTags(courses);
    var slides = courses.reduce(function (s, c) { return s + (c.slides || 0); }, 0);
    document.getElementById("stat-count").textContent = courses.length;
    document.getElementById("stat-slides").textContent = slides;
    document.getElementById("stat-tags").textContent = tags.length;
  }

  // ---------- 主流程状态 ----------
  var allCourses = [];
  var activeTag = null;
  var searchQuery = "";

  function applyFilter() {
    var q = searchQuery.toLowerCase();
    var filtered = allCourses.filter(function (c) {
      if (activeTag && c.tags.indexOf(activeTag) === -1) return false;
      if (!q) return true;
      if (c.title.toLowerCase().indexOf(q) !== -1) return true;
      if ((c.description || "").toLowerCase().indexOf(q) !== -1) return true;
      return (c.tags || []).some(function (t) { return t.toLowerCase().indexOf(q) !== -1; });
    });
    renderGrid(filtered);
  }

  function onToggleTag(t) {
    activeTag = t;
    renderChips(allTags(allCourses), activeTag, onToggleTag);
    applyFilter();
  }

  // ---------- 启动 ----------
  function bootstrap(courses, errorMsg) {
    allCourses = courses;
    updateStats(courses);
    renderChips(allTags(courses), activeTag, onToggleTag);
    renderGrid(courses);
    if (errorMsg) renderErrorBanner(errorMsg);
    document.getElementById("search").addEventListener("input", function (e) {
      searchQuery = e.target.value;
      applyFilter();
    });
  }

  function init() {
    fetch("courses.json")
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        var list = Array.isArray(data) ? data : (data && data.courses) || [];
        if (!list.length) bootstrap(MOCK_COURSES, "courses.json 为空");
        else bootstrap(list);
      })
      .catch(function (err) {
        console.error("加载 courses.json 失败:", err);
        bootstrap(MOCK_COURSES, err.message);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
