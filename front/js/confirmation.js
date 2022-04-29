const getorderId = () => {
    return new URL(location.href).searchParams.get("orderId");
  };
  const orderId = getorderId();

  const idNode = document.getElementById("orderId");
  idNode.innerText = orderId;

  localStorage.removeItem("cart");
