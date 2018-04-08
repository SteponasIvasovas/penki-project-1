import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import PaginationConnected from './PaginationConnected';
import DataRow from './DataRow';
import {enableCreateUI} from '../actions';


const styles = {
  buttonStyle : {width: 200}
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
    }
  }
}

class MainBody extends React.Component {
  render() {
    const {category, ids, onAddClick} = this.props;
    const {buttonStyle} = styles;

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
        <div className="btn-add">
          <RaisedButton
            style={buttonStyle}
            primary={true}
            label="Pridėti naują"
            onClick={onAddClick}/>
        </div>
        <ul className='list-data'>
          {itemsUI}
        </ul>
        <div className='nav-pages'>
          <PaginationConnected/>
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
