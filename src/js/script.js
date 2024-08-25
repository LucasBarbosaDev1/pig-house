"use strict";
// modal 
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
    modal.style.display = 'none';
    cBody.style.overflowY = 'scroll';
});
shoppingCart.addEventListener('click', (ev) => {
    ev.stopPropagation();
});
