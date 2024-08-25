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
  console.log('clicou no pai')
});

shoppingCart.addEventListener('click', (ev) => {
  ev.stopPropagation()
  console.log('clicou no filho')
})