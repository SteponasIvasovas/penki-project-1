import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {DATA, dataFormat} from './data.js';
import './style/style.css';

const perPage = 5;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      create: false,
      data: this.props.data,
      selected: Object.keys(dataFormat)[0],
      page: 0,
    };
    this.handleCategoryClick = this.handleCategoryClick.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleItemDelete = this.handleItemDelete.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleAddCancelClick = this.handleAddCancelClick.bind(this);
    this.handleAddCreateSubmit = this.handleAddCreateSubmit.bind(this);
  }
  handleCategoryClick(category) {
    this.setState({
      selected: category,
      page: 0,
      create: false,
    });
  }
  handlePageClick(page) {
    this.setState({page: page});
  }
  handleNameChange(id, value) {
    const newData = {...this.state.data};
    const categoryData = newData[this.state.selected];
    const index = categoryData.findIndex(element => element.id === id);
    const newItem = {...categoryData[index], name: value};
    categoryData[index] = newItem;
    this.setState({data: newData});
  }
  handleItemDelete(id) {
    const newData = {...this.state.data};
    const categoryData = newData[this.state.selected];
    const newCategoryData = categoryData.filter(element => element.id !== id);
    newData[this.state.selected] = newCategoryData;
    this.setState({data: newData});
  }
  handleAddClick() {
    this.setState({create: true});
  }
  handleAddCancelClick() {
    this.setState({create: false});
  }
  handleAddCreateSubmit(item) {
    const newData = {...this.state.data};
    const categoryData = newData[this.state.selected].concat(item);
    newData[this.state.selected] = categoryData;
    this.setState({
      create: false,
      data: newData
    });
  }
  render() {
    const categories = Object.keys(dataFormat);
    const selected = this.state.selected, data = this.state.data, page = this.state.page;
    let body;

    if (this.state.create) {
      const available = [];
      for (let key in data) {
        available[key] = data[key].map(item => {
          return {id: item.id, name: item.name}
        });
      }

      body = (
        <CreateForm
          onAddCancelClick={this.handleAddCancelClick}
          onAddCreateSubmit={this.handleAddCreateSubmit}
          // available ids paired with names
          data={available}
          // selected category
          selected={selected}
        />
      );
    } else {
      let filtered = data[selected].slice(page * perPage,
        page * perPage + perPage);

      const category = dataFormat[selected];
      filtered = filtered.map(item => {
        let out = item.name + ', ';
        for (let key in category) {
          const id = item[category[key]];
          const name = getName(data, key, id);
          if (name) out += name + ', ';
        }

        return {...item, out: out.replace(/(.*),/, "$1.")};
      });

      const pages = Math.ceil(data[selected].length / perPage)

      body = (
        <MainBody
          onNameChange={this.handleNameChange}
          onPageClick={this.handlePageClick}
          onItemDelete={this.handleItemDelete}
          onAddClick={this.handleAddClick}
          data={filtered}
          page={page}
          pages={pages}
        />
      );
    }

    return (
      <React.Fragment>
        <Sidebar
          onSidebarItemClick={this.handleCategoryClick}
          categories={categories}
        />
        {body}
      </React.Fragment>
    );
  }
}

class MainBody extends React.Component {
  constructor(props) {
    super(props);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleItemDelete = this.handleItemDelete.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
  }
  handleItemDelete(id) {
    this.props.onItemDelete(id);
  }
  handlePageClick(page) {
    this.props.onPageClick(page);
  }
  handleNameChange(id, value) {
    this.props.onNameChange(id, value);
  }
  handleAddClick() {
    this.props.onAddClick();
  }
  render() {
    return (
      <div className="main-body">
        <button onClick={this.handleAddClick} className="btn-add">Prideti nauja</button>
        <DataList
          data={this.props.data}
          onItemDelete={this.handleItemDelete}
          onNameChange={this.handleNameChange}
        />
        <NavPages
          onPageClick={this.handlePageClick}
          // pages = kiek is viso puslapiu
          pages={this.props.pages}
          // current = dabartinis puslapis
          current={this.props.page}
        />
      </div>
    );
  }
}

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
          {cap(category)}
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

class CreateForm extends React.Component {
  constructor(props) {
    super(props);
    const selectsIds = [];
    //isrenkam categorijos kejus pvz: kategorija: namai, kejai: Miestas, Gatve, Rajonas
    //category bus {Miestas, Gatve, Rajonas}
    const category = dataFormat[this.props.selected];
    for (let key in category) {
      // selects[Miestas.toLowerCase()] = {id: 1, name: Grazus miestas - 1}
      if (this.props.data[key][0]) {
        selectsIds[category[key]] = this.props.data[key][0].id || null;
      }
    }

    this.state = {
      name: '',
      selects: selectsIds,
    }

    this.handleAddCancelClick = this.handleAddCancelClick.bind(this);
    this.handleAddCreateSubmit = this.handleAddCreateSubmit.bind(this);
    this.handleAddSelect = this.handleAddSelect.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }
  handleAddCancelClick(event) {
    event.preventDefault();
    this.props.onAddCancelClick();
  }
  handleAddCreateSubmit(event) {
    event.preventDefault();
    const ds = this.props.data[this.props.selected];
    const newId = ds.length > 0 ? ds[ds.length - 1].id + 1 : 1;
    const newItem = {...this.state.selects, name: this.state.name, id: newId};
    console.log(newItem);
    this.props.onAddCreateSubmit(newItem);
  }
  handleAddSelect(key, event) {
    const selects = {...this.state.selects};
    selects[key] = Number(event.target.value);
    this.setState({selects: selects});
  }
  handleNameChange(event) {
    this.setState({name: event.target.value});
  }
  render() {
    const selected = this.props.selected, data = this.props.data;
    const category = dataFormat[selected];
    const selects = [];

    for (let key in category) {
      const options = [];
      data[key].forEach(item => {
        options.push(
          <option value={item.id}>
            {item.name}
          </option>
        );
      });
      selects.push(
        <React.Fragment>
          <label>
            {cap(category[key])}
          </label>
          <select onChange={this.handleAddSelect.bind(this, category[key])}>
            {options}
          </select>
        </React.Fragment>
      )
    }

    return (
      <form className='create-form' onSubmit={this.handleAddCreateSubmit}>
        <label>Pavadinimas</label>
        <textarea value={this.state.name} onChange={this.handleNameChange}></textarea>
        {selects}
        <div className='control'>
          <button className='save' type='submit'>Sukurti</button>
          <button className='delete' onClick={this.handleAddCancelClick}>Atsaukti</button>
        </div>
      </form>
    );
  }
}

class DataList extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleItemDelete = this.handleItemDelete.bind(this);
  }
  handleItemDelete(id) {
    this.props.onItemDelete(id)
  }
  handleNameChange(id, value) {
    this.props.onNameChange(id, value);
  }
  render() {
    const dataItems = this.props.data.map(dataItem => {
      return (
        <DataRow
          onNameChange={this.handleNameChange}
          onItemDelete={this.handleItemDelete}
          dataItem={dataItem}
          key={dataItem.id}
        />
      );
    });

    return (
      <ul className='list-data'>
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
      value: this.props.dataItem.name,
    };
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }
  handleCancelClick() {
    this.setState({
      editable: false,
    })
  }
  handleEditClick() {
    this.setState({editable: true});
  }
  handleSaveClick(id) {
    this.setState({editable: false});
    this.props.onNameChange(id, this.state.value);
  }
  handleDeleteClick(id) {
    this.props.onItemDelete(id);
  }
  handleNameChange(event) {
    this.setState({value: event.target.value});
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.editable && this.state.editable) {
      //focus & selection
      this.textArea.focus();
      const name = this.state.value;
      this.textArea.selectionStart = name.length;
      this.textArea.selectionEnd = name.length;
      //set height
      const el = document.querySelector('.list-data .editable');
      el.style.minHeight = this.textArea.scrollHeight + 'px';
    }
  }
  render() {
    const dataItem = this.props.dataItem;

    return (
      <li>
        {this.state.editable ?
          <textarea
            className='editable'
            onChange={this.handleNameChange}
            value={this.state.value}
            ref={(textArea) => (this.textArea = textArea)}
          />:
          <span className='static'>
            {dataItem.out}
          </span>
        }
        {this.state.editable ?
          (<div className='control'>
            <button className='save' onClick={this.handleSaveClick.bind(this, dataItem.id)}>Issaugoti</button>
            <button className='delete' onClick={this.handleCancelClick}>Atsaukti</button>
          </div>) :
          (<div className='control'>
            <button className='save' onClick={this.handleEditClick}>Redaguoti</button>
            <button className='delete' onClick={this.handleDeleteClick.bind(this, dataItem.id)}>Istrinti</button>
          </div>)
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

function getName(data, category, id) {
  const array = data[category];

  for (let item of array) {
    if (item.id === id) {
      return item.name;
    }
  }
}

function cap(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
}
