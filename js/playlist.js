// Configuración inicial
const API_URL_SEVERAL_TRACKS = "https://api.spotify.com/v1/tracks";
const API_URL_PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
const API_URL_PLAYLIST_ITEMS = "https://api.spotify.com/v1/playlists/{playlist_id}/tracks";
const API_URL_REMOVE_PLAYLIST_ITEM = "https://api.spotify.com/v1/playlists/{playlist_id}/tracks";
const API_URL_ADD_PLAYLIST_ITEM = "https://api.spotify.com/v1/playlists/{playlist_id}/tracks";
let accesToken = "";
let selectedPlaylistId = null;
const btnTornar = document.querySelector("#tornar");
const playlistNameInput = document.querySelector("#input");

// Elementos del DOM
const playlistsContainer = document.querySelector("#playlists");
const trackContainer = document.querySelector(".cançons");
const selectedTracksContainer = document.querySelector(".cançons_selec");

btnTornar.addEventListener("click", function () {
  window.location.assign("index.html");
});

// Obtener el token de acceso desde la URL
function getAccesToken() {
  const urlParams = new URLSearchParams(window.location.hash.substring(1));
  accesToken = urlParams.get("access_token");
  if (!accesToken) {
    alert("No se encontró el token de acceso.");
    return;
  }
  console.log("Token obtenido:", accesToken);
  getPlaylists(); // Cargar playlists automáticamente
  getSelectedTracksFromLocalStorage();
}

// Obtener las playlists del usuario
async function getPlaylists() {
  try {
    const response = await fetch(API_URL_PLAYLISTS, {
      method: "GET",
      headers: { Authorization: `Bearer ${accesToken}` }
    });
    if (!response.ok) throw new Error("Error al obtener las playlists.");
    const data = await response.json();
    renderPlaylists(data.items);
  } catch (error) {
    console.error(error);
  }
}

// Mostrar las playlists en el contenedor correspondiente
function renderPlaylists(playlists) {
  playlistsContainer.innerHTML = "";
  if (playlists.length === 0) {
    playlistsContainer.innerHTML = "<p>No tienes playlists disponibles.</p>";
  } else {
    playlists.forEach(playlist => {
      const divPlaylist = document.createElement("div");
      divPlaylist.className = "playlist";
      divPlaylist.innerHTML = `<p>${playlist.name}</p><button class="select-playlist" data-id="${playlist.id}">Seleccionar</button>`;
      playlistsContainer.appendChild(divPlaylist);

      divPlaylist.querySelector(".select-playlist").addEventListener("click", () => {
        selectedPlaylistId = playlist.id;
        playlistNameInput.value = playlist.name;
        getPlaylistTracks(selectedPlaylistId);
      });
    });
  }
}

// Mostrar las canciones de la playlist seleccionada
async function getPlaylistTracks(playlistId) {
  try {
    const response = await fetch(`${API_URL_PLAYLIST_ITEMS.replace("{playlist_id}", playlistId)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accesToken}` }
    });
    if (!response.ok) throw new Error("Error al obtener las canciones de la playlist.");
    const data = await response.json();
    renderTracks(data.items);
  } catch (error) {
    console.error(error);
  }
}

// Renderizar canciones de la playlist seleccionada
function renderTracks(tracks) {
  trackContainer.innerHTML = "<p><b>Cançons</b></p>";
  tracks.forEach(trackItem => {
    const track = trackItem.track;
    const trackDiv = document.createElement("div");
    trackDiv.innerHTML = `
      <p>${track.name} - ${track.artists.map(artist => artist.name).join(", ")}</p>
      <button class="del-track" data-uri="${track.uri}">Eliminar</button>
    `;
    trackContainer.appendChild(trackDiv);

    trackDiv.querySelector(".del-track").addEventListener("click", async () => {
      const confirmation = confirm("Estàs segur que vols eliminar la cançó de la playlist?");
      if (confirmation) await removeTrackFromPlaylist(track.uri);
    });
  });
}

// Eliminar canción de la playlist
async function removeTrackFromPlaylist(trackUri) {
  if (!selectedPlaylistId) {
    alert("Selecciona una playlist primero");
    return;
  }
  try {
    const response = await fetch(`${API_URL_REMOVE_PLAYLIST_ITEM.replace("{playlist_id}", selectedPlaylistId)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accesToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tracks: [{ uri: trackUri }] })
    });
    if (!response.ok) throw new Error("Error al eliminar la canción de la playlist.");
    alert("La canción ha sido eliminada correctamente");
    getPlaylistTracks(selectedPlaylistId);
  } catch (error) {
    console.error(error);
  }
}

// Mostrar canciones guardadas en localStorage
function getSelectedTracksFromLocalStorage() {
  const selectedTracks = JSON.parse(localStorage.getItem("tracksid")) || [];
  selectedTracksContainer.innerHTML = "<p><b>Cançons Seleccionades</b></p>";
  selectedTracks.forEach(track => {
    const trackDiv = document.createElement("div");
    trackDiv.innerHTML = `<p>${track.name} - ${track.artist}</p><button class="del-track-selec">Eliminar</button>`;
    selectedTracksContainer.appendChild(trackDiv);

    trackDiv.querySelector(".del-track-selec").addEventListener("click", () => {
      const confirmation = confirm("Estàs segur que vols eliminar la cançó de la llista de cançons guardades?");
      if (confirmation) removeTrackFromLocalStorage(track);
    });
  });
}

// Eliminar una canción de localStorage
function removeTrackFromLocalStorage(track) {
  let storedTracks = JSON.parse(localStorage.getItem("tracksid")) || [];
  storedTracks = storedTracks.filter(t => t.name !== track.name);
  localStorage.setItem("tracksid", JSON.stringify(storedTracks));
  alert("La cançó s'ha eliminat correctament");
  getSelectedTracksFromLocalStorage();
}

getAccesToken();
