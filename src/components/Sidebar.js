import React from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.handleCategoryClick = this.handleCategoryClick.bind(this);
  }
  handleCategoryClick(event) {
    this.props.onSidebarItemClick(event.target.textContent.toLowerCase());
  }
  render() {
    const categories = this.props.categories.map(category => {
      return (
        <MenuItem
          key={category}
          style={{textAlign: 'center'}}
          primaryText={cap(category)}
          onClick={this.handleCategoryClick} />
      );
    });

    return (muiWrap(
      <Paper style={{gridColumn: 'start/2'}}>
        <Menu>
          {categories}
        </Menu>
      </Paper>
      )
    );
  }
}

function cap(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
}

function muiWrap(...components) {
  const wrapped = components.map((c, i) => {
    return (
      <MuiThemeProvider key={i}>
        {c}
      </MuiThemeProvider>
    )
  })
  return wrapped;
}

export default Sidebar
