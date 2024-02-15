import { z } from "zod";
import { Button } from "./components/Button";
import {
  Input,
  InputContainer,
  InputLabel,
  InputLabelText,
} from "./components/Input";
import { inputSchema } from "./types/form-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "./components/Box";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { useLocation } from "./hooks/useLocation";
import { useEffect } from "react";

type RouteFormData = z.infer<typeof inputSchema>;

function App() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  const { centerLocation, getLocation } = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RouteFormData>({
    resolver: zodResolver(inputSchema),
  });
  const onSubmit = (data: RouteFormData) => {
    console.log(data);
  };

  useEffect(() => {
    getLocation();
    console.log("first");
    //eslint-disable-next-line
  }, []);

  if (!isLoaded) {
    return <div>Loading ...</div>;
  }
  if (loadError) {
    return <div>Ocorreu um erro</div>;
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
                <Input
                  {...register("start")}
                  placeholder="Informe o ponto de partida"
                  error={!!errors.start}
                />
              </InputLabel>
            </InputContainer>
            <InputContainer
              error={!!errors.end}
              errorMessage={errors.end?.message}
            >
              <InputLabel>
                <InputLabelText>Destino</InputLabelText>
                <Input
                  {...register("end")}
                  placeholder="Informe o destino"
                  error={!!errors.end}
                />
              </InputLabel>
            </InputContainer>
            <Button>Submit</Button>
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
          >
            {centerLocation.lat !== -15.792204 &&
              centerLocation.lng !== -47.890343 && (
                <Marker
                  position={centerLocation}
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
              )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}

export default App;
