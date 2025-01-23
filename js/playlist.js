  const API_URL_SEVERAL_TRACKS = "https://api.spotify.com/v1/tracks";
  let accesToken = "";


  function getAccesToken(){
    accesToken =window.location.href.split("access_token=")[1];
    console.log(accesToken);
  }


  

  const getPlayList = function(){
      console.log("getPlayList");
  }

  const getIdtracksLocalStorage = function(){
      return localStorage.getItem("tracksid");
  }

  const getTrack = async function(llistatracks){
      const urlEndpoint = `${API_URL_SEVERAL_TRACKS}?ids=${llistatracks}`;
      console.log(urlEndpoint);

      try{
          const resposta = await fetch(urlEndpoint, 
              {
                "method":"GET",
                "headers":{
                  Authorization: `Bearer ${accesToken}`,
                }
              }
        
          );

          //tractar la resposta
          if(!resposta.ok){
              throw Error("Error al fer la consulta", resposta.status);
          }

          //consultar la informació
          const tracks = await resposta.json();
          console.log(tracks);
          //mostrar la informació per pantalla
          renderTracksSelected(tracks);

      }catch (error){
          console.log(error);
      }
  }

  const getTrackSelected = function(){
      let llistatracks = getIdtracksLocalStorage();
      console.log(llistatracks);
      let llistatracksJSON = JSON.parse(llistatracks);
      console.log(llistatracksJSON.ids.join(","));
      //llistatracks = llistatracks.replaceAll(";", ",")

      //cridar l'endpoint https://api.spotify.com/v1/tracks
      
  }

  


  getAccesToken();
  console.log('inici del programa');
  getPlayList();
  console.log('meitat del programa');
  getTrackSelected();
  console.log('final del programa');