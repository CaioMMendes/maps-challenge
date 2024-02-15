import { Autocomplete } from "@react-google-maps/api";
import { Box } from "./Box";
import { Button } from "./Button";
import { Input, InputContainer, InputLabel, InputLabelText } from "./Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputSchema } from "../types/form-types";
import { z } from "zod";
import { CoordinatesType } from "../hooks/useLocation";

type RouteFormData = z.infer<typeof inputSchema>;

type FormProps = {
  centerLocation: CoordinatesType;
  setDirectionResponse: React.Dispatch<
    React.SetStateAction<google.maps.DirectionsResult | null>
  >;
  setRoutes: React.Dispatch<
    React.SetStateAction<google.maps.DirectionsLeg | null>
  >;
};

const Form = ({
  centerLocation,
  setDirectionResponse,
  setRoutes,
}: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RouteFormData>({
    resolver: zodResolver(inputSchema),
  });

  const onSubmit = async (data: RouteFormData) => {
    if (data.end === "") return;
    if (centerLocation.lat === -15.792204 && centerLocation.lng === -47.890343)
      return alert("Voce precisa permitir o rastreio da sua localização atual");
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

  return (
    <Box
      variant="secondary"
      className=" absolute  left-1/2 top-2 -translate-x-1/2 z-10"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex  gap-1 w-full">
        <InputContainer
          error={!!errors.start}
          errorMessage={errors.start?.message}
          className="hidden"
        >
          <InputLabel>
            <InputLabelText>Partida</InputLabelText>
            <Autocomplete>
              <Input
                {...register("start")}
                disabled
                value={"Seu local atual"}
                placeholder="Informe o ponto de partida"
                error={!!errors.start}
                // ref={originRef}
                className="w-80"
              />
            </Autocomplete>
          </InputLabel>
        </InputContainer>

        <InputContainer error={!!errors.end} errorMessage={errors.end?.message}>
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
  );
};

export default Form;
