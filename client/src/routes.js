import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Login from "./pages/Login/";
import Dashboard from "./pages/Dashboard/";
import Register from "./pages/Register";
import EventsPage from "./pages/EventsPage";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/events" component={EventsPage} />
        <Route path="/register" exact component={Register} />
      </Switch>
    </BrowserRouter>
  );
}
