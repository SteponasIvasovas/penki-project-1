import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';

//mine
import {DATA, dataFormat} from './data.js';
import './style/style.css';
import Sidebar from './components/Sidebar.js';

const perPage = 5;

class Main extends React.Component {
  constructor(props) {
    super(props);
    const data = this.props.data;
    const lastIds = [];
    for (let key in dataFormat) {
      const category = data[key];
      lastIds[key] = (category.length > 0) ?
        category[category.length - 1].id + 1 :
        1;
    }

    this.state = {
      create: false,
      data: this.props.data,
      selected: Object.keys(dataFormat)[0],
      lastIds: lastIds,
    };
    this.handleCategoryClick = this.handleCategoryClick.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleItemDelete = this.handleItemDelete.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleAddCancelClick = this.handleAddCancelClick.bind(this);
    this.handleAddCreateSubmit = this.handleAddCreateSubmit.bind(this);
  }
  handleCategoryClick(category) {
    this.setState({
      selected: category,
      create: false,
    });
  }
  handlePageClick(page) {
    this.setState({page: page});
  }
  handleDataChange(id, item) {
    const newData = {...this.state.data};
    const categoryData = newData[this.state.selected];
    const index = categoryData.findIndex(element => element.id === id);
    const newItem = {...categoryData[index], ...item};
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
    const newIds = this.state.lastIds.slice();
    newIds[this.state.selected]++;
    this.setState({
      create: false,
      data: newData,
      lastIds: newIds,
    });
  }
  render() {
    const categories = Object.keys(dataFormat);
    const selected = this.state.selected, data = this.state.data;
    let body;

    if (this.state.create) {
      body = (
        <CreateForm
          onAddCancelClick={this.handleAddCancelClick}
          onAddCreateSubmit={this.handleAddCreateSubmit}
          data={data} // all available ids paired with names
          selected={selected} // selected category
        />
      );
    } else {
      body = (
        <MainBody
          onDataChange={this.handleDataChange}
          onPageClick={this.handlePageClick}
          onItemDelete={this.handleItemDelete}
          onAddClick={this.handleAddClick}
          data={data}
          selected={selected}
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
    this.state = {page: 0};
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleItemDelete = this.handleItemDelete.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
  }
  handleItemDelete(id) {
    this.props.onItemDelete(id);
  }
  handlePageClick(page) {
    this.setState({page: page});
  }
  handleDataChange(id, item) {
    this.props.onDataChange(id, item);
  }
  handleAddClick() {
    this.props.onAddClick();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selected !== this.props.selected) {
      this.setState({page: 0});
    }
  }
  render() {
    const selected = this.props.selected, data = this.props.data, page = this.state.page;
    let filtered = data[selected].slice(page * perPage, page * perPage + perPage);

    const category = dataFormat[selected];
    filtered = filtered.map(item => {
      // let out = item.name + ', ';
      let out2 = [item.name];
      for (let key in category) {
        const id = item[category[key]];
        const name = getName(data, key, id);
        if (name) {
          // out += name + ', ';
          out2.push(name);
        }
      }

      // return {...item, out: out.replace(/(.*),/, "$1.")};
      return {...item, out: out2.reverse().join(', ') + '.'};
    });

    const pages = Math.ceil(data[selected].length / perPage);
    const style = {
      height: '100%'
    }

    return (
      <div className="main-body">
        {/* <button onClick={this.handleAddClick} className="btn-add">Prideti nauja</button> */}
        <div className="btn-add">
          {muiWrap(<RaisedButton primary={true} style={style} label="Prideti nauja" onClick={this.handleAddClick}></RaisedButton>)}
        </div>
        <DataList
          onItemDelete={this.handleItemDelete}
          onDataChange={this.handleDataChange}
          fData={filtered}
          data={data}
          selected={selected}
        />
        <NavPages
          onPageClick={this.handlePageClick}
          pages={pages}
          current={page}
        />
      </div>
    );
  }
}

class CreateForm extends React.Component {
  constructor(props) {
    super(props);
    const selectsIds = [];
    this.state = {
      name: '',
      selects: selectsIds,
    };
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
    const selects = generateSelects(data, selected, this.handleAddSelect, this.state.selects);

    return (
      <form className='create-form' onSubmit={this.handleAddCreateSubmit}>
        {/* <label>Pavadinimas</label> */}
        {/* <input value={this.state.name} onChange={this.handleNameChange}/> */}
        {muiWrap(
          <TextField
            value={this.state.name}
            onChange={this.handleNameChange}
            floatingLabelText="Pavadinimas"
          />
        )}
        {muiWrap(selects)}
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
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleItemDelete = this.handleItemDelete.bind(this);
  }
  handleItemDelete(id) {
    this.props.onItemDelete(id)
  }
  handleDataChange(id, item) {
    this.props.onDataChange(id, item);
  }
  render() {
    const selected = this.props.selected, data = this.props.data;
    const dataItems = this.props.fData.map(dataItem => {
      return (
        <DataRow
          onDataChange={this.handleDataChange}
          onItemDelete={this.handleItemDelete}
          dataItem={dataItem}
          data={data}
          selected={selected}
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
    const selectsIds = [];

    const category = dataFormat[this.props.selected];
    for (let key in category) {
      if (this.props.data[key][0]) {
        selectsIds[category[key]] = this.props.dataItem[category[key]];
      }
    }

    this.state = {
      editable: false,
      name: this.props.dataItem.name,
      selects: selectsIds,
    };
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditSelect = this.handleEditSelect.bind(this);
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
    const newItem = {...this.state.selects, name: this.state.name, id: id};
    this.props.onDataChange(id, newItem);
  }
  handleDeleteClick(id) {
    this.props.onItemDelete(id);
  }
  handleNameChange(event) {
    this.setState({name: event.target.value});
  }
  handleEditSelect(key, event) {
    const selects = {...this.state.selects};
    selects[key] = Number(event.target.value);
    this.setState({selects: selects});
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.editable && this.state.editable) {
      //focus & selection
      this.textArea.focus();
      const name = this.state.name;
      this.textArea.selectionStart = name.length;
      this.textArea.selectionEnd = name.length;
      //set height
      const el = document.querySelector('.list-data .editable');
      el.style.minHeight = this.textArea.scrollHeight + 'px';
    }
  }
  render() {
    const selected = this.props.selected, data = this.props.data, dataItem = this.props.dataItem, editable = this.state.editable;
    const labelStyle = {
      fontSize: 10,
    };
    const style = {
      marginRight: 5,
      marginLeft: 5,
    };

    let body;
    if (editable) {
      const selects = generateSelects(data, selected, this.handleEditSelect, this.state.selects);

      body = (
        <React.Fragment>
          <div className='update-form editable'>
            <div className='selects'>
              <label> Pavadinimas </label>
              <input
                type='text'
                // className='editable'
                onChange={this.handleNameChange}
                value={this.state.name}
                ref={(textArea) => (this.textArea = textArea)}
              />
            </div>
            {selects}
          </div>
          <div className='control'>
            {muiWrap(
              <RaisedButton
                primary={true}
                style={style}
                label="Issaugoti"
                labelStyle={labelStyle}
                onClick={this.handleSaveClick.bind(this, dataItem.id)}/>,
              <RaisedButton
                secondary={true}
                style={style}
                label="Atsaukti"
                labelStyle={labelStyle}
                onClick={this.handleCancelClick}/>
            )}
            {/* <button className='save' onClick={this.handleSaveClick.bind(this, dataItem.id)}>Issaugoti</button>
            <button className='delete' onClick={this.handleCancelClick}>Atsaukti</button> */}
          </div>
        </React.Fragment>
      );
    } else {


      body = (
        <React.Fragment>
          <div className='static'>
            <span>
              {dataItem.out}
            </span>
          </div>
          <div className='control'>
            {muiWrap(
              <RaisedButton
                primary={true}
                style={style}
                label="Redaguoti"
                labelStyle={labelStyle}
                onClick={this.handleEditClick}/>,
              <RaisedButton
                secondary={true}
                style={style}
                label="Istrinti"
                labelStyle={labelStyle}
                onClick={this.handleEditClick}/>
            )}
            {/* <button className='save' onClick={this.handleEditClick}>Redaguoti</button>
            <button className='delete' onClick={this.handleDeleteClick.bind(this, dataItem.id)}>Istrinti</button> */}
          </div>
        </React.Fragment>
      );
    }

    return (
      <li>
        {body}
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

function generateSelects(data, selected, handler, ids = false) {
  const category = dataFormat[selected];
  const selects = [];

  for (let key in category) {
    const options = [];
    options.push(
      // <option value={null}>
      //   -----------
      // </option>
      <MenuItem floatingLabelText="-------" value={null}/>
    );
    data[key].forEach(item => {
      options.push(
        // <option value={item.id}>
        //   {item.name}
        // </option>
        <MenuItem value={item.id} primaryText={item.name} />
      );
    });

    selects.push(
      <div className='selects'>
        {/* <label>
          {cap(category[key])}
        </label>
        <select value={ids[category[key]]} onChange={handler.bind(this, category[key])}>
          {options}
        </select> */}
        <SelectField
          floatingLabelText={category[key]}
          value={ids[category[key]]}
          onChange={handler.bind(this, category[key])}
        >
          {options}
        </SelectField>
      </div>
    )
  }

  return selects;
}

function muiWrap(...components) {
  return (
    <MuiThemeProvider>
      {components}
    </MuiThemeProvider>
  );
}
