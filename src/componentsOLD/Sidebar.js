import React from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';

const menuItemStyle = {
  textAlign: 'center'
}
const containerStyle = {
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
    const categories = this.props.categories.map(category => {
      return (
        <MenuItem
          key={category}
          style={menuItemStyle}
          primaryText={cap(category)}
          onClick={this.handleCategoryClick} />
      );
    });

    return (
      <div style={containerStyle}>
        <Paper style={paperStyle}>
          <Menu>
            {categories}
          </Menu>
        </Paper>
      </div>
    );
  }
}

Sidebar.propTypes = {
  onCategoryClick: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
}

function cap(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
}
 

export default Sidebar;
