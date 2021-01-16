import React from "react";
import { HashRouter } from "react-router-dom";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Body from "./components/Body";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <HashRouter>
    	<div className="App Site">
            <div className="Site-content">
                <Header />
               	<Navigation />
                <Body />
            </div>
            <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
