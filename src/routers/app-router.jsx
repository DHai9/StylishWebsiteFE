import Footer from '../components/commons/footer';
import Navigation from '../components/commons/navigation';
import * as ROUTES from '../constants/routes';
import { createBrowserHistory } from 'history';
import React from 'react';
import { Route, Router, Routes } from 'react-router-dom';
import * as view from '../view';

export const history = createBrowserHistory();

const AppRouter = () => (
  <Router history={history}>
    <>
      <Navigation />
      <Routes>
        <Route
          component={view.Home}
          exact
          path={ROUTES.HOME}
        />
      </Routes>
      <Footer />
    </>
  </Router>
);

export default AppRouter;
