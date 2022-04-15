let cart = JSON.parse(localStorage.getItem("cart"));

// Variable pour stocker les id de chaque articles présent dans le panier
let products = [];

// Variable qui récupère l'orderId envoyé comme réponse par le serveur lors de la requête POST
let orderId = "";

//Boucle intégrant les informations du produit dans la page panier
for (product of cart) {
  document.querySelector(
    "#cart__items"
  ).innerHTML += `<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
        <div class="cart__item__img">
            <img src="${product.img}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>Couleur du produit: ${product.color}</p>
                <p>Prix unitaire: ${product.price}€</p>
            </div>
        <div class="cart__item__content__settings">
            <div id="jojo" class="cart__item__content__settings__quantity">
                <p id="quantité">Qté : ${product.quantity} </p>
                <p id="sousTotal">Prix total pour cet article: ${product.totalPrice}€</p> 
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem"><button>Supprimer</button></p>
            </div>
        </div>
        </div>
    </article>`;

  // Récupération des Id de chaque articles et envoi dans le tableau de la variable products[]
  products.push(product._id);
  console.log(products);
}
console.log(products);
let sup = document.querySelectorAll(".deleteItem");
console.log(sup)

for( let i = 0; i < sup.length; i++){
  sup[i].addEventListener("click" , (event) =>{
    event.preventDefault();
    
    let idSuppression = cart[i]
    console.log(idSuppression);

    cart.splice( i,1 );
    console.log(cart);
  
    localStorage.setItem("cart", JSON.stringify(cart));
     console.log(products);
  })
}

// Fonction récupération des prix des articles et somme totale
let addPriceFunction = () => {
  console.log(cart);
  let found = cart.map((element) => element.totalPrice);
  console.log(found);

  const reducer = (previousValue, currentValue) => previousValue + currentValue;
  let somme = found.reduce(reducer);
  console.log(somme);
  return somme;
};

// Fonction récupération des quantités des articles et quantité totale
let addQuantFunction = () => {
  console.log(cart);
  let found2 = cart.map((element) => element.quantity);
  console.log(found2);

  const reducer = (previousValue, currentValue) => previousValue + currentValue;
  let quant = found2.reduce(reducer);
  console.log(quant);
  return quant;
};

// Fonction mise à jour du local storage products
let majLocalStorageProducts = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Fonction d'injection dans le DOM des donnés addPrice et addQuant
function injectSommeQuant() {
  // Appel de la fonction addPriceFunction qui nous retourne la variable somme
  let sommeTotale = addPriceFunction();
  //Intégration de la somme totale dans le DOM
  document.querySelector("#totalPrice").textContent = sommeTotale;

  localStorage.setItem("sommeTotale", JSON.stringify(sommeTotale));

  // Appel de la fonction addQuantFunction qui nous retourne la variable quant
  let quantTotale = addQuantFunction();

  //intégration de la quantité des articles dans le DOM
  document.querySelector("#totalQuantity").textContent = quantTotale;

  majLocalStorageProducts();
}
injectSommeQuant();

console.log(cart);
let itemQuantity = Array.from(document.querySelectorAll(".itemQuantity"));
let sousTotal = Array.from(document.querySelectorAll("#sousTotal"));
let screenQuantity = Array.from(document.querySelectorAll("#quantité"));

itemQuantity.forEach(function (quantity, i) {
  quantity.addEventListener("change", (event) => {
    event.preventDefault();
    let newArticlePrice = quantity.value * cart[i].price;
    console.log(quantity.value);

    screenQuantity[i].textContent = "Qté: " + quantity.value;
    cart[i].quantity = parseInt(quantity.value, 10);

    sousTotal[i].textContent =
      "Prix total pour cet article: " + newArticlePrice + " €";
      cart[i].totalPrice = newArticlePrice;

    console.log(`le prix de ${cart[i].name} et passé à ${newArticlePrice}`);

    injectSommeQuant();
  });
});

const orderButton = document.querySelector("#order");
orderButton.addEventListener("click", (e) => getform(e));


function getform(e) {
e.preventDefault()
if (cart.length === 0) {
  alert("Please select items to buy")
  return
}

if (isFormInvalid()) return
if (isEmailInvalid()) return

const body = makeBody();
fetch("http://localhost:3000/api/products/order", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    window.location.href = "confirmation.html" + "?orderId=" + data.orderId
    return 
  })
}

function isFormInvalid() {
  const form = document.querySelector(".cart__order__form");
  const inputs = form.querySelectorAll("input")
  inputs.forEach((input) => {
    if (input.value === "") {
      alert("Veuillez renseigner vos coordonnées")
      return true
    }
    return false
  })
}

function isEmailInvalid() {
  const email = document.querySelector("#email").value
  const regex = /^[A-Za-z0-9+_.-]+@(.+)$/
  if (regex.test(email) === false) {
    alert("Veuillez renseigner un email valide")
    return true
  }
  return false
}


function makeBody() {
  let _id = [];
        for (let i = 0; i<cart.length;i++) {
            _id.push(cart[i]._id);
        }
        console.log(_id);
      const form = document.querySelector(".cart__order__form");
      const firstName = form.elements.firstName.value
      const lastName = form.elements.lastName.value
      const address = form.elements.address.value
      const city = form.elements.city.value
      const email = form.elements.email.value
      
      const body = { contact: {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email
     },
      products: _id,
    }
    console.log(body)
    return body
}