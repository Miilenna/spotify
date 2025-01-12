import { clientId, clientSecret } from "../env/client.js"; // Dos carpetes enrere

let tokenAccess = "";
let offset = 0; // Para la paginación
let totalResults = 0;

// Elementos del DOM
const btnBuscar = document.querySelector("#buscar");
const btnBorrar = document.querySelector("#borrar");
const inputSearch = document.querySelector("#buscador");
const results = document.querySelector(".results");
const infoArtista = document.querySelector(".cuadrado_derecha");
const btnCargarMas = document.createElement("button");
btnCargarMas.className = "cargar_canç";
const infocanç = document.querySelector("#info");

// Función para obtener información del artista
const getInfoArtist = function (idArtist) {
  const url = `https://api.spotify.com/v1/artists/${idArtist}`;
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenAccess}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      // Mostramos la información del artista en el DOM
      infoArtista.innerHTML = `
        <div class="artist-info">
          <img src="${data.images[0]?.url}" alt="${data.name}" class="imgsInfo" />
          <h2>${data.name}</h2>
          <p>Popularitat: ${data.popularity}</p>
          <p>Gèneres: ${data.genres.join(", ")}</p>
          <p>Seguidors: ${data.followers.total}</p>
        </div>
      `;
    

      // Obtener canciones populares
      const topTracksUrl = `https://api.spotify.com/v1/artists/${idArtist}/top-tracks?market=ES`;
      fetch(topTracksUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenAccess}`,
        },
      })
        .then((response) => response.json())
        .then((topData) => {
          const tracks = topData.tracks.slice(0, 3);
          infocanç.innerHTML = "";
          tracks.forEach((track, index) => {
            infocanç.innerHTML += `<p>${index + 1}. ${track.name}</p>`;
          });
        });
    })
    .catch((error) => console.error("Error al obtenir informació de l'artista:", error));
};

// Renderizar canciones
const renderizaTrack = function (infTrack) {
  for (let i = 0; i < infTrack.length; i++) {
    const Objdiv = document.createElement("div");
    Objdiv.className = "track";
    Objdiv.innerHTML = `
      <img src="${infTrack[i].album.images[0]?.url}" class="imgs" />
      <p><b>${infTrack[i].name}</b></p>
      <p>Artista: ${infTrack[i].artists[0].name}</p>
      <p>Album: ${infTrack[i].album.name}</p>
      <button class="add-song">+ Afegir cançó</button>
    `;
    Objdiv.addEventListener("click", function () {
      getInfoArtist(infTrack[i].artists[0].id);
    });
    Objdiv.querySelector(".add-song").addEventListener("click", function (e) {
      e.stopPropagation();
      const storedSongs = localStorage.getItem("songs") || "";
      const updatedSongs = storedSongs ? `${storedSongs};${infTrack[i].id}` : infTrack[i].id;
      localStorage.setItem("songs", updatedSongs);
      alert("Cançó afegida al localStorage!");
    });
    results.appendChild(Objdiv);
  }
};

// Función para buscar canciones
const searchSpotifyTracks = function () {
  if (!inputSearch.value) {
    return alert("Has d'introduir un nom d’una cançó.");
  }
  if (inputSearch.value.length < 2) {
    return alert("Has d’introduir almenys 2 caràcters.");
  }

  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    inputSearch.value
  )}&type=track&limit=12&offset=${offset}`;

  fetch(searchUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenAccess}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      const infTrack = data.tracks.items;
      const totalTracks = data.tracks.total; // Total de resultados disponibles en la API
  
      if (!infTrack.length) {
        results.textContent = "No hi han resultats.";
        return;
      }
  
      totalResults += infTrack.length; // Actualizamos la cantidad de resultados cargados
      renderizaTrack(infTrack);
  
      // Actualizamos el texto del botón con los resultados cargados y el total
      btnCargarMas.textContent = `+ cançons (${totalResults} de ${totalTracks})`;
  
      if (totalResults < totalTracks) {
        // Solo añadimos el botón si hay más canciones para cargar
        results.appendChild(btnCargarMas);
      } else {
        // Si ya se han cargado todos los resultados, ocultamos el botón
        btnCargarMas.remove();
      }
    })
    .catch((error) => console.error("Error al buscar cançons:", error));
  };  

// Configurar botones
btnBuscar.addEventListener("click", () => {
  results.textContent = ""; // Limpiar resultados previos
  offset = 0;
  totalResults = 0;
  searchSpotifyTracks();
});

btnBorrar.addEventListener("click", () => {
  results.textContent = "Fes una nova búsqueda";
  infoArtista.textContent = "Informació artista";
  infocanç.textContent = "Informació cançons";
});

btnCargarMas.addEventListener("click", () => {
  offset += 12;
  searchSpotifyTracks();
});

// Obtener token de Spotify
const getSpotifyAccessToken = function (clientId, clientSecret) {
  const url = "https://accounts.spotify.com/api/token";
  const credentials = btoa(`${clientId}:${clientSecret}`);
  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })
    .then((response) => response.json())
    .then((data) => {
      tokenAccess = data.access_token;
      btnBuscar.disabled = false;
      btnBorrar.disabled = false;
    })
    .catch((error) => console.error("Error a l'obtenir el token:", error));
};

getSpotifyAccessToken(clientId, clientSecret);
