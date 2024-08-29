// marcação dos links do nav
const cHeader = document.querySelector('#home') as HTMLElement;
const cAboutUs = document.querySelector('#aboutUs') as HTMLElement;
const navHome = document.querySelector('#nav_home') as HTMLElement;
const navAboutUS = document.querySelector('#nav_aboutUs') as HTMLElement;
const navCatalog = document.querySelector('#nav_catalog') as HTMLElement;

window.addEventListener('scroll', () => {
  const positionHome = cHeader.offsetHeight - 1;
  const positionAboutUs = positionHome + cAboutUs.offsetHeight - 1;

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

// modal carrinho
const btnModal = document.querySelector('.c-nav__shoppingCart') as HTMLElement;
const modal = document.querySelector('.c-modal') as HTMLElement;
const shoppingCart = document.querySelector('.c-shoppingCart') as HTMLElement;
const cBody = document.body;

btnModal.addEventListener('click', (ev) => {
  ev.preventDefault();
  modal.style.display = 'flex';
  modal.style.top = `${document.documentElement.scrollTop}px`;
  cBody.style.overflowY = 'hidden';
});

modal.addEventListener('click', (ev) => { 
  if (ev.target === modal){
    modal.style.display = 'none';
    cBody.style.overflowY = 'scroll';

  }
});

// modal menu
const btnModalNav = document.querySelector('.c-nav__menu') as HTMLElement;
const modalNav = document.querySelector('.c-sideBarNav') as HTMLElement;
const modalNavChield = document.querySelector('.c-nav__mobile') as HTMLElement;
const btnCloseNav = document.querySelector('.btn-closeNav') as HTMLElement;
const navLinksMobile = [...document.querySelectorAll('.c-nav__links--mobile')] as HTMLElement[];

btnModalNav.addEventListener('click', (ev) => {
  modalNav.style.top = `${document.documentElement.scrollTop}px`
  modalNav.style.display = 'flex';
  cBody.style.overflowY = 'hidden';
});

const closeModal = (): void => {
  modalNav.style.display = 'none';
  cBody.style.overflowY = 'scroll';
}

btnCloseNav.addEventListener('click', () => {
  closeModal();
});

modalNav.addEventListener('click', (ev) => {
  if (ev.target === modalNav) {
    closeModal();
  }
})

navLinksMobile.forEach(item => {
  item.addEventListener('click', () => {
    closeModal();
  })
})