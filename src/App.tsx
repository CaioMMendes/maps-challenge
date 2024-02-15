import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  Libraries,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Box } from "./components/Box";
import { Button } from "./components/Button";
import {
  Input,
  InputContainer,
  InputLabel,
  InputLabelText,
} from "./components/Input";
import { useLocation } from "./hooks/useLocation";
import { inputSchema } from "./types/form-types";

type RouteFormData = z.infer<typeof inputSchema>;

function App() {
  const [libraries] = useState<Libraries>(["places"]);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
    language: "pt-BR",
  });
  const { centerLocation, getLocation } = useLocation();
  // const [map, setMap] = useState<google.maps.Map | null>(null);
  const [originLocation, setOriginLocation] = useState(centerLocation);
  const [routes, setRoutes] = useState<google.maps.DirectionsLeg | null>(null);
  const [directionResponse, setDirectionResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  //eslint-disable-next-line
  const [indice, setIndice] = useState(0); // Estado para armazenar o índice atual
  useEffect(() => {
    getLocation();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (routes === null) return;
    const intervalId = setInterval(() => {
      // Incrementa o índice a cada 2 segundos
      setIndice((prevIndice) => {
        const endLocation = routes.steps[prevIndice].end_location;
        const latitude = endLocation.lat();
        const longitude = endLocation.lng();
        console.log(latitude, longitude);
        const nextIndice = prevIndice + 1;

        setOriginLocation({ lat: latitude, lng: longitude });

        // Verifica se o próximo índice é maior ou igual ao comprimento do array
        if (nextIndice >= routes?.steps.length) {
          // Limpa o intervalo se o final do array for alcançado
          clearInterval(intervalId);
        }
        return nextIndice;
      });
    }, 2000);

    // Limpa o intervalo quando o componente é desmontado
    return () => {
      clearInterval(intervalId);
    };
  }, [routes]); // O segundo argumento vazio faz com que o useEffect seja executado apenas uma vez, após a montagem inicial do componente

  // const originRef = useRef<MutableRefObject<HTMLInputElement>>();
  // const destinationRef = useRef<MutableRefObject<HTMLInputElement>>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RouteFormData>({
    resolver: zodResolver(inputSchema),
  });
  const onSubmit = async (data: RouteFormData) => {
    // if (data.start === "" || data.end === "") return;
    try {
      const directionService = new google.maps.DirectionsService();
      const results = await directionService.route({
        // origin: data.start,
        origin: centerLocation,
        destination: data.end,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionResponse(results);
      setRoutes(results.routes[0].legs[0]);
    } catch (error) {
      alert("Não foi possível estabelecer uma rota");
    }
  };
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
        <Box
          variant="secondary"
          className=" absolute  left-1/2 top-2 -translate-x-1/2 z-10"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex  gap-1 w-full"
          >
            <InputContainer
              error={!!errors.start}
              errorMessage={errors.start?.message}
            >
              <InputLabel>
                <InputLabelText>Partida</InputLabelText>
                <Autocomplete>
                  <Input
                    {...register("start")}
                    placeholder="Informe o ponto de partida"
                    error={!!errors.start}
                    // ref={originRef}
                    className="w-80"
                  />
                </Autocomplete>
              </InputLabel>
            </InputContainer>

            <InputContainer
              error={!!errors.end}
              errorMessage={errors.end?.message}
            >
              <InputLabel>
                <InputLabelText>Destino</InputLabelText>
                <Autocomplete>
                  <Input
                    {...register("end")}
                    placeholder="Informe o destino"
                    error={!!errors.end}
                    // ref={destinationRef}
                    className="w-80"
                  />
                </Autocomplete>
              </InputLabel>
            </InputContainer>
            <Button type="submit">Encontrar Rota</Button>
          </form>
        </Box>
        <div className="absolute  w-full h-full ">
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
              position={originLocation}
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
