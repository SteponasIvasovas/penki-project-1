import React from 'react';

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
        <li key={category} onClick={this.handleCategoryClick}>
          <span>
            {cap(category)}
          </span>
        </li>
      );
    });

    return (
      <div className="sidebar">
        <ul>
          {categories}
        </ul>
      </div>
    );
  }
}

function cap(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
}

export default Sidebar
