import React from 'react';
import ReactDOM from 'react-dom';
import DATA from './data.js';
import './style/style.css'

const perPage = 3;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      selected: Object.keys(this.props.data)[0],
      page: 0,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleInfoChange = this.handleInfoChange.bind(this);
  }
  handleClick(category) {
    this.setState({
      selected: category,
      page: 0,
    });
  }
  handlePageClick(page) {
    this.setState({page: page});
  }
  handleInfoChange(id, value) {
    const newData = {...this.state.data};
    const categoryData = newData[this.state.selected];
    const index = categoryData.findIndex(element => element.id == id);
    const item = categoryData[index];
    const newItem = {...item, info: value};
    categoryData[index] = newItem;

    this.setState({
      data: newData
    });
  }
  render() {
    const categories = Object.keys(this.props.data);
    const displayData = this.state.data[this.state.selected];

    return (
      <React.Fragment>
        <Sidebar onSidebarItemClick={this.handleClick} categories={categories}/>
        <MainBody
          onInfoChange={this.handleInfoChange}
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
    this.handleInfoChange = this.handleInfoChange.bind(this);
  }
  handlePageClick(page) {
    this.props.onPageClick(page);
  }
  handleInfoChange(id, value) {
    this.props.onInfoChange(id, value);
  }
  render() {
    const filtered = this.props.data.slice(this.props.page * perPage,
      this.props.page * perPage + perPage);

    return (
      <div className="main-body">
        <button className="btn-add">Pridet nauja</button>
        <DataList data={filtered} onInfoChange={this.handleInfoChange}/>
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
  constructor(props) {
    super(props);
    this.handleInfoChange = this.handleInfoChange.bind(this);
  }
  componentDidMount() {
    // this.height = this.el.offsetHeight;
  }
  componentDidUpdate() {
  }
  handleInfoChange(id, value) {
    this.props.onInfoChange(id, value);
  }
  render() {
    const dataItems = this.props.data.map(dataItem => {
      return (
        <DataRow dataItem={dataItem} key={dataItem.id} onInfoChange={this.handleInfoChange}/>
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
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      value: this.props.dataItem.info,
    };
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleInfoChange = this.handleInfoChange.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }
  handleCancelClick() {
    this.setState({
      value: this.props.dataItem.info,
      editable: false,
    })
  }
  handleEditClick() {
    this.setState({editable: true});
  }
  handleSaveClick(id) {
    this.setState({editable: false});
    this.props.onInfoChange(id, this.state.value);
  }
  handleInfoChange(event) {
    this.setState({value: event.target.value});
  }
  componentDidUpdate() {
    if (this.input) {
      // this.input.focus();
      // const info = this.state.value;
      // this.input.selectionStart = info.length;
      // this.input.selectionEnd = info.length;
    }
  }
  render() {
    const dataItem = this.props.dataItem;

    return (
      <li>
        {this.state.editable ?
          <textarea
            value={this.state.value}
            onChange={this.handleInfoChange}
            ref={(input) => (this.input = input)}
          />:
          dataItem.info
        }
        {this.state.editable ?
          (<div>
            <button onClick={this.handleSaveClick.bind(this, dataItem.id)}>Issaugoti</button>
            <button onClick={this.handleCancelClick}>Atsaukti</button>
          </div>) :
          <button onClick={this.handleEditClick}>Redaguoti</button>
        }
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
    if (page < 0 || page >= this.props.pages) return;
    this.props.onPageClick(page);
  }
  render() {
    const pages = [];
    const count = this.props.pages;

    if (count > 1) {
      if (count >= 2) {
        const className = (this.props.current === 0) ? 'disabled' : '';
        pages.push(
          <li className={className}
              onClick={this.handleClick.bind(this, this.props.current - 1)}>
            &lt;
          </li>
        );
      }

      for (let i = 0; i < this.props.pages; i++) {
        const className = (i === this.props.current) ? 'active' : '';
        pages.push(
          <li className={className}
              onClick={this.handleClick.bind(this, i)}>
            {i + 1}
          </li>
        );
      }

      if (count >= 2) {
        const className = (this.props.current === count - 1) ? 'disabled' : '';
        pages.push(
          <li className={className}
              onClick={this.handleClick.bind(this, this.props.current + 1)}>
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
