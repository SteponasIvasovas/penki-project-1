import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {orange500, blue500} from 'material-ui/styles/colors';
import PaginationWrapper from './PaginationWrapper';
import DataRow from './DataRow';
import {enableCreateUI, setTextAndFetch} from '../actions';


const styles = {
  buttonStyle : {width: 200, marginRight: 10, height: 48},
}

const mapStateToProps = (state, ownProps) => {
  const category = state.selectedCategory
  const ibc = state.itemsByCategory[category];

  return {
    category: category,
    ids: ibc ? ibc.ids : null,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAddClick: () => {
      dispatch(enableCreateUI);
    },
    changeFilterText: (text) => {
      dispatch(setTextAndFetch(text));
    }
  }
}

class MainBody extends React.Component {
  filterData = null;
  state = {
    filterText: ''
  }
  handleNameChange = (event) => {
    const filterText = event.target.value;
    this.setState({filterText: filterText});
    if (this.filterData) clearTimeout(this.filterData);
    this.filterData = setTimeout(() => this.props.changeFilterText(filterText), 250);
  }
  render() {
    const {category, ids, onAddClick} = this.props;
    const {buttonStyle, inputStyle, iconStyle} = styles;

    if (!ids)
      return (<div className="main-body"><CircularProgress /></div>);

    const itemsUI = ids.map(id => {
      return (
        <DataRow
          key={`${category}-${id}`}
          id={id}/>
      );
    });

    return (
      <div className="main-body">
        <div className="control-panel">
          <div className="btn-add">
            <RaisedButton
              style={buttonStyle}
              primary={true}
              label="Pridėti naują"
              onClick={onAddClick}/>
          </div>
          <div className="search-field">
            <TextField
              value={this.state.filterText}
              onChange={this.handleNameChange}
              hintText="Filter data"
              inputStyle={inputStyle}/>
          </div>
        </div>
        <ul className='list-data'>
          {itemsUI}
        </ul>
        <div className='nav-pages'>
          <PaginationWrapper/>
        </div>
      </div>
    );
  }
}

MainBody.propTypes = {
  onAddClick: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  ids: PropTypes.arrayOf(PropTypes.number)
}

export default connect(mapStateToProps, mapDispatchToProps)(MainBody)
