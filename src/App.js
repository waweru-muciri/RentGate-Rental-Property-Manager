import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainRoutePage from "./Routes/MainRoute";
import SignUpPage from "./Routes/SignUp";
import SignInPage from "./Routes/SignIn";
import AccountActions from "./Routes/AccountActions";
import HomePage from "./Routes/HomePage";


const App = ({ store }) => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path={"/account-actions"} component={AccountActions} />
          <Route exact path="/sign-up" component={SignUpPage} />
          <Route exact path="/login" component={SignInPage} />
          <Route path="/app/" component={MainRoutePage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
