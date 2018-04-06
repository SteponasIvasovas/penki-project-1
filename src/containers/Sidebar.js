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

const mapStateToProps = (state, ownProps) => ({
  categories: Object.keys(FORMAT),
  category: state.selectedCategory,
  page: state[state.selectedCategory].page,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCategoryClick: (category, page, perPage) => {
      dispatch(selectCategory(category));
      dispatch(fetchItems(category, page, perPage));
      dispatch(fetchSelectsData(category));
      dispatch(disableCreateUI);
    }
  }
} 

class Sidebar extends React.Component {
  handleCategoryClick = (event) => {
    const category = event.target.textContent.toLowerCase();

    if (this.props.category === category && this.props.page === 0) return;

    const perPage = 5, page = 0;
    this.props.onCategoryClick(category, page, perPage);
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

const SidebarConnected = connect(mapStateToProps, mapDispatchToProps)(Sidebar);

export Sidebar;
