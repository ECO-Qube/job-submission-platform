import {Box, Button, Flex, flexbox, Text} from "@chakra-ui/react";
import React, {PropsWithChildren} from "react";
import logo from "../assets/ecoqube-logo-4C-highres.png";
import {Link} from "react-router-dom";
import {ColorModeSwitcher} from "../ColorModeSwitcher";
import EcoQubeLogo from "../assets/ecoqube-logo-4C-highres.png"
import * as url from "url";

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

const divStyle = {
    padding: "8px",
    marginLeft: "50px",
    display: "flex",
    width: "100hw",
    alignItems: "center",
    backgroundImage: "url("+{EcoQubeLogo}+")"
};

const menuStyle = {
    marginLeft: "auto",
    marginRight: "50px"
}

const leftDivStyle = {
    width: "40%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center"

}

const textStyle = {
    fontFamily: "Noto Sans"
}

const Navbar = () =>
    <div style={divStyle}>
        <span style={leftDivStyle}>
            <img width="110px" src={logo} alt="EcoQube logo"/>
            <span style={textStyle}>Job Submission Platform</span>
        </span>
        <span style={menuStyle}>Menu</span>
    </div>
/*    <Flex
        w="100%"
        px="6"
        py="5"
        align="center"
        justify="space-between"
    >
        <Flex>
            <Box width="110px"><img src={logo} alt="EcoQube logo"/></Box>
            <Text>Job Submission Platform</Text>
        </Flex>
        <Box justifySelf="flex-end">Menu</Box>
        <ColorModeSwitcher justifySelf="flex-end"/>
    </Flex>*/

export default Navbar;