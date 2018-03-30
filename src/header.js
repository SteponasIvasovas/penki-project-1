import React from 'react';
import ReactDOM from 'react-dom';
import {Tabs, Tab} from 'material-ui/Tabs';
//mine
import {DATA} from './data.js';
import {muiWrap} from './scripts/helpers.js'
import './style/style.css';

class Header extends React.Component {
  render() {
    return (
      muiWrap(
        <Tabs>
          <Tab label='House management'>
            <div id="main">
              <Main data={DATA}/>
            </div>
          </Tab>
          <Tab label='Dick management'>
            <div>Hello</div>
          </Tab>
        </Tabs>
      )
    )
  }
}

export default Header;
