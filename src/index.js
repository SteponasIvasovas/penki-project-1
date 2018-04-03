import ReactDOM from 'react-dom';
import React from 'react';
import Main from './components/Main.js';
import Header from './components/Header.js'
import {createStore} from 'redux';

ReactDOM.render(
  <Header />,
  document.getElementById('header')
);

ReactDOM.render(
  <Main />,
  document.getElementById('main')
);
