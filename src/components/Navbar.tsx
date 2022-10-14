import {Box, Button, Flex, flexbox, Text} from "@chakra-ui/react";
import React, {PropsWithChildren} from "react";
import logo from "../assets/ecoqube-logo-4C-highres.png";
import {Link} from "react-router-dom";
import {ColorModeSwitcher} from "../ColorModeSwitcher";
import EcoQubeLogo from "../assets/ecoqube-logo-4C-highres.png"
import * as url from "url";
import { chakra } from "@chakra-ui/react"

type MenuItemProps = PropsWithChildren<{ isLast?: boolean, to: string }>;
const MenuItem = ({children, isLast, to = "/"}: MenuItemProps) => {
    return (
        <Text
            mb={{base: isLast ? 0 : 8, sm: 0}}
            mr={{base: 0, sm: isLast ? 0 : 8}}
            display="block"
        >
            <Link to={to}>{children}</Link>
        </Text>
    );
};

const Navbar = () =>
    <Flex
        w="100wh"
        px="6"
        py="5"
        align="center"
        justify="space-between"
        alignContent="center"
        fontFamily={"Noto Sans, sans-serif"}
    >
        <Flex alignItems="center" columnGap="100px">
            <chakra.img display="inline-block" width="110px" src={logo} alt="EcoQube logo"/>
            <Text as="span">Job Submission Platform</Text>
        </Flex>
        <Box as="span" alignItems="right">
            <Box as="span" justifySelf="flex-end">Menu</Box>
            <ColorModeSwitcher justifySelf="flex-end"/>
        </Box>
    </Flex>

export default Navbar;