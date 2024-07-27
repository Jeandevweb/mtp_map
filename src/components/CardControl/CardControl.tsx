import { Box } from "@chakra-ui/react";
import ButtonControlCard from "./ButtonControlCard";
import { AnimatePresence, motion } from "framer-motion";
import IconControl from "./IconControl";
import MapLayers from "./MapLayers";
import useGenericStore, { GenericState } from "../../store/useGenericStore";

const CardControl = () => {
  const isOpen = useGenericStore((state: GenericState) => state.isOpenGeneric);

  return (
    <>
      <ButtonControlCard />
      {isOpen && (
        <>
          <AnimatePresence initial={true}>
            <Box
              as={motion.aside}
              initial={{
                x: "100%",
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
                width: "300px",
                transition: { type: "spring", bounce: 0.4, duration: 0.7 },
              }}
              exit={{
                x: "100%",
                opacity: 0,
                transition: { type: "spring", bounce: 0.4, duration: 0.7 },
              }}
              top="95px"
              zIndex={999}
              right="20px"
              position="fixed"
              bg="rgba(246,246,246,0.8)"
              color="white"
              padding="15px 15px 5px"
              borderRadius="10px"
            >
              <MapLayers />
              <IconControl />
            </Box>
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default CardControl;
