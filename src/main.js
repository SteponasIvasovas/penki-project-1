import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import Pagination from 'material-ui-pagination';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
//mine
import {FORMAT, FOREIGN, select, remove, update, insert, foreign} from './data.js';
import {muiWrap} from './scripts/helpers.js'
import Sidebar from './components/Sidebar.js';
import './style/style.css';

const perPage = 5;

class Main extends React.Component {
  state = {
    create: false,
    selected: Object.keys(FORMAT)[0],
    count: 0,
  };
  handleCategoryClick = (category) => {
    this.setState({
      selected: category,
      create: false,
      count: (this.state.count + 1) % 2,
    });
  }
  handleAddClick = () => {
    this.setState({
      create: true,
      count: (this.state.count + 1) % 2,
    });
  }
  handleAddCancelClick = () => {
    this.setState({
      create: false,
      count: (this.state.count + 1) % 2,
    });
  }
  handleAddCreateClick = (item) => {
    insert(this.state.selected, item).then(() => {
      this.setState({
        create: false,
        count: (this.state.count + 1) % 2,
      });
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.count !== nextState.count;
  }
  render() {
    const selected = this.state.selected;
    let body;

    if (this.state.create) {
      body = (
        <CreateForm
          onAddCancelClick={this.handleAddCancelClick}
          onAddCreateClick={this.handleAddCreateClick}
          selected={selected}/>
      );
    } else {
      body = (
        <MainBody
          onAddClick={this.handleAddClick}
          selected={selected}/>
      );
    }

    return (
      <React.Fragment>
        <Sidebar
          onCategoryClick={this.handleCategoryClick}/>
        {body}
      </React.Fragment>
    );
  }
}

let i = 0;
class MainBody extends React.Component {
  state = {
    page: 0,
    count: -1,
  };
  handleDeleteClick = (id) => {
    remove(this.props.selected, id).then(() => {
      this.setState({
        count: (this.state.count + 1) % 2,
        data: null,
      });
    });
  }
  handleAddClick = () => {
    this.props.onAddClick();
  }
  handlePageClick = (page) => {
    select([this.props.selected]).then(data => {
      const filtered = data.slice(page * perPage, page * perPage + perPage);
      const pages = Math.ceil(data.length / perPage);

      this.setState({
        data: filtered,
        pages: pages,
        page: page,
        count: (this.state.count + 1) % 2,
      });
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.count !== this.state.count;
  }
  componentDidMount() {
    const selected = this.props.selected, page = this.state.page;

    select([selected]).then(data => {
      const filtered = data.slice(page * perPage, page * perPage + perPage);
      const pages = Math.ceil(data.length / perPage);
      this.setState({
        data: filtered,
        pages: pages,
        count: (this.state.count + 1) % 2,
      });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (!this.state.data) {
      let page = 0;

      select([this.props.selected]).then(data => {
        const filtered = data.slice(page * perPage, page * perPage + perPage);
        const pages = Math.ceil(data.length / perPage);
        if (page + 1 >= pages) page = Math.max(0, page - 1);

        this.setState({
          data: filtered,
          pages: pages,
          page: page,
          count: (this.state.count + 1) % 2,
        });
      });
    }
  }
  render() {
    if (!this.state.data)
    return (<div className="main-body">Loading...</div>);
    const selected = this.props.selected, page = this.state.page;

    return (
      <div className="main-body">
        {muiWrap(
          <RaisedButton
            style={{gridRow: '2 / 3', width: 200}}
            primary={true}
            label="Pridėti naują"
            onClick={this.handleAddClick}>
          </RaisedButton>
        )}
        <DataList
          onItemDelete={this.handleDeleteClick}
          data={this.state.data}
          selected={selected}/>
        <NavPages
          onPageClick={this.handlePageClick}
          pages={this.state.pages}
          current={page}/>
      </div>
    );
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selected !== prevState.prevSelected) {
      return {
        count: (prevState.count + 1) % 2,
        data: null,
        prevSelected: nextProps.selected,
      }
    }

    return null;
  }
}

class CreateForm extends React.Component {
  state = {
    name: '',
    selectedIds: {},
    errorText: '',
  };
  inputRef = React.createRef();
  handleAddCancelClick = (event) => {
    this.props.onAddCancelClick();
  }
  handleAddCreateClick = (event) => {
    if (this.state.name.length > 0) {
      this.props.onAddCreateClick({...this.state.selectedIds, name: this.state.name});
    } else {
      this.setState({
        errorText: 'Laukelis privalomas',
        count: (this.state.count + 1) % 2,
      })
    }
  }
  handleAddSelectChange = (key, value) => {
    this.setState({
      selectedIds: {...this.state.selectedIds, [key]: value},
      count: (this.state.count + 1) % 2,
    });
  }
  handleAddNameChange = (event) => {
    this.setState({
      name: event.target.value,
      count: (this.state.count + 1) % 2,
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.count !== nextState.count;
  }
  componentDidMount() {
    const selected = this.props.selected;
    this.inputRef.current.focus();

    getSelectsData(selected).then(data => {
      this.setState({
        data: data,
        count: 0
      });
    });
  }
  render() {
    let selects = null;
    if (this.state.data) {
      selects = generateSelects(this.state.data, this.handleAddSelectChange,
        this.state.selectedIds)
    }

    const labelStyle = {fontSize: 10}, buttonStyle = {marginRight: 5};

    const cardContainer = {
      backgroundColor: 'rgba(232, 240, 194, 0.5)',
      gridColumn: '3 / 4',
    };

    return (
      muiWrap(
        <Card style={cardContainer}>
          <CardText>
            <TextField
              value={this.state.name}
              onChange={this.handleAddNameChange}
              errorText={this.state.errorText}
              ref={this.inputRef}
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
  handleDeleteClick = (id) => {
    this.props.onItemDelete(id)
  }
  render() {
    const selected = this.props.selected;
    const items = this.props.data.map(item => {
      return (
        <DataRow
          key={`${selected}-${item.id}`}
          onItemDelete={this.handleDeleteClick}
          item={item}
          selected={selected}/>
      );
    });

    return (
      <ul className='list-data'>
        {items}
      </ul>
    );
  }
}
/*
Atsinaujina :
1. paspaudus edit -> handleEditClick -> shouldComponentUpdate -> componentDidUpdate
*/
class DataRow extends React.Component {
  //data yra duomenys atrinkti pagal esamo itemo foreign kejus, data reikalinga
  //select fieldu sukurimui
  state = {
    editable: false,
    item: this.props.item,
  };
  inputRef = React.createRef();
  handleDeleteClick = (id) => {
    this.props.onItemDelete(id);
  }
  handleEditClick = () => {
    const item = this.state.item, selected = this.props.selected;

    getSelectsData(selected).then(data => {
      const selectedIds = getSelectedIds(item, selected);

      this.setState({
        data: data,
        selectedIds: selectedIds,
        editable: true,
        count: (this.state.count + 1) % 2
      });
    });
  }
  handleEditSaveClick = () => {
    const item = this.state.item;
    const newItem = {...item, ...this.state.selectedIds};

    update(this.props.selected, newItem.id, newItem).then(() => {
      return generateOut(newItem, this.props.selected);
    }).then(out => {
      this.setState({
        out: out.filter(e => e).join(', '),
        data: null,
        selectedIds: null,
        item: newItem,
        count: (this.state.count + 1) % 2,
        editable: false,
      });
    });
  }
  handleEditCancelClick = () => {
    this.setState({
      data: null,
      selectedIds: null,
      editable: false,
      count: (this.state.count + 1) % 2
    });
  }
  handleEditNameChange = (event) => {
    this.setState({
      item: {...this.state.item, name: event.target.value},
      count: (this.state.count + 1) % 2,
    });
  }
  handleEditSelectChange = (key, value) => {
    this.setState({
      selectedIds: {...this.state.selectedIds, [key]: value},
      count: (this.state.count + 1) % 2,
    });
  }
  componentDidMount() {
    generateOut(this.state.item, this.props.selected).then(out => {
      this.setState({
        out: out.filter(e => e).join(', '),
        count: 0,
        editable: false,
      });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.editable) this.inputRef.current.focus();
    if (!this.state.out) {
      generateOut(this.state.item, this.props.selected).then(out => {
        let editable = prevState.editable;
        if (prevProps.selected !== this.props.selected) editable = false;
        this.setState({
          out: out.filter(e => e).join(', '),
          count: (prevState.count + 1) % 2,
          editable: editable,
        });
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.count !== this.state.count;
  }
  render() {
    if (!this.state.out)
      return <div style={{width: '100%', height: 50}}>Loading...</div>;

    const editable = this.state.editable;
    const labelStyle = {fontSize: 10}, buttonStyle = {margin: 5};
    let body;
    if (editable) {
      const selects = generateSelects(this.state.data, this.handleEditSelectChange,
        this.state.selectedIds);
      const cardContainer = {
        marginBottom: 5,
        backgroundColor: 'rgba(232, 240, 194, 0.5)'
      };
      body = (
        muiWrap(
          <Card containerStyle={cardContainer}>
            <CardText>
              <TextField
                value={this.state.item.name}
                onChange={this.handleEditNameChange}
                floatingLabelText="Pavadinimas"
                ref={this.inputRef}/>
              {selects}
            </CardText>
            <CardActions>
              <RaisedButton
                primary={true}
                style={{...buttonStyle, marginLeft: 0}}
                label="Išsaugoti"
                labelStyle={labelStyle}
                onClick={this.handleEditSaveClick}/>,
              <RaisedButton
                secondary={true}
                style={buttonStyle}
                label="Atšaukti"
                labelStyle={labelStyle}
                onClick={this.handleEditCancelClick}/>
            </CardActions>
          </Card>
        )
      );
    } else {
      const centerAlign = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      };
      const cardContainer = {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 5,
        backgroundColor: 'rgba(232, 240, 194, 0.5)'
      };
      body = (
        muiWrap(
          <Card containerStyle={cardContainer}>
            <CardText style={centerAlign}>
              {this.state.out}
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
                onClick={() => this.handleDeleteClick(this.state.item.id)}/>
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
  handlePageClick = (page) => {
    page--;
    if (this.props.current !== page)
      this.props.onPageClick(page);
  }
  render() {
    const cardContainer = {
      backgroundColor: 'rgba(232, 240, 194, 0.5)',
      gridRow: '6/7',
      textAlign: 'center',
    }
    return (
      muiWrap(
        <Card style={cardContainer}>
          <Pagination
            total={this.props.pages}
            current={this.props.current + 1}
            display={perPage}
            onChange={this.handlePageClick}/>
        </Card>
      )
    );
  }
}

function getSelectedIds(item, selected) {
  const selectedIds = {};

  const fKeys = foreign(selected);
  fKeys.forEach(key => {
    if (item[key]) selectedIds[key] = item[key];
    else selectedIds[key] = '';
  });

  return selectedIds;
}

function getSelectsData(selected) {
  const fKeys = foreign(selected);
  const promises = [];

  fKeys.forEach(key => {
    const category = FOREIGN[key];

    promises.push(select([category], data =>
      data.map(item => {
        return {
          id: item.id,
          name: item.name,
        };
      })).then(data => {
        return {[key] : data};
    }));
  });

  if (promises.length === 0) return Promise.resolve(null);

  return Promise.all(promises).then(data => {
    return data.reduce((a, b) => {
      return {...a, ...b};
    });
  });
}

function generateSelects(data, handler, ids) {
  if (!data) return false;
  const selects = [];
  const keys = Object.keys(data);

  keys.forEach(key => {
    const cData = data[key];
    const options = [];

    options.push(
      <MenuItem key={0} value={null} primaryText="" />
    );

    cData.forEach(item => {
      options.push(
        <MenuItem key={item.id} value={item.id} primaryText={item.name}/>
      );
    });

    selects.push(
      <div key={key}>
        <SelectField
          floatingLabelText={key}
          value={ids[key]}
          // style={}
          // fullWidth={true}
          onChange={(event, index, value) => handler(key, value)}>
          {options}
        </SelectField>
      </div>
    );
  });

  return selects;
}

function generateOut(item, selected) {
  return new Promise((resolve) => {
    const cols = FORMAT[selected], fKeys = Object.keys(FOREIGN);
    let out = [], counter = 0;
    cols.forEach((col, index) => {
      if (fKeys.includes(col)) {
        const id = item[col];

        if (id) {
          select([FOREIGN[col]], (data) => {
            return data.find(dItem => dItem.id === id).name;
          }).then((name) => {
            // out[index]= `${col} : ${name}`; counter++;
            out[index] = `${name}`; counter++;
            if (counter === cols.length) {
              resolve(out);
            }
          });
        }
      } else {
        // out[index] = `${col} : ${item[col]}`; counter++;
        if (col === 'id') {
          counter++;
        } else {
          out[index] = `${item[col]}`; counter++;
        }

        if (counter === cols.length) resolve(out);
      }
    });
  });
}

export default Main;
