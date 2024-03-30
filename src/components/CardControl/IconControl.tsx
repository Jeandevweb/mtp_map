import { Flex, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import useIconControl from "../../hooks/useIconControl";

const IconControl = () => {
  const { iconCardControl } = useIconControl();

  return (
    <Flex
      boxShadow="lg"
      rounded="2xl"
      padding="12px"
      marginBottom="10px"
      color="darkslategrey"
      backgroundColor="whiteAlpha.900"
      zIndex={10}
    >
      <Flex align="center" flex="1">
        {iconCardControl?.map((icon) => {
          return (
            <Image
              src={icon.image}
              key={icon.name}
              as={motion.img}
              cursor="pointer"
              borderRadius="10px"
              background={"no-repeat"}
              height={"100%"}
              width={"100%"}
              boxSize="42px"
              objectFit="cover"
              marginRight="20px"
              rounded="xl"
              initial={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.3 },
              }}
              onClick={icon.setter}
            />
          );
        })}
      </Flex>
    </Flex>
  );
};

export default IconControl;
