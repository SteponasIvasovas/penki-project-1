import React from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';

class AppSidebar extends React.PureComponent {
  handleCategoryClick = (event) => {
    const category = event.target.textContent.toLowerCase();
    this.props.onCategoryClick(category);
  }
  render() {
    const {categories, styles} = this.props;
    const {menuItemStyle, containerStyle, paperStyle} = styles;
    const categoriesUI = categories.map(category => {
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
            {categoriesUI}
          </Menu>
        </Paper>
      </div>
    );
  }
}

AppSidebar.propTypes = {
  onCategoryClick: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
}

function cap(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase();
}

export default AppSidebar;
