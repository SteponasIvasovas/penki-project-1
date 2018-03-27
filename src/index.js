/*
namas {
  id:
  info:
  miestas:
  rajonas:
  gatve:
}

miestas {
  id:
  info:
}

rajonas {
  id:
  info:
  miestas:
}

gatve {
  id:
  info:
  rajonas:
  miestas:
}
*/


import React from 'react';
import ReactDOM from 'react-dom';
import DATA from './data.js';
import './style/style.css'

const perPage = 3;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: Object.keys(this.props.data)[0],
      page: 0,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }
  handleClick(category) {
    this.setState({selected: category});
  }
  handlePageClick(page) {
    this.setState({page: page});
  }
  render() {
    const categories = Object.keys(this.props.data);
    const displayData = this.props.data[this.state.selected];

    return (
      <React.Fragment>
        <Sidebar onSidebarItemClick={this.handleClick} categories={categories}/>
        <MainBody
          onPageClick={this.handlePageClick}
          data={displayData}
          page={this.state.page}
        />
      </React.Fragment>
    );
  }
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event) {
    this.props.onSidebarItemClick(event.target.textContent);
  }
  render() {
    const categories = this.props.categories.map(category => {
      return (
        <li key={category} onClick={this.handleClick}>
          {category}
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

class MainBody extends React.Component {
  constructor(props) {
    super(props);
    this.handlePageClick = this.handlePageClick.bind(this);
  }
  handlePageClick(page) {
    this.props.onPageClick(page);
  }
  render() {
    const filtered = this.props.data.slice(this.props.page * perPage,
      this.props.page * perPage + perPage);

    return (
      <div className="main-body">
        <button className="btn-add">Pridet nauja</button>
        <DataList data={filtered}/>
        <NavPages
          onPageClick={this.handlePageClick}
          pages={Math.ceil(this.props.data.length / perPage)}
          current={this.props.page}
        />
      </div>
    );
  }
}

class DataList extends React.Component {
  componentDidMount() {
    this.height = this.el.offsetHeight;
  }
  componentDidUpdate() {
  }
  render() {
    const dataItems = this.props.data.map(dataItem => {
      return (
        <DataRow dataItem={dataItem} key={dataItem.id}/>
      );
    });

    return (
      <ul className='list-data' ref={((el) => this.el = el)} style={{minHeight: this.height}}>
        {dataItems}
      </ul>
    );
  }
}

class DataRow extends React.Component {
  render() {
    const dataItem = this.props.dataItem;

    return (
      <li>
        <span>{dataItem.info}</span>
        <button>Redaguoti</button>
      </li>
    );
  }
}

class NavPages extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(page) {
    this.props.onPageClick(page);
  }
  render() {
    const pages = [];
    const count = this.props.pages;

    if (count > 1) {
      if (count > 2 && this.props.current > 0) {
        pages.push(
          <li onClick={this.handleClick.bind(this, this.props.current - 1)}>
            &lt;
          </li>
        );
      }

      for (let i = 0; i < this.props.pages; i++) {
        pages.push(
          <li onClick={this.handleClick.bind(this, i)}>
            {i + 1}
          </li>
        );
      }

      if (count > 2 && this.props.current < count - 1) {
        pages.push(
          <li onClick={this.handleClick.bind(this, this.props.current + 1)}>
            &gt;
          </li>
        );
      }
    }

    return (
      <ul className="nav-pages">
        {pages}
      </ul>
    );
  }
}


ReactDOM.render(
  <Main data={DATA} />,
  document.getElementById('main')
);
