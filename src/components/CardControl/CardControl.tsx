import { Button, ScaleFade, useDisclosure } from "@chakra-ui/react";
import ButtonControlCard from "./ButtonControlCard";
import CardLayout from "./CardLayout";
import useBikeStationStore from "../../store/useBikeStationStore";

const CardControl = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { setisShowStation } = useBikeStationStore();

  return (
    <>
      <ButtonControlCard onToggle={onToggle} />
      <ScaleFade in={isOpen} initialScale={0.7}>
        <CardLayout />
      </ScaleFade>
      <Button onClick={setisShowStation}>open</Button>
    </>
  );
};

export default CardControl;
