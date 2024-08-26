// marcação dos links do nav
const cHeader = document.querySelector('#home') as HTMLElement;
const cAboutUs = document.querySelector('#aboutUs') as HTMLElement;
const navHome = document.querySelector('#nav_home') as HTMLAnchorElement;
const navAboutUS = document.querySelector('#nav_aboutUs') as HTMLAnchorElement;
const navCatalog = document.querySelector('#nav_catalog') as HTMLAnchorElement;

window.addEventListener('scroll', () => {
  const positionHome = cHeader.offsetHeight;
  const positionAboutUs = positionHome + cAboutUs.offsetHeight;

  if (window.scrollY <= positionHome) {
    navHome.classList.add('active');
    navAboutUS.classList.remove('active');

  } else if (window.scrollY > positionHome && window.scrollY <= positionAboutUs) {
    navHome.classList.remove('active');
    navAboutUS.classList.add('active');
    navCatalog.classList.remove('active');

  } else {
    navAboutUS.classList.remove('active');
    navCatalog.classList.add('active');
  };

});

// modal 
const btnModal = document.querySelector('.c-nav__shoppingCart') as HTMLDivElement;
const modal = document.querySelector('.c-modal') as HTMLDialogElement;
const shoppingCart = document.querySelector('.c-shoppingCart') as HTMLDivElement;
const cBody = document.body;

btnModal.addEventListener('click', (ev) => {
  ev.preventDefault();
  modal.style.display = 'flex';
  modal.style.top = `${document.documentElement.scrollTop}px`;
  cBody.style.overflowY = 'hidden';
});

modal.addEventListener('click', (ev) => { 
  modal.style.display = 'none';
  cBody.style.overflowY = 'scroll';
});

shoppingCart.addEventListener('click', (ev) => {
  ev.stopPropagation()
});

