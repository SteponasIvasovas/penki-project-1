import {selectCategory, fetchItems, fetchSelectsDataIfNeeded, disableCreateUI} from '../actions';
import {connect} from 'react-redux';
import {FORMAT} from '../scripts/data';
import AppSidebar from '../components/AppSidebar';

const styles = {
  containerStyle : {
    display: 'grid',
    gridTemplateRows: '0fr auto'
  },
  paperStyle : {
    backgroundColor: 'rgba(232, 240, 194, 0.5)',
    gridRow: '1/2',
  },
  menuItemStyle : {
    textAlign: 'center'
  },
}
const mapStateToProps = (state, ownProps) => {
  const ibc = state.itemsByCategory[state.selectedCategory];
  return {
    category: state.selectedCategory,
    //page: ibc ? ibc.page : 1,
    perPage: state.perPage,
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCategoryClick: (category, page, perPage) => {
      dispatch(selectCategory(category));
      dispatch(fetchItems(category, page, perPage));
      dispatch(fetchSelectsDataIfNeeded(category));
      dispatch(disableCreateUI);
    }
  }
}
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    onCategoryClick: (category) => {
      if (stateProps.category === category) return;
      dispatchProps.onCategoryClick(category, 1, stateProps.perPage);
    },
    categories: Object.keys(FORMAT),
    styles: styles,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AppSidebar);
