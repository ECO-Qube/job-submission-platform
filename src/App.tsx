import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme, Switch,
} from "@chakra-ui/react"
import {ColorModeSwitcher} from "./ColorModeSwitcher"
import {Logo} from "./Logo"
import Navbar from "components/Navbar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "pages/Home";

export const App = () => (
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </ChakraProvider>
  </BrowserRouter>
)
