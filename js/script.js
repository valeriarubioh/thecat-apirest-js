const api = axios.create({
  baseURL: "https://api.thecatapi.com/v1",
});

api.defaults.headers.common["X-API-KEY"] =
  "live_pDNozWm68ygt77XwwhV6oGn8L1ILMJGvbk7X1pt9Kab08mnkR8ZDi0iYEaZDacTU";

const API_URL_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=3";

const API_URL_FAVORITES = "https://api.thecatapi.com/v1/favourites/";

const API_URL_FAVOTITES_DELETE = (id) =>
  `https://api.thecatapi.com/v1/favourites/${id}`;

const API_URL_UPLOAD = "https://api.thecatapi.com/v1/images/upload";

const spanError = document.getElementById("error");

async function loadRandomMichis() {
  const res = await fetch(API_URL_RANDOM);
  const data = await res.json();
  console.log("Random");
  console.log(data);

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status;
  } else {
    const img1 = document.getElementById("img1");
    const img2 = document.getElementById("img2");
    const btn1 = document.getElementById("btn1");
    const btn2 = document.getElementById("btn2");

    img1.src = data[0].url;
    img2.src = data[1].url;

    btn1.onclick = () => saveFavouriteMichis(data[0].id);
    btn2.onclick = () => saveFavouriteMichis(data[1].id);
  }
}

async function loadFavouritesMichis() {
  const res = await fetch(API_URL_FAVORITES, {
    method: "GET",
    headers: {
      "X-API-KEY":
        "live_pDNozWm68ygt77XwwhV6oGn8L1ILMJGvbk7X1pt9Kab08mnkR8ZDi0iYEaZDacTU",
    },
  });
  const data = await res.json();
  console.log("Favoritos");
  console.log(data);

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {
    const section = document.getElementById("favoriteMichis");
    section.innerHTML = "";

    const cardsContainer = document.createElement("div");
    cardsContainer.className = "cards";

    const h2 = document.createElement("h2");
    h2.className = "title-subitles";
    const h2Text = document.createTextNode("Favorite Kittens");
    h2.appendChild(h2Text);
    section.appendChild(h2);

    data.forEach((michi) => {
      const article = document.createElement("article");
      const img = document.createElement("img");
      const btn = document.createElement("button");
      const btnText = document.createTextNode("Remove from favorites");

      btn.appendChild(btnText);
      btn.onclick = () => deleteFavouriteMichi(michi.id);
      btn.className = "favorites";
      btn.classList.add("favorites");

      img.src = michi.image.url;
      img.id = "img-r";

      article.appendChild(img);
      article.appendChild(btn);
      cardsContainer.appendChild(article);
    });
    section.appendChild(cardsContainer);
  }
}

async function saveFavouriteMichis(id) {
  const { data, status } = await api.post("/favourites", {
    image_id: id,
  });

  console.log("Save");

  if (status !== 200) {
    spanError.innerHTML = "Hubo un error: " + status + data.message;
  } else {
    console.log("Michi guardado en favoritos");
    loadFavouritesMichis();
  }
}

async function deleteFavouriteMichi(id) {
  const res = await fetch(API_URL_FAVOTITES_DELETE(id), {
    method: "DELETE",
    headers: {
      "X-API-KEY":
        "live_pDNozWm68ygt77XwwhV6oGn8L1ILMJGvbk7X1pt9Kab08mnkR8ZDi0iYEaZDacTU",
    },
  });
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {
    console.log("Michi eliminado de favoritos");
    loadFavouritesMichis();
  }
}

async function uploadMichiPhoto() {
  const form = document.getElementById("uploadingForm");
  const formData = new FormData(form);

  console.log(formData.get("file"));

  const res = await fetch(API_URL_UPLOAD, {
    method: "POST",
    headers: {
      // 'Content-Type': 'multipart/form-data',
      "X-API-KEY":
        "live_pDNozWm68ygt77XwwhV6oGn8L1ILMJGvbk7X1pt9Kab08mnkR8ZDi0iYEaZDacTU",
    },
    body: formData,
  });
  const data = await res.json();

  if (res.status !== 201) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    console.log({ data });
  } else {
    console.log("Foto de michi subida :)");
    console.log({ data });
    console.log(data.url);
    saveFavouriteMichis(data.id);
  }
}

loadRandomMichis();
loadFavouritesMichis();
