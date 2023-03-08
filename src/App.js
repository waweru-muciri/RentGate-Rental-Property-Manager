import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DashboardPage from "./Routes/MainRoute";
import LoginPage from "./Routes/Login";


const App = ({ store }) => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route path="/" component={DashboardPage} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
