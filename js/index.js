import{clientId, clientSecret} from  "../env/client.js" //tirem dos carpetes enrere

let tokenAccess = ""

// type submit ="..."
const btnBuscar = document.querySelector("button")//no ho fem per id, és fa per etiquetes
const results = document.querySelector(".results");


const renderizaTrack = function (infTrack) {
  results.textContent = "";
  for (let i = 0; i < infTrack.length; i++) {
    const Objdiv = document.createElement("div")
    Objdiv.className="track";
    Objdiv.innerHTML=`<img src=${infTrack[i].album.images[0].url} />
                      <h1>${infTrack[i].name}</h1>`;
    results.appendChild(Objdiv);
    
  }
}
/////////////////////////////////// PUNT 2 //////////////////////////////////////
const getSpotifyAccessToken = function (clientId, clientSecret) {
  // Url de l'endpont de spotify
  const url = "https://accounts.spotify.com/api/token";
  // ClientId i ClienSecret generat en la plataforma de spotify
  const credentials = btoa(`${clientId}:${clientSecret}`);


  //Es crear un header on se li passa les credencials
  const header = {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
// --------------------------------------------------------------------------------------------
  fetch(url, {
    method: "POST",
    headers: header,
    body: "grant_type=client_credentials", // Paràmetres del cos de la sol·licitud
  })
    .then((response) => {
      // Controlar si la petició ha anat bé o hi ha alguna error.
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json(); // Retorna la resposta com JSON
    })
    .then((data) => {
      // Al data retorna el token d'accés que necessitarem
      // Haurem d’habilitar els botons “Buscar” i “Borrar”
      tokenAccess = data.access_token
      console.log(tokenAccess);
    })
    .catch((error) => {
      // SI durant el fetch hi ha hagut algun error arribarem aquí.
      console.error("Error a l'obtenir el token:", error);
    });
};
getSpotifyAccessToken(clientId, clientSecret);
console.log(clientId, clientSecret);

//-------------------------------------------------------------------------------------------
const btonSearch = document.querySelector("#buscar");
const inputSearch = document.querySelector("#buscador");

const searchSpotifyTracks = function () {
  // Definim l’endpoint, la query és el valor de búsqueda.
  // Limitem la búsqueda a cançons i retornarà 12 resultats.
  const searchUrl =
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      inputSearch.value
    )}&type=track&limit=12`;

  // Al headers sempre s’ha de posar la mateixa informació.
  fetch(searchUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenAccess}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
     // Controlem si la petició i la resposta han anat bé. 
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
     console.log(data);
     const infTrack = data.tracks.items;
     // Data retorna tota la informació de la consulta de l’API
     renderizaTrack(infTrack);
    })
    .catch((error) => {
      console.error("Error al buscar cançons:", error);
    });
};
btonSearch.addEventListener("click", searchSpotifyTracks);

//-----------------------------------------------------------------------------------


