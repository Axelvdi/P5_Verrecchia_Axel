const getProductId = () => {
  return new URL(location.href).searchParams.get("id");
};
const productId = getProductId();

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


let addProduct = (data) => {
  console.log(data);
  let img = document.createElement("img");
  img.src = data.imageUrl;
  img.alt = data.altTxt;
  document.querySelector(".item__img").appendChild(img);

  let name = document.querySelector("#title").innerHTML = data.name;
  let price = document.querySelector("#price").innerHTML = data.price;
  document.querySelector("#description").innerHTML = data.description;

  for (color of data.colors) {
    let option = document.createElement("option");
    option.innerHTML = `${color}`;
    option.value = `${color}`;
    selectedColor.appendChild(option);
  }
};



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
      console.log(data);

      //Récupération des données du Local Storage
      let existingCart = JSON.parse(localStorage.getItem("cart"));

      // Si le Local Storage existe
      if (existingCart) {
        console.log("Il y a déjà un produit dans le panier, on compare les données");
        // On recherche avec la méthode find() si l'id et la couleur d'un article sont déjà présents
        let item = existingCart.find(
          (item) =>
            item.id == data._id && item.color == data.color
        );
        // Si oui, on incrémente la nouvelle quantité et la mise à jour du prix total de l'article
        if (item) {
          item.quantity = item.quantity + data.quantity;
          item.totalPrice += item.price * data.quantity;
          localStorage.setItem("cart", JSON.stringify(existingCart));
          console.log("Quantité supplémentaire dans le panier.");
          return;
        }
        // Si non, alors on push le nouvel article sélectionné
        existingCart.push(data);
        localStorage.setItem("cart", JSON.stringify(existingCart));
        console.log("Le produit a été ajouté au panier");

      } else {
        //  Sinon création d'un tableau dans le lequel on push l'objet "selectedProduct"
        let createLocalStorage = [];
        createLocalStorage.push(data);
        localStorage.setItem("cart", JSON.stringify(createLocalStorage));
        console.log("Le panier est vide, on ajoute le premier produit");
      }
    }
  });
};



    
    

    


    



