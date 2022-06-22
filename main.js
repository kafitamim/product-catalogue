const formElm = document.querySelector("form");
const nameElm = document.querySelector(".product-name");
const priceElm = document.querySelector(".product-price");
const addListItem = document.querySelector(".list-group");
const filterElm = document.querySelector("#filter");

//

let products = [];

formElm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const priceElmValue = addInputResult(nameElm, priceElm);
  const { nameValue, priceValue } = priceElmValue;
  const isError = validateResult(nameValue, priceValue);
  if (isError) {
    alert("please submit valid item");
    return;
  }

  const id = products.length;
  const product = {
    id: id,
    name: nameValue,
    price: priceValue,
  };
  products.push(product);

  addItemToUI(id, nameValue, priceValue);
  addItemToStorage(product);
});

addListItem.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("delete-item")) {
    const id = getItemId(evt.target);
    //remove from UI
    removeItemFromUI(id);
    //remove from array or temporary store
    removeItemFromArr(id);

    // remove data from local storage (browser storage)

    removeProductsFromStorage(id);
  }
});

function removeItemFromUI(id) {
  document.querySelector(`.item-${id}`).remove();
}

function updateAfterRemove(products, id) {
  return products.filter((product) => product.id !== id);
}

function removeItemFromArr(id) {
  const newProductArr = updateAfterRemove(products, id);
  products = newProductArr;
}

function removeProductsFromStorage(id) {
  const products = JSON.parse(localStorage.getItem("productStore"));
  //filter
  const productsAfterRemove = updateAfterRemove(products, id);
  localStorage.setItem("productStore", JSON.stringify(productsAfterRemove));
}

function getItemId(elem) {
  const liElm = elem.parentElement;
  return Number(liElm.classList[1].split("-")[1]);
}

function addItemToUI(id, nameValue, priceValue) {
  const htmlElm = ` <li class="list-group-item item-${id} collection-item">
        <strong>${nameValue}</strong>- <span class="price">$${priceValue}</span>
        <i class="fa fa-trash float-right delete-item"></i>
      </li>`;

  addListItem.insertAdjacentHTML("afterbegin", htmlElm);
  clearInputValue();
}

function clearInputValue() {
  nameElm.value = "";
  priceElm.value = "";
}

function validateResult(name, price) {
  isError = false;
  if (!name || name.length < 5) {
    isError = true;
    return isError;
  }
  if (!price || isNaN(price) || Number(price) <= 0) {
    isError = true;
    return isError;
  }
  return isError;
}

function addInputResult(nameElm, priceElm) {
  const nameValue = nameElm.value;
  const priceValue = priceElm.value;
  return {
    nameValue,
    priceValue,
  };
}

filterElm.addEventListener("keyup", (evt) => {
  const filteredValue = evt.target.value;
  const filteredArr = products.filter((product) =>
    product.name.includes(filteredValue)
  );
  showfilterArr(filteredArr);
});

function showfilterArr(filteredArr) {
  addListItem.innerHTML = "";
  filteredArr.forEach((item) => {
    const htmlElm = ` <li class="list-group-item item-${item.id} collection-item">
        <strong>${item.name}</strong>- <span class="price">$${item.price}</span>
        <i class="fa fa-trash float-right delete-item"></i>
      </li>`;

    addListItem.insertAdjacentHTML("afterbegin", htmlElm);
  });
}

/// add data in local storage
function addItemToStorage(product) {
  let products;
  if (localStorage.getItem("productStore")) {
    products = JSON.parse(localStorage.getItem("productStore"));
    products.push(product);
    localStorage.setItem("productStore", JSON.stringify(products));
  } else {
    products = [];
    products.push(product);
    localStorage.setItem("productStore", JSON.stringify(products));
  }
}

document.addEventListener("DOMContentLoaded", (e) => {
  if (localStorage.getItem("productStore")) {
    const products = JSON.parse(localStorage.getItem("productStore"));
    showfilterArr(products);
    console.log(products);
  }
});
