import {Box, Flex, Text} from "@chakra-ui/react";
import {ColorModeSwitcher} from "ColorModeSwitcher";
import EcoQubeLogo from "assets/ecoqube-logo-4C-invert-highres.png"
import StageBackground from "assets/stage-background.jpg"

import {chakra} from "@chakra-ui/react"
import {PropsWithChildren} from "react";
import {Link} from "react-router-dom";

type MenuItemProps = PropsWithChildren<{ isLast?: boolean, to: string }>;
const MenuItem = ({children, to = "/"}: MenuItemProps) => {
  return (
    <Text
      mb={{base: 8, sm: 0}}
      display="block"
    >
      <Link to={to}>{children}</Link>
    </Text>
  );
};

const Navbar = () =>
  <Flex
    w="100wh"
    px="50px"
    py="5"
    align="center"
    alignContent="center"
    justify="space-between"
    fontFamily={"Noto Sans, sans-serif"}
    backgroundImage={StageBackground}
    color="white"
    backgroundPosition="0 -150px"
    backgroundSize="cover"
    fontSize="xl"
  >
    <Flex alignItems="center" columnGap="100px" minHeight="85px">
      <chakra.img display="inline" w="110px" src={EcoQubeLogo} alt="EcoQube logo"/>
      <Text as="span" fontSize="30px" fontWeight="600">Job Submission Platform</Text>
    </Flex>
    <Box as="span" backgroundColor="blackAlpha.700" px="52px" py="28px" borderRadius="6pt">
      <Flex
        columnGap="80px"
        alignItems="center"
      >
        <MenuItem to="/">Home</MenuItem>
        <MenuItem to="/reports">Reports</MenuItem>
        <MenuItem to="/admin">Admin</MenuItem>
        <ColorModeSwitcher marginLeft="-14px" marginRight="-14px"/>
      </Flex>
    </Box>
  </Flex>

export default Navbar;