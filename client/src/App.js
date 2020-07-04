import React from "react";
import { Container } from "reactstrap";
import Routes from "./routes";
import TopNav from "./components/TopNav";
import { ContextWrapper } from "./user-context";
import "./App.css";

function App() {
  return (
    <ContextWrapper>
      <TopNav />
      <Container>
        <h1>Fitness app</h1>
        <div className="content">
          <Routes />
        </div>
      </Container>
    </ContextWrapper>
  );
}

export default App;
