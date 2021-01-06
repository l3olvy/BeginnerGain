import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Body from "./components/Body";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <HashRouter>
      <Header />
      <Navigation />
      <Body />
      <Footer/>
    </HashRouter>
  );
}

export default App;
