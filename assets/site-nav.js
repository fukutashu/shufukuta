// assets/nav.js
// <body data-page="..."> から active を自動セット
(() => {
  const page = (document.body && document.body.dataset && document.body.dataset.page) ? document.body.dataset.page : "";
  if(page){
    document.querySelectorAll('nav a[data-page]').forEach(a => {
      if(a.dataset.page === page) a.classList.add('active');
      else a.classList.remove('active');
    });
    const sub = document.querySelector('.brand .sub');
    if(sub) sub.textContent = page;
  }
})();