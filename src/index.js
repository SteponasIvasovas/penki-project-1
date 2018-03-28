import React from 'react';
import ReactDOM from 'react-dom';
import {DATA, dataFormat} from './data.js';
import './style/style.css';

const perPage = 5;


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      create: false,
      data: this.props.data,
      selected: Object.keys(this.props.data)[0],
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
    const item = categoryData[index];
    const newItem = {...item, name: value};
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
    const categories = Object.keys(this.props.data);
    let body;

    if (this.state.create) {
      const available = [];
      for (let key in this.state.data) {
        available[key] = this.state.data[key].map(item => {
          return {id: item.id, name: item.name}
        });
      }

      body = (
        <CreateForm
          selected={this.state.selected}
          data={available}
          onAddCancelClick={this.handleAddCancelClick}
          onAddCreateSubmit={this.handleAddCreateSubmit}
        />
      );
    } else {
      let filtered = this.state.data[this.state.selected].slice(this.state.page * perPage,
        this.state.page * perPage + perPage);

      const category = dataFormat[this.state.selected];
      filtered = filtered.map(d => {
        let out = d.name + ', ';
        for (let c in category) {
          const id = d[category[c].toLowerCase()];
          out += getName(this.state.data, c, id) + ', ';
        }

        return {...d, out: out.replace(/(.*),/, "$1.")};
      });

      const pages = Math.ceil(this.state.data[this.state.selected].length / perPage)

      body = (
        <MainBody
          onNameChange={this.handleNameChange}
          onPageClick={this.handlePageClick}
          onItemDelete={this.handleItemDelete}
          onAddClick={this.handleAddClick}
          data={filtered}
          page={this.state.page}
          pages={pages}
        />
      );
    }

    return (
      <React.Fragment>
        <Sidebar onSidebarItemClick={this.handleCategoryClick} categories={categories}/>
        {body}
      </React.Fragment>
    );
  }
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.handleCategoryClick = this.handleCategoryClick.bind(this);
  }
  handleCategoryClick(event) {
    this.props.onSidebarItemClick(event.target.textContent);
  }
  render() {
    const categories = this.props.categories.map(category => {
      return (
        <li key={category} onClick={this.handleCategoryClick}>
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
          pages={this.props.pages}
          current={this.props.page}
        />
      </div>
    );
  }
}

class CreateForm extends React.Component {
  constructor(props) {
    super(props);
    const selects = [];
    //isrenkam categorijos kejus pvz: kategorija: namai, kejai: Miestas, Gatve, Rajonas
    //category bus {Miestas, Gatve, Rajonas}
    const category = dataFormat[this.props.selected];
    for (let key in category) {
      // selects[Miestas.toLowerCase()] = {id: 1, name: Grazus miestas - 1}
      selects[category[key].toLowerCase()] = this.props.data[key][0] || null;
    }

    const selectsId = selects.map(s => s.id);
    const selectsNames = selects.map(s => s.name);

    this.state = {
      name: '',
      selects: selectsId,
    }

    this.handleAddCancelClick = this.handleAddCancelClick.bind(this);
    this.handleAddCreateSubmit = this.handleAddCreateSubmit.bind(this);
    this.handleAddSelect = this.handleAddSelect.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }
  handleAddCancelClick(event) {
    this.props.onAddCancelClick();
    event.preventDefault();
  }
  handleAddCreateSubmit(event) {
    event.preventDefault();
    const selected = this.props.selected;
    const data = this.props.data
    const ds = data[selected];
    const newId = ds.length > 0 ? ds[ds.length - 1].id + 1 : 1;
    const newItem = {...this.state.selects, name: this.state.name, id: newId};
    console.log(newItem);
    this.props.onAddCreateSubmit(newItem);
  }
  handleAddSelect(key, event) {
    const selects = {...this.state.selects};
    selects[key].id = Number(event.target.value);
    console.log(selects[key]);
    this.setState({selects: selects});
  }
  handleNameChange(event) {
    this.setState({name: event.target.value});
  }
  render() {
    const selected = this.props.selected;
    const selects = [];

    for (let key in dataFormat[selected]) {
      const options = [];
      this.props.data[key].forEach(item => {
        options.push(
          <option value={item.id}>
            {item.name}
          </option>
        );
      });
      selects.push(
        <React.Fragment>
          <label>
            {dataFormat[selected][key]}
          </label>
          <select onChange={this.handleAddSelect.bind(this, dataFormat[selected][key].toLowerCase())}>
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
          <button type='submit'>Sukurti</button>
          <button onClick={this.handleAddCancelClick}>Atsaukti</button>
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
          dataItem={dataItem}
          key={dataItem.id}
          onNameChange={this.handleNameChange}
          onItemDelete={this.handleItemDelete}
        />
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
      value: this.props.dataItem.name,
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
      //focus
      this.input.focus();
      const name = this.state.value;
      this.input.selectionStart = name.length;
      this.input.selectionEnd = name.length;
      //set height
      const el = document.querySelector('.list-data .editable');
      el.style.height = this.input.scrollHeight + 'px';
    }
  }
  render() {
    const dataItem = this.props.dataItem;

    return (
      <li>
        {this.state.editable ?
          <textarea
            className='editable'
            value={this.state.value}
            onChange={this.handleNameChange}
            ref={(input) => (this.input = input)}
          />:
          <span className='static'>
            {dataItem.out}
          </span>
        }
        {this.state.editable ?
          (<div className='control'>
            <button onClick={this.handleSaveClick.bind(this, dataItem.id)}>Issaugoti</button>
            <button onClick={this.handleCancelClick}>Atsaukti</button>
          </div>) :
          (<div className='control'>
            <button onClick={this.handleEditClick}>Redaguoti</button>
            <button onClick={this.handleDeleteClick.bind(this, dataItem.id)}>Istrinti</button>
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
  // console.log(data, category, id);

  for (let item of array) {
    if (item.id === id) {
      return item.name;
    }
  }
}
