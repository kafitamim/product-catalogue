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
  products.push({
    id: id,
    name: nameValue,
    price: priceValue,
  });

  addItemToUI(id, nameValue, priceValue);
});

addListItem.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("delete-item")) {
    const id = getItemId(evt.target);
    removeItemFromUI(id);
    removeItemFromArr(id);
  }
});

function removeItemFromUI(id) {
  document.querySelector(`.item-${id}`).remove();
}

function removeItemFromArr(id) {
  const newProductArr = products.filter((product) => product.id !== id);
  products = newProductArr;
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
  if (!price || Number(price) <= 0) {
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
