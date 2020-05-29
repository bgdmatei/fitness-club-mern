import React from "react";
import { Container } from "reactstrap";
import Routes from "./routes";
import "./App.css";

function App() {
  return (
    <Container>
      <h1>Fitness app</h1>
      <Routes />
    </Container>
  );
}

export default App;