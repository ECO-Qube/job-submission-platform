import * as React from "react"
import {
  ChakraProvider, extendTheme,
} from "@chakra-ui/react"
import Navbar from "components/Navbar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "pages/Home";
import Reports from "pages/Reports";
import Admin from "pages/Admin";

const brandingColors = {
  colors: {
    ecoqube: {
      dark: {
        blue: "#005970",
        grey: "#191F2B",
      },
      blue: "#00A5D3",
      turquoise: "#68C0AC",
    }
  }
}

const theme = extendTheme({
  ...brandingColors,
})

export const App = () => (
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/reports" element={<Reports/>}/>
        <Route path="/admin" element={<Admin/>}/>
      </Routes>
    </ChakraProvider>
  </BrowserRouter>
)
