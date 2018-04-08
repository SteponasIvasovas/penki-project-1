// import React from 'react';
// import Main from './components/Main.js';
// import {createStore} from 'redux';

import ReactDOM from 'react-dom';
import React from 'react';
import Root from './containers/Root';
import Header from './componentsOLD/Header.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
  <Header />,
  document.getElementById('header')
);

ReactDOM.render(
  (<MuiThemeProvider>
    <Root />
  </MuiThemeProvider>),
  document.getElementById('main')
);
