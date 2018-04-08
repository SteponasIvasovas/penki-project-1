import {connect} from 'react-redux';
import {insertAndFetch, disableCreateUI, requireSelectsDataForAll} from '../actions';
import AppForm from '../components/AppForm';

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

const mapStateToProps = (state, ownProps) => {
  const category = state.selectedCategory;
  const ibc = state.itemsByCategory[category];
  return {
    category: category,
    selectsData: ibc.selectsData,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSaveClick: (category, item) => {
      dispatch(insertAndFetch(category, item));
      dispatch(disableCreateUI);
    },
    onCancelClick: () => {
      dispatch(disableCreateUI);
    },
    setSelectsDataRequire: (category) => {
      dispatch(requireSelectsDataForAll(category));
    }
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {category, selectsData} = stateProps;
  return {
    selectsData: selectsData,
    styles: styles,
    onSaveClick: (item) => {
      dispatchProps.onSaveClick(category, item);
      dispatchProps.onCancelClick();
      dispatchProps.setSelectsDataRequire(category);
    },
    onCancelClick: dispatchProps.onCancelClick,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AppForm);
