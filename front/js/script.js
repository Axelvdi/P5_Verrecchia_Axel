// je fais appel à l'api products
fetch ("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => addProducts(data))

// je construis et définis le DOM grâce à la boucle
function addProducts(data) {
    data.forEach(element => {
        let items = document.getElementById('items');
            a = document.createElement('a');
            article = document.createElement('article');
                article.classList.add("productCard")
            img = document.createElement('img');
                img.classList.add("productImage")
            h3 = document.createElement('h3');
                h3.classList.add("productName");
            p = document.createElement('p');
                p.classList.add("productDescription");
            elementUrl = "./product.html?id=" + element._id

            items.appendChild(a);
            a.appendChild(article);
            article.appendChild(img);
            article.appendChild(h3);
            article.appendChild(p);
            a.setAttribute ("href", elementUrl);

            a = element._id;
            img.src = element.imageUrl;
            img.alt = element.altTxt;
            h3.innerHTML = element.name;
            p.innerHTML = element.description;
    });
}
