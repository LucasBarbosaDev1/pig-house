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

// localStorage do carrinho
if (!localStorage.getItem('dataBasePH')) {
  localStorage.setItem('dataBasePH', '[]');
}

const arrLocalStorage = JSON.parse(localStorage.getItem('dataBasePH') as string);

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

// requisição get da base de dados
async function dataBase(): Promise<DataBaseItem[]> {
  const response = await fetch('src/dataBase/dataBase.json');
  const data: DataBaseItem[] = await response.json();

  return data;
}

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
    
    // adiciona os produtos no LS
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
          } 
        };
        
        if (cont < 1) {
          arrLocalStorage.push(productFilter[0]);
    
          localStorage.setItem('dataBasePH', JSON.stringify(arrLocalStorage)); 
  
        }; 
      };
      
    });
    
  });