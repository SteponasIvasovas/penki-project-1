import ReactDOM from 'react-dom';
import React from 'react';
import Main from './Main.js';
import Header from './Header.js'


ReactDOM.render(
  <Header />,
  document.getElementById('header')
);


ReactDOM.render(
  <Main />,
  document.getElementById('main')
);
