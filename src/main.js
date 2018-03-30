import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import Pagination from 'material-ui-pagination';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
//mine
import {dataFormat} from './data.js';
import Sidebar from './components/Sidebar.js';
import {getName, muiWrap} from './scripts/helpers.js'
import './style/style.css';

const perPage = 5;

class Main extends React.Component {
  constructor(props) {
    super(props);
    const data = this.props.data;
    const lastIds = [];
    for (let key in dataFormat) {
      const category = data[key];
      lastIds[key] = (category.length > 0) ? category[category.length - 1].id + 1 : 1;
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
    this.handleAddCreateClick = this.handleAddCreateClick.bind(this);
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
  handleAddCreateClick(item) {
    const newData = {...this.state.data};
    const categoryData = newData[this.state.selected].concat({...item, id: this.state.lastIds[this.state.selected]});
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
          onAddCreateSubmit={this.handleAddCreateClick}
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
      let out = [item.name];
      for (let key in category) {
        const id = item[category[key]];
        const name = getName(data, key, id);
        if (name) {
          out.push(name);
        }
      }

      return {...item, out: out.reverse().join(', ') + '.'};
    });

    const pages = Math.ceil(data[selected].length / perPage);


    return (
      <div className="main-body">
        {muiWrap(
          <RaisedButton
            style={{gridRow: '2 / 3'}}
            primary={true}
            label="Pridėti naują"
            onClick={this.handleAddClick}>
          </RaisedButton>
        )}
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
    const selectsIds = {};
    this.state = {
      name: '',
      selects: selectsIds,
    };
    this.handleAddCancelClick = this.handleAddCancelClick.bind(this);
    this.handleAddCreateClick = this.handleAddCreateClick.bind(this);
    this.handleAddSelect = this.handleAddSelect.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }
  handleAddCancelClick(event) {
    event.preventDefault();
    this.props.onAddCancelClick();
  }
  handleAddCreateClick(event) {
    if (this.state.name.length > 0) {
      this.props.onAddCreateSubmit({...this.state.selects, name: this.state.name});
    }
  }
  handleAddSelect(key, event, index, value) {
    this.setState({
      selects: {...this.state.selects, [key]: value}
    });
  }
  handleNameChange(event) {
    this.setState({name: event.target.value});
  }
  render() {
    const selected = this.props.selected, data = this.props.data;
    const labelStyle = {fontSize: 10}, buttonStyle = {marginRight: 5};
    const selects = generateSelects(data, selected, this.handleAddSelect, this.state.selects, this);

    return (
      muiWrap(
        <Card style={{gridColumn: '3 / 4'}}>
          <CardText>
            <TextField
              value={this.state.name}
              onChange={this.handleNameChange}
              errorText="Laukas privalomas"
              floatingLabelText="Pavadinimas"/>
            {selects}
          </CardText>
          <CardActions>
            <RaisedButton
              type='submit'
              primary={true}
              style={buttonStyle}
              label="Sukurti"
              labelStyle={labelStyle}
              onClick={this.handleAddCreateClick}/>
            <RaisedButton
              secondary={true}
              style={buttonStyle}
              label="Atšaukti"
              labelStyle={labelStyle}
              onClick={this.handleAddCancelClick}/>
          </CardActions>
        </Card>
      )
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
          key={dataItem.id}
          onDataChange={this.handleDataChange}
          onItemDelete={this.handleItemDelete}
          dataItem={dataItem}
          data={data}
          selected={selected}
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
    const selectsIds = {};

    const category = dataFormat[this.props.selected];
    for (let key in category) {
      if (this.props.dataItem[category[key]]) {
        selectsIds[category[key]] = this.props.dataItem[category[key]];
      } else {
        selectsIds[category[key]] = '';
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
    this.props.onDataChange(id, {...this.state.selects, name: this.state.name, id: id});
    this.setState({editable: false});
  }
  handleDeleteClick(id) {
    this.props.onItemDelete(id);
  }
  handleNameChange(event) {
    this.setState({name: event.target.value});
  }
  handleEditSelect(key, event, index, value) {
    const newSelects = {...this.state.selects, [key]: value};
    this.setState({
      selects: newSelects
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selected != this.props.selected) {
      const selectsIds = {};

      const category = dataFormat[this.props.selected];
      for (let key in category) {
        if (this.props.dataItem[category[key]]) {
          selectsIds[category[key]] = this.props.dataItem[category[key]];
        } else {
          selectsIds[category[key]] = '';
        }
      }

      this.setState({
        name: this.props.dataItem.name,
        editable: false,
        selects: selectsIds,
      });
    }
  }
  render() {
    const selected = this.props.selected, data = this.props.data, dataItem = this.props.dataItem, editable = this.state.editable;
    const labelStyle = {fontSize: 10}, buttonStyle = {margin: 5};

    let body;
    if (editable) {
      const selects = generateSelects(data, selected, this.handleEditSelect, this.state.selects, this);

      body = (
        muiWrap(
          <Card containerStyle={{marginBottom: 5}}>
            <CardText>
              <TextField
                value={this.state.name}
                onChange={this.handleNameChange}
                floatingLabelText="Pavadinimas"
                ref={(input) => (this.input = input)}
              />
              {selects}
            </CardText>
            <CardActions>
              <RaisedButton
                primary={true}
                style={{...buttonStyle, marginLeft: 0}}
                label="Išsaugoti"
                labelStyle={labelStyle}
                onClick={this.handleSaveClick.bind(this, dataItem.id)}/>,
              <RaisedButton
                secondary={true}
                style={buttonStyle}
                label="Atšaukti"
                labelStyle={labelStyle}
                onClick={this.handleCancelClick}/>
            </CardActions>
          </Card>
        )
      );
    } else {
      const centerAlign = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }
      body = (
        muiWrap(
          <Card containerStyle={{display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 5}}>
            <CardText style={centerAlign}>
              {dataItem.out}
            </CardText>
            <CardActions style={{textAlign: 'right'}} >
              <RaisedButton
                primary={true}
                style={buttonStyle}
                label="Redaguoti"
                labelStyle={labelStyle}
                onClick={this.handleEditClick}/>
              <RaisedButton
                secondary={true}
                style={buttonStyle}
                label="Ištrinti"
                labelStyle={labelStyle}
                onClick={this.handleDeleteClick.bind(this, dataItem.id)}/>
            </CardActions>
          </Card>
        )
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
    page--;
    if (page < 0 || page >= this.props.pages) return;
    this.props.onPageClick(page);
  }
  render() {
    const display = [];
    const pages = this.props.pages, current = this.props.current;

    if (pages > 1) {
      if (pages >= 2) {
        const className = (current === 0) ? 'disabled' : '';
        display.push(
          <li key={0}
              className={className}
              onClick={this.handleClick.bind(this, current - 1)}>
            &lt;
          </li>
        );
      }

      for (let i = 0; i < pages; i++) {
        const className = (i === current) ? 'active' : '';
        display.push(
          <li key={i + 1}
              className={className}
              onClick={this.handleClick.bind(this, i)}>
            {i + 1}
          </li>
        );
      }

      if (pages >= 2) {
        const className = (current === pages - 1) ? 'disabled' : '';
        display.push(
          <li key={pages + 1}
              className={className}
              onClick={this.handleClick.bind(this, current + 1)}>
            &gt;
          </li>
        );
      }
    }

    return (
      muiWrap(
        <Card style={{gridRow: '6/7', textAlign: 'center'}}>
          <Pagination
            total={pages}
            current={current + 1}
            display={perPage}
            onChange={this.handleClick}/>
        </Card>
      )
    );
  }
}

function generateSelects(data, selected, handler, ids, component) {
  const category = dataFormat[selected];
  const selects = [];

  for (let key in category) {
    const options = [];
    options.push(
      <MenuItem value={null} primaryText="" />
    );
    data[key].forEach(item => {
      options.push(
        <MenuItem value={item.id} primaryText={item.name}/>
      );
    });

    selects.push(
      <SelectField
        floatingLabelText={category[key]}
        value={ids[category[key]]}
        fullWidth={true}
        onChange={handler.bind(component, category[key])}>
          {options}
      </SelectField>
    );
  }

  return selects;
}

export default Main;
