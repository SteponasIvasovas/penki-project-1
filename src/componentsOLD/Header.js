import React from 'react';
import AppBar from 'material-ui/AppBar';
import {Tabs, Tab} from 'material-ui/Tabs';
//mine
import {muiWrap} from '../scripts/helpers.js'
import mainLogo from '../images/5ci-optimized.png';

const appBarStyle = {
  display: 'grid',
  gridTemplateColumns: '[start] 150px auto 200px [end]',
  padding: 0,
  height: 64,
  backgroundColor: 'rgb(197, 209, 135)'
}
const tabContainer = {
  gridColumn: '2/3',
  height: 64,
}
const inkBarStyle = {
  backgroundColor: 'rgba(0, 188, 212, 0.25)'
}
const tabStyle = {
  minWidth: 200,
  height: 64,
  backgroundColor: 'rgb(197, 209, 135)',
}
const logoContainer = {
  height: 64,
  gridColumn: 'start/2',
  display: 'grid',
}
const logoStyle = {
  width: '90%',
  alignSelf: 'center',
  justifySelf: 'center',
}

class Header extends React.Component {
  render() {
    const logo = (
      <a href="#header" style={logoContainer}>
        <img style={logoStyle} src={mainLogo} alt="5ci-logo"/>
      </a>
    );
    const tabs = (
      <Tabs style={tabContainer} inkBarStyle={inkBarStyle}>
        <Tab
          style={tabStyle}
          label='House management' />
        <Tab
          style={tabStyle}
          label='Dick management' />
        <Tab
          style={tabStyle}
          label='Something management' />
      </Tabs>
    );
    return (
      muiWrap(
        <AppBar
          title={logo}
          style={appBarStyle}
          children={tabs}
          showMenuIconButton={false} />
      )
    );
  }
}

export default Header;
