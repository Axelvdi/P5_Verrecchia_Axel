// je récupère l'id du produit dans l'url
const getProductId = () => {
  return new URL(location.href).searchParams.get("id");
};
const productId = getProductId();

// je fais appel à l'api avec l'id du produit 
fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => {
    return response.json();
  })

  .then((product) => {
    addProduct(product);
    registredProduct(product);
  })
  .catch((error) => {
    alert(error);
  });

  const selectedColor = document.querySelector("#colors");

  const selectedQuantity = document.querySelector("#quantity");

  const button = document.querySelector("#addToCart");

// Création et définition des éléments du DOM
let addProduct = (data) => {
  let img = document.createElement("img");
  img.src = data.imageUrl;
  img.alt = data.altTxt;
  document.querySelector(".item__img").appendChild(img);

  let name = document.querySelector("#title").innerHTML = data.name;
  let price = document.querySelector("#price").innerHTML = data.price;
  document.querySelector("#description").innerHTML = data.description;

  // Boucle intégrant les différentes couleurs du produit dans le HTML
  for (color of data.colors) {
    let option = document.createElement("option");
    option.innerHTML = `${color}`;
    option.value = `${color}`;
    selectedColor.appendChild(option);
  }
};


// Fonction qui enregistre dans un objet les options de l'utilisateur au click sur le bouton ajouter au panier
let registredProduct = (product) => {

  button.addEventListener("click", (event) => {
    event.preventDefault();

    if (selectedColor.value == false) {
      confirm("Veuillez sélectionner une couleur");
    } else if (selectedQuantity.value == 0) {
      confirm("Veuillez sélectionner le nombre d'articles souhaités");
    } else {
      alert("Votre article a bien été ajouté au panier");

      // Récupération des informations du produit sélectionné
      let data = {
        _id: product._id,
        name: product.name,
        img: product.imageUrl,
        altTxt: product.altTxt,
        description: product.description,
        color: selectedColor.value,
        quantity: parseInt(selectedQuantity.value, 10),
        price: product.price,
        totalPrice: product.price * parseInt(selectedQuantity.value, 10),
      };
    

      //Récupération des données du Local Storage
      let existingCart = JSON.parse(localStorage.getItem("cart"));

      // Si le Local Storage existe
      if (existingCart) {
        // On recherche avec la méthode find() si l'id et la couleur d'un article sont déjà présents
        let item = existingCart.find((item) =>
            item.id == data._id && item.color == data.color
        );
        // on incrémente la nouvelle quantité et la mise à jour du prix total de l'article
        if (item) {
          item.quantity = item.quantity + data.quantity;
          item.totalPrice += item.price * data.quantity;
          localStorage.setItem("cart", JSON.stringify(existingCart));
          return;
        }
        // Si non, alors on push le nouvel article sélectionné
        existingCart.push(data);
        localStorage.setItem("cart", JSON.stringify(existingCart));

      } else {
        //  Sinon création d'un tableau dans le lequel on push l'objet "selectedProduct"
        let createLocalStorage = [];
        createLocalStorage.push(data);
        localStorage.setItem("cart", JSON.stringify(createLocalStorage));
      }
    }
  });
};



    
    

    


    



