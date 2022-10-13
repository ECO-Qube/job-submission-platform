import {Box, Button, Flex, Text} from "@chakra-ui/react";
import React, {PropsWithChildren} from "react";
import logo from "../assets/ecoqube-logo-4C-highres.png";
import { Link } from "react-router-dom";

type MenuItemProps = PropsWithChildren<{ isLast?: boolean, to: string }>;
const MenuItem = ({ children, isLast, to = "/"}: MenuItemProps) => {
  return (
    <Text
      mb={{ base: isLast ? 0 : 8, sm: 0 }}
      mr={{ base: 0, sm: isLast ? 0 : 8 }}
      display="block"
    >
      <Link to={to}>{children}</Link>
    </Text>
  );
};

const Navbar = () =>
  <Flex
    as="nav"
    align="center"
    justify="space-between"
    wrap="wrap"
    w="100%"
    mb={8}
    p={8}
    bg={["primary.500", "primary.500", "transparent", "transparent"]}
    color={["black", "black", "primary.700", "primary.700"]}
  >
    <p>Hey</p>
  </Flex>

export default Navbar;