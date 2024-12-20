
document.addEventListener("click", function(event) {

    document.querySelectorAll(".dropdown-menu").forEach(menu => {
      menu.style.display = "none";
    });
  
  
    if (event.target.closest(".dropdown")) {
      const dropdownMenu = event.target.closest(".dropdown").querySelector(".dropdown-menu");
      if (dropdownMenu) {
        dropdownMenu.style.display = "block";
      }
    }
  })


let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;
const lisproductHtml = document.querySelector('.new-products');
const iconCartCount = document.querySelector('.icon-cart-count');
const listCart = document.querySelector('.list-cart');
const cart = document.querySelector('.icon-cart');
const closeCartButton = document.querySelector('.close');
const body = document.querySelector('body');

let productsList = [];  
let cartItems = [];     
 
function showSlide(index) {
    currentSlide = (index >= totalSlides) ? 0 : (index < 0 ? totalSlides - 1 : index);
    document.querySelector(".slides").style.transform = `translateX(${-currentSlide * 100}%)`;
}


function moveSlide(direction) {
    showSlide(currentSlide + direction);
}


setInterval(() => moveSlide(1), 5000);

cart.addEventListener('click', () => body.classList.toggle('show-cart'));
closeCartButton.addEventListener('click', () => body.classList.toggle('show-cart'));


function addDataToHTML() {
    lisproductHtml.innerHTML = '';
    productsList.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.dataset.id = product.id;
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <span class="name">${product.name}</span>
            <span class="description">${product.description}</span>
            <span class="stars"><i class='bx bxs-star'></i> <i class='bx bxs-star'></i>
            <i class='bx bxs-star'></i>
            <i class='bx bxs-star'></i>
            <i class='bx bxs-star-half' ></i></span>
            <span class="price">${product.price}</span>
            <button class="add-cart">Add to Cart</button>
        `;
        lisproductHtml.appendChild(productDiv);
    });
}

lisproductHtml.addEventListener('click', event => {
    if (event.target.classList.contains('add-cart')) {
        const productId = event.target.parentElement.dataset.id;
        addToCart(productId);
        updateCartCount();  
    }
});


function addToCart(productId) {
    let productIndex = cartItems.findIndex(item => item.productId == productId);
    if (productIndex < 0) {
        cartItems.push({
            productId: productId,
            quantity: 1
        });
    } else {
        cartItems[productIndex].quantity += 1;
    }
    console.log(cartItems); 
    updateCartUI();
}

function updateCartUI() {
    listCart.innerHTML = '';
    cartItems.forEach(cartItem => {
        const product = productsList.find(p => p.id === cartItem.productId);
        if (product) {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('item');
            cartItemDiv.innerHTML = `
                <div class="image"><img src=${product.image} alt="${product.name}"></div>
                <div class="name">${product.name}</div>
                <div class="total-price">$${(product.price * cartItem.quantity).toFixed(2)}</div>
                <div class="quantity">
                    <span class="minus" data-id="${product.id}">-</span>
                    <span>${cartItem.quantity}</span>
                    <span class="plus" data-id="${product.id}">+</span>
                </div>
            `;
            listCart.appendChild(cartItemDiv);
        }
    });
}



function updateCartCount() {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    iconCartCount.textContent = totalItems;
}


listCart.addEventListener('click', event => {
    const productId = event.target.dataset.id;

    if (event.target.classList.contains('plus')) {
        updateQuantity(productId, 1);
    } else if (event.target.classList.contains('minus')) {
        updateQuantity(productId, -1);
    }
});


function updateQuantity(productId, change) {
    const item = cartItems.find(item => item.productId === productId);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cartItems = cartItems.filter(item => item.productId !== productId);
        }
        updateCartUI();
        updateCartCount();
    }
}


function initApp() {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            productsList = data;
            addDataToHTML();
        });
}

initApp();


;
  