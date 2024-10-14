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
              <span>R$ ${el.price} / kg</span>
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
            mLinguica.style.color = '#FFD600';
            mCarne.style.color = '#FFF';
            categoryProducts('linguica');
        }
        ;
        if (elementClass === 'm-carne') {
            mCarne.style.color = '#FFD600';
            mLinguica.style.color = '#FFF';
            categoryProducts('carne');
        }
    });
    window.onload = function () {
        mLinguica.click();
    };
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
        productsCart.innerHTML = `<span>Carrinho Vazio</span>`;
    }
    else {
        const productCardShopping = arrLocalStorage.map((el) => {
            return (`
        <div class="item-cart">
          <i class="fa-solid fa-x" id="removeProduct"  data-id="${el.id}"></i>
      
          <img src="${el.image}" alt="">
      
          <div class="descripitionItem-cart">
            <div class="infos-item">
              <span class="title-item">${el.product}</span>
              <span class="qnt-item">QUANTIDADE: ${el.quantity}</span>
            </div>
      
            <div class="value-item">
              <span class="price-item">R$ ${(el.price).toFixed(2)}</span>
      
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
    totalPriceElement.innerText = totalSum.toFixed(2).toString();
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
