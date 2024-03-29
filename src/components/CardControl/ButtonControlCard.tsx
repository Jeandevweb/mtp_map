import { Button } from "@chakra-ui/react";
import { FaGear } from "react-icons/fa6";

type ButtonControlCardProps = {
  onToggle: () => void;
};

const ButtonControlCard = ({ onToggle }: ButtonControlCardProps) => {
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
      onClick={onToggle}
    >
      <FaGear />
    </Button>
  );
};

export default ButtonControlCard;
