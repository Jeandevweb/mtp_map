import { Box, ScaleFade, useDisclosure } from "@chakra-ui/react";
import ButtonControlCard from "./ButtonControlCard";
import { motion } from "framer-motion";
import IconControl from "./IconControl";
import MapLayers from "./MapLayers";

const CardControl = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <ButtonControlCard onToggle={onToggle} />
      <ScaleFade in={isOpen} initialScale={0.7}>
        <Box
          as={motion.div}
          top="95px"
          zIndex={999}
          right="20px"
          position="absolute"
          backgroundColor="white"
          color="white"
          padding="15px 15px 5px"
          transition="all 1s ease-out"
          borderRadius="10px"
        >
          <MapLayers />
          <IconControl />
        </Box>
      </ScaleFade>
    </>
  );
};

export default CardControl;
