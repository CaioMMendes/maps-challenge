import {
  DirectionsRenderer,
  GoogleMap,
  Libraries,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "./hooks/useLocation";
import Form from "./components/Form";
import { textToSpeech } from "./utils/text-to-speech";
import { removeTags } from "./utils/remove-tags";

function App() {
  const [libraries] = useState<Libraries>(["places"]);
  const speaking = useRef(false);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
    language: "pt-BR",
  });
  const { centerLocation, getLocation } = useLocation();
  const [originLocation, setOriginLocation] = useState(centerLocation);
  const [routes, setRoutes] = useState<google.maps.DirectionsLeg | null>(null);
  const [directionResponse, setDirectionResponse] =
    useState<google.maps.DirectionsResult | null>(null);

  // console.log(routes);
  //eslint-disable-next-line
  const indice = useRef<number>(0);
  useEffect(() => {
    getLocation();
    //eslint-disable-next-line
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        permissionStatus.onchange = () => {
          getLocation();
        };
      });
  }, [routes]);

  useEffect(() => {
    if (routes === null) return;
    // console.log(speaking.current);
    console.log(routes);
    const intervalId = setInterval(() => {
      // console.log(speaking.current);
      if (!speaking.current) {
        const instruction = removeTags(
          routes.steps[indice.current].instructions
        );
        textToSpeech(instruction, speaking);

        const endLocation = routes.steps[indice.current].end_location;
        const latitude = endLocation.lat();
        const longitude = endLocation.lng();
        const nextIndice = indice.current + 1;
        indice.current = nextIndice;
        setOriginLocation({ lat: latitude, lng: longitude });

        // Verifica se o próximo índice é maior ou igual ao comprimento do array
        if (nextIndice >= routes?.steps.length) {
          indice.current = 0;
          setRoutes(null);
          // Limpa o intervalo se o final do array for alcançado
          clearInterval(intervalId);
          textToSpeech("Você chegou no destino", speaking);
        }
        return nextIndice;
      }
    }, 3000);

    // Limpa o intervalo quando o componente é desmontado
    return () => {
      clearInterval(intervalId);
    };
  }, [routes]);

  if (!isLoaded) {
    return (
      <div className="w-full min-h-screen bg-onyx-600 flex items-center justify-center text-2xl text-zinc-50">
        Loading ...
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="w-full min-h-screen bg-onyx-600 flex items-center justify-center text-2xl text-zinc-50">
        Ocorreu um erro
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-onyx-600 flex items-center justify-center">
      <div className="max-w-screen-2xl flex flex-col w-full min-h-screen relative ">
        <div className="absolute  w-full h-full ">
          <Form
            centerLocation={centerLocation}
            setDirectionResponse={setDirectionResponse}
            setRoutes={setRoutes}
          />
          <GoogleMap
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={centerLocation}
            options={{
              streetViewControl: false,
            }}

            // onLoad={(map) => setMap(map)}
          >
            <Marker
              position={originLocation || centerLocation}
              title={"Você está aqui"}
              options={{
                label: {
                  text: "Você está aqui",
                  className: `markerMaps`,
                  fontSize: "16px",
                  color: "#eff1f0",
                  fontWeight: "500",
                },
              }}
            />

            {directionResponse && (
              <DirectionsRenderer directions={directionResponse} />
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}

export default App;
