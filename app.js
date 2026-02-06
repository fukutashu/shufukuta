async function loadJSON(path){
  const res = await fetch(path, {cache: "no-store"});
  if(!res.ok) throw new Error("Failed to load: " + path);
  return await res.json();
}

function uniq(arr){ return [...new Set(arr)] }

function el(tag, attrs={}, children=[]){
  const e = document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if(k === "class") e.className = v;
    else if(k === "html") e.innerHTML = v;
    else e.setAttribute(k, v);
  }
  for(const c of children){
    if(typeof c === "string") e.appendChild(document.createTextNode(c));
    else if(c) e.appendChild(c);
  }
  return e;
}

/* WORKS */
async function renderWorks(){
  const mount = document.querySelector("#worksList");
  const filtersMount = document.querySelector("#worksFilters");
  if(!mount || !filtersMount) return;

  const data = await loadJSON("assets/works.json");
  const allTags = uniq(data.flatMap(x => x.tags)).sort((a,b)=>a.localeCompare(b,"ja"));

  let active = "all";

  function draw(){
    mount.innerHTML = "";
    const items = (active === "all") ? data : data.filter(x => x.tags.includes(active));

    for(const w of items){
      const top = el("div", {class:"top"}, [
        el("div", {class:"title"}, [w.title]),
        el("div", {class:"tags"}, [w.tags.join(" / ")])
      ]);

      const body = el("div", {class:"desc"}, [
        `${w.year} / ${w.medium}${w.size ? " / " + w.size : ""}`,
        w.note ? el("div", {class:"small", style:"margin-top:8px;"}, [w.note]) : null,
        w.link ? el("div", {class:"small", style:"margin-top:8px;"}, [
          el("a", {href:w.link, target:"_blank", rel:"noopener"}, ["Link →"])
        ]) : null
      ]);

      const thumb = w.thumb
        ? el("div", {style:"margin-top:10px;"}, [
            el("img", {
              src: w.thumb,
              alt: w.title,
              style:"width:100%; height:auto; border-radius:10px; border:1px solid rgba(255,255,255,.07); filter:saturate(.9) contrast(1.02);"
            })
          ])
        : null;

      mount.appendChild(
        el("div", {class:"item"}, [top, body, thumb])
      );
    }
  }

  function chip(label, value){
    const b = el("button", {class:"chip" + (value===active ? " active":""), type:"button"}, [label]);
    b.addEventListener("click", ()=>{
      active = value;
      [...filtersMount.querySelectorAll("button")].forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      draw();
    });
    return b;
  }

  filtersMount.appendChild(chip("all", "all"));
  for(const t of allTags) filtersMount.appendChild(chip(t, t));
  draw();
}

/* DIARY */
async function renderDiary(){
  const mount = document.querySelector("#diaryList");
  if(!mount) return;

  const data = await loadJSON("assets/diary.json");

  mount.innerHTML = "";
  for(const d of data){
    const top = el("div", {class:"top"}, [
      el("div", {class:"title"}, [d.title]),
      el("div", {class:"tags"}, [d.date])
    ]);

    const body = el("div", {class:"desc"}, [d.text]);
    mount.appendChild(el("div", {class:"item"}, [top, body]));
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderWorks().catch(console.error);
  renderDiary().catch(console.error);
});
