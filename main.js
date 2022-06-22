const formElm = document.querySelector("form");
const nameElm = document.querySelector(".product-name");
const priceElm = document.querySelector(".product-price");
const addListItem = document.querySelector(".list-group");
const filterElm = document.querySelector("#filter");
const addProductElm = document.querySelector(".add-product");
//

let products = [];
let updatedItemId;

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

//take  remove and edit button and event listener under a  function to get global id.

filterElm.addEventListener("keyup", (evt) => {
  const filteredValue = evt.target.value;
  const filteredArr = products.filter((product) =>
    product.name.includes(filteredValue)
  );
  showfilterArr(filteredArr);
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
  } else if (evt.target.classList.contains("edit-item")) {
    //pick the item id
    updatedItemId = getItemId(evt.target);

    //find the item
    const foundProducts = products.find(
      (product) => product.id === updatedItemId
    );

    //populate the item data from the UI
    populateUIInEditStat(foundProducts);
    //show update button
    if (!document.querySelector(".update-product")) {
      showUpdateBtn();
    }
  }
});

// update data to local storage

function updateProductsToStorage() {
  if (localStorage.getItem("productStore")) {
    localStorage.setItem("productStore", JSON.stringify(products));
  }
}

formElm.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("update-product")) {
    // pick data  from
    const priceElmValue = addInputResult(nameElm, priceElm);
    const { nameValue, priceValue } = priceElmValue;
    const isError = validateResult(nameValue, priceValue);
    if (isError) {
      alert("please submit valid item");
      return;
    }

    //updated data should be updated to data store

    products = products.map((product) => {
      if (product.id === updatedItemId) {
        //item should be updated
        return {
          id: product.id,
          name: nameValue,
          price: priceValue,
        };
      } else {
        // no update.
        return product;
      }
    });

    //reset Input
    clearInputValue();

    //show Submit button

    addProductElm.style.display = "block";

    //updated data should be updated to data UI

    showfilterArr(products);

    // remove update button
    document.querySelector(".update-product").remove();
    //updated data should be updated to local storage

    updateProductsToStorage();
  }
});

function showUpdateBtn() {
  const elm = `<button type="button" class="btn mt-3 btn-block btn-secondary update-product">
      update
    </button>`;
  addProductElm.style.display = "none";
  formElm.insertAdjacentHTML("beforeend", elm);
}

function populateUIInEditStat(product) {
  nameElm.value = product.name;
  priceElm.value = product.price;
}

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
        <i class="fa fa-pencil-alt float-right edit-item"></i>
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

function showfilterArr(filteredArr) {
  addListItem.innerHTML = "";
  filteredArr.forEach((item) => {
    const htmlElm = ` <li class="list-group-item item-${item.id} collection-item">
        <strong>${item.name}</strong>- <span class="price">$${item.price}</span>
        <i class="fa fa-pencil-alt float-right edit-item"></i>
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
    products = JSON.parse(localStorage.getItem("productStore"));
    showfilterArr(products);
  }
});
