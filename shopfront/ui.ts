function uiCreateProduct(item_json): HTMLLIElement {
  const element = document.createElement("li");
  element.style.display = "flex";
  element.style.flex = "1 1 0px";
  element.style.flexDirection = "column";

  // Picture
  const picture = document.createElement("img");
  picture.src = item_json.img;
  // Link Text
  const link = document.createElement("a");
  link.href = item_json.handle;
  link.appendChild(document.createTextNode(item_json.title));
  // Price
  const price = document.createElement("p");
  price.appendChild(document.createTextNode(item_json.price));

  element.appendChild(picture);
  element.appendChild(link);
  element.appendChild(price);

  element.style.margin = "4px";
  return element;
}

function uiCreateProductFlex(): HTMLUListElement {
  const element = document.createElement("ul");
  element.style.display = "flex";
  element.style.flexDirection = "row";
  element.style.justifyContent = "space-around";
  return element;
}

function uiCreateDivider(): HTMLDivElement {
  const element = document.createElement("div");
  element.style.height = "1px";
  element.style.margin = "5px 0px 5px 0px";
  element.style.width = "100%";
  element.style.backgroundColor = "#AAAAAA";

  return element;
}

function uiMasterFlex(): HTMLDivElement {
  const main = document.createElement("div");
  main.style.display = "flex";
  main.style.flexDirection = "column";
  return main;
}

function uiMain(product_json): HTMLDivElement {
  console.log("UI Main init");

  // Create master flexbox
  const masterFlex = uiMasterFlex();
  masterFlex.appendChild(uiCreateDivider());

  const textnode = document.createElement("div");
  // Title
  const title = document.createElement("h1");
  title.appendChild(document.createTextNode("Accessories for this Item"));
  masterFlex.appendChild(title);

  // Products
  const productFlex = uiCreateProductFlex();
  product_json.forEach((element) => {
    let productDisplay = uiCreateProduct(element);
    productFlex.appendChild(productDisplay);
  });

  masterFlex.appendChild(productFlex);
  masterFlex.appendChild(uiCreateDivider());
  masterFlex.appendChild(uiCreateDivider());
  return masterFlex;
}