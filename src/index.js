import ReactDOM from 'react-dom';
import React from 'react';
import Main from './main.js';
import {DATA} from './data.js';

ReactDOM.render(
  <Main data={DATA} />,
  document.getElementById('main')
);
