"use strict";
// marcação dos links do nav
const cHeader = document.querySelector('#home');
const cAboutUs = document.querySelector('#aboutUs');
const navHome = document.querySelector('#nav_home');
const navAboutUS = document.querySelector('#nav_aboutUs');
const navCatalog = document.querySelector('#nav_catalog');
window.addEventListener('scroll', () => {
    const positionHome = cHeader.offsetHeight - 1;
    const positionAboutUs = positionHome + cAboutUs.offsetHeight - 1;
    if (window.scrollY <= positionHome) {
        navHome.classList.add('active');
        navAboutUS.classList.remove('active');
    }
    else if (window.scrollY > positionHome && window.scrollY <= positionAboutUs) {
        navHome.classList.remove('active');
        navAboutUS.classList.add('active');
        navCatalog.classList.remove('active');
    }
    else {
        navAboutUS.classList.remove('active');
        navCatalog.classList.add('active');
    }
    ;
});
// modal carrinho
const btnModal = document.querySelector('.c-nav__shoppingCart');
const modal = document.querySelector('.c-modal');
const shoppingCart = document.querySelector('.c-shoppingCart');
const cBody = document.body;
btnModal.addEventListener('click', (ev) => {
    ev.preventDefault();
    modal.style.display = 'flex';
    modal.style.top = `${document.documentElement.scrollTop}px`;
    cBody.style.overflowY = 'hidden';
});
modal.addEventListener('click', (ev) => {
    if (ev.target === modal) {
        modal.style.display = 'none';
        cBody.style.overflowY = 'scroll';
    }
});
// modal menu
const btnModalNav = document.querySelector('.c-nav__menu');
const modalNav = document.querySelector('.c-sideBarNav');
const modalNavChield = document.querySelector('.c-nav__mobile');
const btnCloseNav = document.querySelector('.btn-closeNav');
const navLinksMobile = [...document.querySelectorAll('.c-nav__links--mobile')];
btnModalNav.addEventListener('click', (ev) => {
    modalNav.style.top = `${document.documentElement.scrollTop}px`;
    modalNav.style.display = 'flex';
    cBody.style.overflowY = 'hidden';
    modalNavChield.classList.add('openSideBar');
});
const closeModal = () => {
    modalNav.style.display = 'none';
    cBody.style.overflowY = 'scroll';
};
btnCloseNav.addEventListener('click', () => {
    closeModal();
    modalNavChield.classList.remove('openSideBar');
});
modalNav.addEventListener('click', (ev) => {
    if (ev.target === modalNav) {
        closeModal();
        modalNavChield.classList.remove('openSideBar');
    }
});
navLinksMobile.forEach(item => {
    item.addEventListener('click', () => {
        closeModal();
        modalNavChield.classList.remove('openSideBar');
    });
});
