import {Box, Flex, Text} from "@chakra-ui/react";
import React, {PropsWithChildren} from "react";
import {ColorModeSwitcher} from "../ColorModeSwitcher";
import EcoQubeLogo from "../assets/ecoqube-logo-4C-invert-highres.png"
import StageBackground from "../assets/stage-background.jpg"

import {chakra} from "@chakra-ui/react"

type MenuItemProps = PropsWithChildren<{ isLast?: boolean, to: string }>;
const MenuItem = ({children, to = "/"}: MenuItemProps) => {
    return (
        <Text
            mb={{base: 8, sm: 0}}
            display="block"
        >
            <Text>{children}</Text>
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
    >
        <Flex alignItems="center" columnGap="100px" minHeight="90px">
            <chakra.img display="inline" w="110px" src={EcoQubeLogo} alt="EcoQube logo"/>
            <Text as="span" fontSize="30px" fontWeight="600">Job Submission Platform</Text>
        </Flex>
        <Box as="span">
            <Flex
                columnGap="50px"
                alignItems="center"
            >
                <MenuItem to="/">Home</MenuItem>
                <MenuItem to="/reports">Reports</MenuItem>
                <MenuItem to="/admin">Admin</MenuItem>
                <ColorModeSwitcher/>
            </Flex>
        </Box>
    </Flex>

export default Navbar;