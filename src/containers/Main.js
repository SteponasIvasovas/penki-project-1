import React from 'react';
import SidebarWrapper from './SidebarWrapper';
import CreateForm from './CreateForm';
import MainBody from './MainBody';
import {connect} from 'react-redux';
import {fetchItems, fetchSelectsData} from '../actions';

const mapStateToProps = (state, ownProps) => ({
  createUI: state.createUI,
  category: state.selectedCategory,
  perPage: state.perPage,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadData: (category, page, perPage) => dispatch(fetchItems(category, 1, perPage)),
  loadSelectsData: (category) => dispatch(fetchSelectsData(category)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    createUI: stateProps.createUI,
    loadAllData: () => {
      dispatchProps.loadData(stateProps.category, 1, stateProps.perPage);
      dispatchProps.loadSelectsData(stateProps.category);
    }
  }
}

class Main extends React.Component {
  componentDidMount() {
    this.props.loadAllData();
  }
  render() {
    const {createUI} = this.props;

    return (
      <React.Fragment>
        <div className="sidebar">
          <SidebarWrapper />
        </div>
        <div className="mainbar">
          {createUI ? <CreateForm /> : <MainBody />}
        </div>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Main);
