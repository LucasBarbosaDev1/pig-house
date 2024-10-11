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

  };
});

// modal menu
const btnModalNav = document.querySelector('.c-nav__menu') as HTMLElement;
const modalNav = document.querySelector('.c-sideBarNav') as HTMLElement;
const modalNavChield = document.querySelector('.c-nav__mobile') as HTMLElement;
const btnCloseNav = document.querySelector('.btn-closeNav') as HTMLElement;
const navLinksMobile = [...document.querySelectorAll('.c-nav__links--mobile')] as HTMLElement[];

btnModalNav.addEventListener('click', (ev) => {
  modalNav.style.top = `${document.documentElement.scrollTop}px`;
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
  });
});

// interface da base de dados
interface DataBaseItem {
  id: string;
  image: string;
  product: string;
  price: number;
  description: string;
  quantity: number;
  type: string;
};

// localStorage do carrinho
if (!localStorage.getItem('dataBasePH')) {
  localStorage.setItem('dataBasePH', '[]');
};

let arrLocalStorage = JSON.parse(localStorage.getItem('dataBasePH') as string);


// requisição get da base de dados dos produtos
async function dataBase(): Promise<DataBaseItem[]> {
  const response = await fetch('src/dataBase/dataBase.json');
  const data: DataBaseItem[] = await response.json();

  return data;
};

// renderização dos produtos no catálogo
const catalogCards = document.querySelector('.c-catalog__cards') as HTMLElement;

dataBase()
.then(dados => {
  const productCardHTML = dados.map(el => `
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
    
    // adiciona os produtos no localStorage
    catalogCards.innerHTML = productCardHTML;
    
    catalogCards.addEventListener('click', (ev) => {
      const clickedElement = ev.target as HTMLElement;
      const elementId: string = clickedElement.id;

      const productFilter = dados.filter(product => product.id === elementId);

      if (clickedElement.className === "btn-add") {
        
        let cont: number = 0;
  
        for (let i = 0; i < arrLocalStorage.length; i++) {
          if (arrLocalStorage[i].id === productFilter[0].id) {
            cont++;
          };
        };
        
        if (cont < 1) {
          arrLocalStorage.push(productFilter[0]);
    
          localStorage.setItem('dataBasePH', JSON.stringify(arrLocalStorage)); 
  
        }; 

        renderProductsCart();
        totalPrice();
        cartNotificationFunction();
      };
      
    });
    
  })
  .catch(error => {
    console.error(error);
  });

// renderizacao dos produtos no carrinho
const productsCart = document.querySelector('.products-cart') as HTMLElement;

function renderProductsCart() {

  if (arrLocalStorage.length === 0) {
    productsCart.innerHTML = `<span>Carrinho Vazio</span>`;

  } else {
    const productCardShopping: string = arrLocalStorage.map((el: { id:string; image: string; product: string; quantity: number; price: number; }) => {
      return (
        `
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
      
      `
      );
      
    }).join('');
    
    productsCart.innerHTML = productCardShopping;
    
  };
  
};

renderProductsCart();

productsCart.addEventListener('click', (ev) => {
  const clickedElement = ev.target as HTMLElement;
  const elementId: string = clickedElement.id;
  const productFilter = arrLocalStorage.filter((product: { id: string; }) => product.id === clickedElement.dataset.id);


  // funcao para remover o produto do carrinho
  const removeProductFunction = () => {
    const productFilter = arrLocalStorage.filter((product: { id: string; }) => product.id !== clickedElement.dataset.id);

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
    
  };

  // remover 1 da quantidade do produto
  if (elementId === 'remove') {    
    productFilter[0].quantity--;

    localStorage.setItem('dataBasePH', JSON.stringify(arrLocalStorage));

    
    if (productFilter[0].quantity === 0) {
      productFilter[0].quantity = 1;

      localStorage.setItem('dataBasePH', JSON.stringify(arrLocalStorage));

      removeProductFunction();
    };
    
    renderProductsCart();
    totalPrice();
    cartNotificationFunction();
  };

  // botão de romover o produto do carrinho
  if (elementId === 'removeProduct') {
    productFilter[0].quantity = 1;

    localStorage.setItem('dataBasePH', JSON.stringify(arrLocalStorage));
    removeProductFunction();
    totalPrice();
    cartNotificationFunction();
  };
  
});

// atualiza o valor total do pedido
const totalPriceElement = document.querySelector('.price-total') as HTMLElement;
let totalSum: number = 0;

function totalPrice() {
  totalSum = 0;
  arrLocalStorage.forEach((el: any) => {
    totalSum += el.quantity * el.price;

  });
  
  totalPriceElement.innerText = totalSum.toFixed(2).toString();
};

totalPrice();

// notificação do carrinho
const cartNotification = document.querySelector('.c-nav__notificationCart') as HTMLElement;
let totalProducts: number = 0;

function cartNotificationFunction() {
  totalProducts = 0;

  arrLocalStorage.forEach((el: any) => {
    totalProducts += el.quantity;

  });
  
  cartNotification.innerText = totalProducts.toString();
};

cartNotificationFunction();