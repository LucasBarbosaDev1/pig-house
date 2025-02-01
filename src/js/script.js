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
function closeShoppingCart() {
    modal.style.display = 'none';
    cBody.style.overflowY = 'scroll';
}
;
btnModal.addEventListener('click', (ev) => {
    ev.preventDefault();
    modal.style.display = 'flex';
    modal.style.top = `${document.documentElement.scrollTop}px`;
    cBody.style.overflowY = 'hidden';
});
modal.addEventListener('click', (ev) => {
    if (ev.target === modal) {
        closeShoppingCart();
    }
    ;
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
});
const closeModal = () => {
    modalNav.style.display = 'none';
    cBody.style.overflowY = 'scroll';
};
btnCloseNav.addEventListener('click', () => {
    closeModal();
});
modalNav.addEventListener('click', (ev) => {
    if (ev.target === modalNav) {
        closeModal();
    }
});
navLinksMobile.forEach(item => {
    item.addEventListener('click', () => {
        closeModal();
    });
});
;
// localStorage do carrinho
if (!localStorage.getItem('dataBasePH')) {
    localStorage.setItem('dataBasePH', '[]');
}
;
let arrLocalStorage = JSON.parse(localStorage.getItem('dataBasePH'));
// requisição get da base de dados dos produtos
async function dataBase() {
    const response = await fetch('src/dataBase/dataBase.json');
    const data = await response.json();
    return data;
}
;
// renderização dos produtos no catálogo
const catalogCards = document.querySelector('.c-catalog__cards');
const catalogMenu = document.querySelector('.c-catalog__menu');
const mLinguica = document.querySelector('.m-linguica');
const mCarne = document.querySelector('.m-carne');
dataBase()
    .then(dados => {
    catalogMenu.addEventListener('click', (ev) => {
        const clickedElement = ev.target;
        const elementClass = clickedElement.className;
        function categoryProducts(type) {
            const productFilter = dados.filter(product => product.type === type);
            const productCardHTML = productFilter.map(el => `
        <div class="c-product">
    
          <div>             
            <div class="c-product__img">
              <img src="${el.image}" alt="">
            </div>
          
            <div class="c-product__title">
              <h4>${el.product}</h4>
              <span>R$ ${(el.price).toFixed(2).replace('.', ',')} / kg</span>
            </div>
          </div>
            
          <p class="c-product__description">${el.description}</p>
            
          <div class="c-product__buttons">
            <input type="button" value="Adicionar ao Carrinho" class="btn-add" id="${el.id}">      
          </div>           
        </div>
        `).join('');
            catalogCards.innerHTML = productCardHTML;
        }
        ;
        if (elementClass === 'm-linguica') {
            mLinguica.classList.add('active');
            mCarne.classList.remove('active');
            categoryProducts('linguica');
        }
        ;
        if (elementClass === 'm-carne') {
            mCarne.classList.add('active');
            mLinguica.classList.remove('active');
            categoryProducts('carne');
        }
    });
    mLinguica.click();
    // adiciona os produtos no localStorage
    catalogCards.addEventListener('click', (ev) => {
        const clickedElement = ev.target;
        const elementId = clickedElement.id;
        const productFilter = dados.filter(product => product.id === elementId);
        if (clickedElement.className === "btn-add") {
            let cont = 0;
            for (let i = 0; i < arrLocalStorage.length; i++) {
                if (arrLocalStorage[i].id === productFilter[0].id) {
                    cont++;
                }
                ;
            }
            ;
            if (cont < 1) {
                arrLocalStorage.push(productFilter[0]);
                localStorage.setItem('dataBasePH', JSON.stringify(arrLocalStorage));
            }
            ;
            renderProductsCart();
            totalPrice();
            cartNotificationFunction();
        }
        ;
    });
})
    .catch(error => {
    console.error(error);
});
// renderizacao dos produtos no carrinho
const productsCart = document.querySelector('.products-cart');
function renderProductsCart() {
    if (arrLocalStorage.length === 0) {
        productsCart.innerHTML = `<span class="obsCart">Carrinho Vazio...</span>`;
    }
    else {
        const productCardShopping = arrLocalStorage.map((el) => {
            const price = el.price;
            return (`
        <div class="item-cart">
          <i class="fa-solid fa-x" id="removeProduct"  data-id="${el.id}"></i>
      
          <img src="${el.image}" alt="">
      
          <div class="descripitionItem-cart">
            <div class="infos-item">
              <span class="title-item">${el.product}</span>
              <span class="qnt-item">QUANTIDADE: ${el.quantity}kg</span>
            </div>
      
            <div class="value-item">
              <span class="price-item">R$ ${price.toFixed(2).replace('.', ',')}</span>
      
              <div class="btnQnt-cart">
                <input type="button" value="+" id="add" data-id="${el.id}">
                <div id="qnt">${el.quantity}</div>
                <input type="button" value="-" id="remove" data-id="${el.id}">
              </div>
      
            </div>
      
          </div>
        </div>
      
      `);
        }).join('');
        productsCart.innerHTML = productCardShopping;
    }
    ;
}
;
renderProductsCart();
productsCart.addEventListener('click', (ev) => {
    const clickedElement = ev.target;
    const elementId = clickedElement.id;
    const productFilter = arrLocalStorage.filter((product) => product.id === clickedElement.dataset.id);
    // funcao para remover o produto do carrinho
    const removeProductFunction = () => {
        const productFilter = arrLocalStorage.filter((product) => product.id !== clickedElement.dataset.id);
        arrLocalStorage = productFilter;
        localStorage.setItem('dataBasePH', JSON.stringify(arrLocalStorage));
        renderProductsCart();
        cartNotificationFunction();
    };
    // adicionar +1 a qunatidade do produto
    if (elementId === 'add') {
        productFilter[0].quantity++;
        localStorage.setItem('dataBasePH', JSON.stringify(arrLocalStorage));
        renderProductsCart();
        totalPrice();
        cartNotificationFunction();
    }
    ;
    // remover 1 da quantidade do produto
    if (elementId === 'remove') {
        productFilter[0].quantity--;
        localStorage.setItem('dataBasePH', JSON.stringify(arrLocalStorage));
        if (productFilter[0].quantity === 0) {
            productFilter[0].quantity = 1;
            localStorage.setItem('dataBasePH', JSON.stringify(arrLocalStorage));
            removeProductFunction();
        }
        ;
        renderProductsCart();
        totalPrice();
        cartNotificationFunction();
    }
    ;
    // botão de romover o produto do carrinho
    if (elementId === 'removeProduct') {
        productFilter[0].quantity = 1;
        localStorage.setItem('dataBasePH', JSON.stringify(arrLocalStorage));
        removeProductFunction();
        totalPrice();
        cartNotificationFunction();
    }
    ;
});
// atualiza o valor total do pedido
const totalPriceElement = document.querySelector('.price-total');
let totalSum = 0;
function totalPrice() {
    totalSum = 0;
    arrLocalStorage.forEach((el) => {
        totalSum += el.quantity * el.price;
    });
    totalPriceElement.innerText = totalSum.toFixed(2).replace('.', ',').toString();
}
;
totalPrice();
// notificação do carrinho
const cartNotification = document.querySelector('.c-nav__notificationCart');
let totalProducts = 0;
function cartNotificationFunction() {
    totalProducts = 0;
    arrLocalStorage.forEach((el) => {
        totalProducts += el.quantity;
    });
    cartNotification.innerText = totalProducts.toString();
}
;
cartNotificationFunction();
// botoes do carrinho
const Cform = document.querySelector('.c-form');
const btnCloseModal = document.querySelector('.btn-close');
const btnFinish = document.querySelector('.btn-finish');
// função de fechar o modal
btnCloseModal.addEventListener('click', (ev) => {
    ev.preventDefault();
    closeShoppingCart();
});
// gera o pedido para o whatsApp
let request = '';
Cform.addEventListener('submit', (ev) => {
    ev.preventDefault();
    for (let i = 0; i < arrLocalStorage.length; i++) {
        const quantity = arrLocalStorage[i].quantity;
        const product = arrLocalStorage[i].product;
        const totalPrice = (arrLocalStorage[i].quantity * arrLocalStorage[i].price).toFixed(2).replace('.', ',').toString();
        request += `${quantity}kg - ${product} - R$ ${totalPrice}%0A`;
    }
    ;
    if (arrLocalStorage.length > 0) {
        window.open(`https://api.whatsapp.com/send?phone=5585987692718&text=*Bem%20Vindo(a)%20%C3%A0%20Pig%20House*%F0%9F%90%B7%0A%0A*Pedido*%0A${request}%0A%0ATotal%20-%20R%24%20${totalSum.toFixed(2).replace('.', ',')}%0A%0A*Dados%20para%20Entrega*%0ANome%3A%20${Cform.nameInput.value}%0AEndere%C3%A7o%3A%20${Cform.address.value}%2C%20${Cform.number.value}%2C%20${Cform.complement.value}%0ABairro%3A%20${Cform.district.value}%0ACEP%3A%C2%A0${Cform.cep.value}`);
    }
    ;
    request = "";
});
