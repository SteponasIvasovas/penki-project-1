import {connect} from 'react-redux';
import {updateItem, disableEditUI, requireSelectsDataForAll} from '../actions';
import AppForm from '../components/AppForm';
import {foreign} from '../scripts/data';

const styles = {
  cardContainer : {backgroundColor: 'rgba(232, 240, 194, 0.5)'},
  labelStyle : {fontSize: 10},
  buttonStyle : {margin: 5},
};

const mapStateToProps = (state, ownProps) => {
  const category = state.selectedCategory;
  const ibc = state.itemsByCategory[category];

  return {
    category: category,
    selectsData: ibc.selectsData,
    item: state.entities[category][ownProps.id],
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSaveClick: (category, id, item) => {
      dispatch(updateItem(category, id, item));
      dispatch(disableEditUI(category, id));
    },
    onCancelClick: (category, id) => {
      dispatch(disableEditUI(category, id));
    },
    setSelectsDataRequire: (category) => {
      dispatch(requireSelectsDataForAll(category));
    }
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {category, selectsData} = stateProps;
  return {
    styles: styles,
    selectsData: selectsData,
    item: stateProps.item,
    selectedIds: getSelectedIds(stateProps.item, category),
    onSaveClick: (item) => {
      dispatchProps.onSaveClick(category, ownProps.id, item);
      dispatchProps.setSelectsDataRequire(category);
    },
    onCancelClick: () => dispatchProps.onCancelClick(category, ownProps.id),
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AppForm);
