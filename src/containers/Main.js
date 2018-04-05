import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
//mine
import {FORMAT, FOREIGN, select, remove, update, insert, foreign} from '../scripts/data.js';
import {muiWrap} from '../scripts/helpers.js'
import Sidebar from './Sidebar.js';
import InfoCard from './InfoCard.js';
import EditForm from './EditForm.js';
import NavPages from './NavPages.js';
import '../style/style.css';

const perPage = 5;

const mapStateToProps = (state, ownProps) => ({
  category: state.selectedCategory,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCategoryClick: (category, page, perPage) => {
      dispatch(selectCategory(category));
      dispatch(fetchItems(category, page, perPage));
    },
    onAddSaveClick: (category, item) => {
      dispatch(insertAndFetch(category, item));
    }
  }
}

const MainConnected = connect(mapStateToProps, mapDispatchToProps)(Main);

class Main extends React.Component {
  state = {create: false};
  handleCategoryClick = (category) => {
    this.props.onCategoryClick(category, 0, perPage);
    this.setState({create: false});
  }
  handleAddClick = () => {
    this.setState({create: true});
  }
  handleAddCancelClick = () => {
    this.setState({create: false});
  }
  handleAddSaveClick = (item) => {
    this.props.onAddSaveClick(this.props.category, item);
    this.setState({create: false});
  }
  render() {
    const {category} = this.props;

    let body;

    if (this.state.create) {
      body = (
        <CreateForm
          onAddCancelClick={this.handleAddCancelClick}
          onAddCreateClick={this.handleAddSaveClick}
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
        <div className="sidebar">
          {muiWrap(
            <Sidebar
              categories={Object.keys(FORMAT)}
              onCategoryClick={this.handleCategoryClick}/>
            )}
        </div>
        <div className="mainbar">
          {body}
        </div>
      </React.Fragment>
    );
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
  handleAddSaveClick = (event) => {
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

    getSelectsData(selected).then(data => {
      this.setState({
        data: data,
        count: 0
      });
    });
  }
  render() {
    if (!this.state.data)
      return muiWrap(<div className="create-form"><CircularProgress /></div>);

    const styles = {
      cardContainer : {
        backgroundColor: 'rgba(232, 240, 194, 0.5)',
      },
      labelStyle : {
        fontSize: 10
      },
      buttonStyle: {
        marginRight: 5
      },
    }

    return (
      muiWrap(
        <EditForm
          name={this.state.name}
          data={this.state.data}
          styles={styles}
          selectedIds={this.state.selectedIds}
          onSelectChange={this.handleAddSelectChange}
          onNameChange={this.handleAddNameChange}
          onSaveClick={this.handleAddSaveClick}
          onCancelClick={this.handleAddCancelClick}/>
      )
    );
  }
}

class MainBody extends React.Component {
  state = {
    page: 0,
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
        count: 0,
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
      return muiWrap(<div className="main-body"><CircularProgress /></div>);

    const {selected} = this.props;
    const items = this.state.data.map(item => {
      return (
          <DataRow
            key={`${selected}-${item.id}`}
            onItemDelete={this.handleDeleteClick}
            item={item}
            selected={selected}/>
      );
    });

    return (
      <div className="main-body">
        <div className="btn-add">
          {muiWrap(
            <RaisedButton
              style={{width: 200}}
              primary={true}
              label="Pridėti naują"
              onClick={this.handleAddClick}>
            </RaisedButton>
          )}
        </div>
        <ul className='list-data'>
          {items}
        </ul>
        <div className='nav-pages'>
          {muiWrap(
            <NavPages
              onPageClick={this.handlePageClick}
              perPage={perPage}
              pages={this.state.pages}
              current={this.state.page}/>
            )}
        </div>
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

class DataRow extends React.Component {
  //data yra duomenys atrinkti pagal esamo itemo foreign kejus, data reikalinga
  //select fieldu sukurimui
  state = {
    editable: false,
    item: this.props.item,
  };
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
  handleEditNameChange = (name) => {
    this.setState({
      item: {...this.state.item, name},
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
      return muiWrap(<div style={{width: '100%', height: 50}}><CircularProgress /></div>);

    let body;
    if (this.state.editable) {
      const styles = {
        cardContainer : {
          backgroundColor: 'rgba(232, 240, 194, 0.5)'
        },
        labelStyle : {fontSize: 10},
        buttonStyle : {margin: 5},
      };
      body = (
        muiWrap(
          <EditForm
            name={this.state.item.name}
            data={this.state.data}
            styles={styles}
            selectedIds={this.state.selectedIds}
            onSelectChange={this.handleEditSelectChange}
            onNameChange={this.handleEditNameChange}
            onSaveClick={this.handleEditSaveClick}
            onCancelClick={this.handleEditCancelClick}/>
        )
      );
    } else {
      body = (
        muiWrap(
          <InfoCard
            onEditClick={this.handleEditClick}
            onDeleteClick={() => this.handleDeleteClick(this.state.item.id)}>
            {this.state.out}
          </InfoCard>
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
