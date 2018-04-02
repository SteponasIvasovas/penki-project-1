import React from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {muiWrap} from '../scripts/helpers.js'
import {FORMAT} from '../data.js'

const containerStyle = {
  gridColumn: 'start/2',
  display: 'grid',
  gridTemplateRows: '0fr auto'
}

const paperStyle = {
  backgroundColor: 'rgba(232, 240, 194, 0.5)',
  gridRow: '1/2',
}

class Sidebar extends React.Component {
  handleCategoryClick = (event) => {
    this.props.onCategoryClick(event.target.textContent.toLowerCase());
  }
  render() {
    const categories = Object.keys(FORMAT).map(category => {
      return (
        <MenuItem
          key={category}
          style={{textAlign: 'center'}}
          primaryText={cap(category)}
          onClick={this.handleCategoryClick} />
      );
    });

    return (muiWrap(
      <div style={containerStyle}>
        <Paper style={paperStyle}>
          <Menu>
            {categories}
          </Menu>
        </Paper>
      </div>
      )
    );
  }
}

function cap(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
}

export default Sidebar;
