function addWorkCard(params = {}) {
  console.log("Valor de la url de la imagen: " + params.img);

  const template = document.querySelector("#portfolio-card-template");
  const container = document.querySelector(".portfolio-content");
  template.content.querySelector(".portfolio-card-title").textContent =
    params.title;
  template.content.querySelector(".portfolio-card-text").textContent =
    params.description;
  template.content.querySelector(".portfolio-img").src = params.img;
  template.content.querySelector(".portfolio-card-link").href = params.url;

  const clone = document.importNode(template.content, true);
  container.appendChild(clone);
}

function getAsset(id) {
  return fetch(
    "https://cdn.contentful.com/spaces/ewkf9uy59du3/environments/master/assets/" +
      id +
      "?access_token=hiizLjDrFrGzLQBeOyrLi_Mir85fQnezXql7-zplpTw"
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const fieldImage = data.items.map((item) => {
        return {
          url_img: item.fields.file.url,
        };
      });
      return fieldImage;
    });
}

function getImgId(item) {
  const imgId = item["fields"]["imagen"]["sys"]["id"];
  return imgId;
}

function getImgEl(item, assets) {
  const id = getImgId(item);
  const urlImg = assets.filter((asset) => {
    if (asset["fields"]["file"]["url"].includes(id)) {
      return asset;
    }
  });
  return urlImg;
}

function getWorks() {
  return fetch(
    "https://cdn.contentful.com/spaces/ewkf9uy59du3/environments/master/entries?access_token=hiizLjDrFrGzLQBeOyrLi_Mir85fQnezXql7-zplpTw&content_type=work"
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("Mostrando info de data: ");
      console.log(data);
      const assets = data["includes"]["Asset"];

      const fieldsCollections = data.items.map((item) => {
        const imgValue = getImgEl(item, assets);
        console.log("Valor del objeto imgValue");
        console.log(imgValue);
        console.log("Valor de la url de imagen: ");
        console.log(imgValue[0].fields.file.url);
        return {
          title: item.fields.titulo,
          description: item.fields.descripcion,
          url: item.fields.url,
          img: imgValue[0].fields.file.url,
        };
      });

      return fieldsCollections;
    });
}

function main() {
  getWorks().then(function (works) {
    for (const w of works) {
      console.log(w);
      addWorkCard(w);
    }
  });
}

main();
