import React from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Body from "./components/Body";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    	<div className="App Site">
            <div className="Site-content">
                <Header />
               	<Navigation />
                <Body />
            </div>
            <Footer />
      </div>
  );
}

export default App;
