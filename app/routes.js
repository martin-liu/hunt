/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import UploadPage from './containers/UploadPage';

export const routes = [
  {
    path: "/",
    title: "Home",
    icon: 'home',
    component: HomePage
  },
  {
    path: "/upload",
    title: "Upload",
    // antd icon
    icon: 'upload',
    component: UploadPage
  },

];

let routeItems = routes.map(d => <Route key={d.path} path={d.path} component={d.component} />).reverse();

export default () => (
  <App>
    <Switch>
    {routeItems}
    </Switch>
  </App>
);
