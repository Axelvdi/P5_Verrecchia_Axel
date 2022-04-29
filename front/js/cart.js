let cart = JSON.parse(localStorage.getItem("cart"));

// Variable pour stocker les Id de chaque articles présent dans le panier (utilisés pour créer la commande)
let products = [];

// Variable qui récupère l'orderId envoyé comme réponse par le serveur lors de la requête POST
let orderId = "";

// Affichage du contenu du panier
async function displayCart() {
  const parser = new DOMParser();
  const positionEmptyCart = document.getElementById("cart__items");
  let cartArray = [];

  // Si le localstorage est vide
  if (cart === null || cart === 0) {
    positionEmptyCart.textContent = "Votre panier est vide";
  } else {
    console.log("Des produits sont présents dans le panier");
    console.log(cart)
  }
  
  // Si le localstorage contient des produits
  for (i = 0; i < cart.length; i++) {
    const product = await getProductById(cart[i]._id);
    const totalPriceItem = (product.price *= cart[i].quantity);
    cartArray += `<article class="cart__item" data-id="${cart[i]._id}" data-color="${cart[i].color}">
                  <div class="cart__item__img">
                      <img src="${product.imageUrl}" alt="${product.altTxt}">
                  </div>
                  <div class="cart__item__content">
                      <div class="cart__item__content__description">
                          <h2>${product.name}</h2>
                          <p>${cart[i].color}</p>
                          <p>Prix unitaire: ${product.price}€</p>
                      </div>
                      <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p id="quantité">
                              Qté : <input data-id= ${cart[i]._id} data-color= ${cart[i].color} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${cart[i].quantity}>
                            </p>
                            <p id="sousTotal">Prix total pour cet article: ${totalPriceItem}€</p> 
                        </div>
                        <div class="cart__item__content__settings__delete">
                          <p data-id= ${cart[i]._id} data-color= ${cart[i].color} class="deleteItem">Supprimer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </article>`;
                  console.log(totalPriceItem)
  };

  // Boucle d'affichage du nombre total d'articles dans le panier et de la somme totale
  let totalQuantity = 0;
  let totalPrice = 0;

  for (i = 0; i < cart.length; i++) {
    const article = await getProductById(cart[i].id);
    totalQuantity += parseInt(cart[i].quantity);
    totalPrice += parseInt(article.price * cart[i].quantity);
  }

  document.getElementById("totalQuantity").innerHTML = totalQuantity;
  document.getElementById("totalPrice").innerHTML = totalPrice;

  if (i == cart.length) {
    const displayBasket = parser.parseFromString(cartArray, "text/html");
    positionEmptyCart.appendChild(displayBasket.body);
    changeQuantity();
    deleteItem();
  }
}
console.log(totalPrice)
// Récupération des produits de l'API
async function getProductById(productId) {
  return fetch("http://localhost:3000/api/products/"+cart[i]._id)
    .then(function (res) {
      return res.json();
    })
    .catch((err) => {
      // Erreur serveur
      console.log("erreur");
    })
    .then(function (response) {
      return response;
    });
}
displayCart();

// Modification de la quantité
function changeQuantity() {
  const quantityInputs = document.querySelectorAll(".itemQuantity");
  quantityInputs.forEach((quantityInput) => {
    quantityInput.addEventListener("change", (event) => {
      event.preventDefault();
      const inputValue = event.target.value;
      const dataId = event.target.getAttribute("data-id");
      const dataColor = event.target.getAttribute("data-color");
      let cart = localStorage.getItem("cart");
      let items = JSON.parse(cart);
      console.log(cart)
      console.log(inputValue)
      console.log(dataId)
      console.log(dataColor)
      items = items.map((item, index) => {
        if (item.id === dataId && item.color === dataColor) {
          item.quantity = inputValue;
        }
        return item;
      });
      
      // Mise à jour du localStorage
      let itemsStr = JSON.stringify(items);
      localStorage.setItem("cart", itemsStr);
      // Refresh de la page Panier
      location.reload();
    });
  });
}

// Suppression d'un article
function deleteItem() {
  let itemDelete = document.querySelectorAll(".deleteItem");

// suppression des articles
  for( let i = 0; i < itemDelete.length; i++){
    itemDelete[i].addEventListener("click" , (event) =>{
      event.preventDefault();
    
      let idSuppression = cart[i]
      console.log(idSuppression);

      cart.splice( i,1 );
  
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    });
  };
};


// formulaire //

const orderButton = document.querySelector("#order");
orderButton.addEventListener("click", (e) => getform(e));


function getform(e) {
e.preventDefault()

// function pour créer des regex et les messages d'erreurs
if (isFirstNameIvalid()) return
if (isLasttNameIvalid()) return
if (isAdressInvalid()) return
if (isCityInvalid()) return
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

function isFirstNameIvalid() {
  const Name = document.querySelector("#firstName").value
  const regex = /^[A-Z][A-Za-z\é\è\ê\-]+$/
  if (regex.test(Name) === false) {
    document.querySelector("#firstNameErrorMsg").textContent =
        "Champ Prénom de formulaire invalide, ex: Paul";
    return true
  }
  return false
}

function isLasttNameIvalid() {
  const lastName = document.querySelector("#lastName").value
  const regex = /^[A-Z][A-Za-z\é\è\ê\-]+$/
  if (regex.test(lastName) === false) {
    document.querySelector("#lastNameErrorMsg").textContent =
        "Champ Nom de formulaire invalide, ex: Durand";
    return true
  }
  return false
}

function isAdressInvalid() {
  const address = document.querySelector("#address").value
  const regex = /^[a-zA-Z0-9.,-_ ]{5,50}[ ]{0,2}$/
  if (regex.test(address) === false) {
    document.querySelector("#addressErrorMsg").textContent =
        "Champ Adresse de formulaire invalide, ex: 50 rue de la paix";
    return true
  }
  return false
}

function isCityInvalid() {
  const city = document.querySelector("#city").value
  const regex = /^[A-Z][A-Za-z\é\è\ê\-]+$/
  if (regex.test(city) === false) {
    document.querySelector("#cityErrorMsg").textContent =
        "Champ Ville de formulaire invalide, ex: Paris";
    return true
  }
  return false
}

function isEmailInvalid() {
  const email = document.querySelector("#email").value
  const regex = /^[A-Za-z0-9+_.-]+@(.+)$/
  if (regex.test(email) === false) {
    document.querySelector("#emailErrorMsg").textContent =
        "Champ Email de formulaire invalide, ex: example@contact.fr";
    return true
  }
  return false
}

// création d'un tableau afin de récuperer les données de l'utilisateur
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