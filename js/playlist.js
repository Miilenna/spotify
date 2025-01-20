const API_URL_SEVERAL_TRACKS = "https://api.spotify.com/v1/tracks";

const accesToken = window.location.href.split("acces_token=") [1];

const getPlayList = function() {

}
const getIdtracksLocalStorage = function (){
    return localStorage.getItem("trackList");
}

const getTrack = async function (llistaTracks) {
    const urlEndpoint = `${API_URL_SEVERAL_TRACKS}?ids=${llistaTracks}`;

    try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
    
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    
    
        const data = await response.json();
    
    
        if (data) {
          console.log(data.id);
        } else {
          console.log("No hi ha usuari");
        }
      } catch (error) {
        console.error("Error en obtenir l'usuari:", error);
      }
    };

const getTrackSelected = function () {
    let llistaTracks = getIdtracksLocalStorage();
    console.log(llistaTracks);
    llistaTracks = llistaTracks.replaceAll(";", ",");
    getTrack(llistaTracks);
}


const deleteTracks = function (idTrack) {
    let trackIds = JSON.parse(localStorage.getItem("llistaIds"));

    if (trackIds.length > 0) {
        const indice = trackIds.indexOf(idTrack);
        if (indice !== 1) {

        }
    }
}



getPlayList();
getTrackSelected();