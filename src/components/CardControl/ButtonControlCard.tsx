import { Button } from "@chakra-ui/react";
import { FaGear } from "react-icons/fa6";
import useGenericStore, { GenericState } from "../../store/useGenericStore";

const ButtonControlCard = () => {
  const setIsOpen = useGenericStore(
    (state: GenericState) => state.setIsOpenGeneric
  );

  return (
    <Button
      fontSize="100px"
      top="20px"
      right="20px"
      zIndex={1999}
      position="absolute"
      cursor="pointer"
      h="50px"
      w="50px"
      _hover={{ hover: "none", border: "1px solid white" }}
      _focus={{ outline: "none" }}
      bg="white"
      color="black"
      borderRadius="50px"
      outline="0"
      onClick={setIsOpen}
    >
      <FaGear />
    </Button>
  );
};

export default ButtonControlCard;
