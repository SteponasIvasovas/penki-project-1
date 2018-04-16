import {selectCategory, fetchSelectsDataIfNeeded, disableCreateUI, partialFetch} from '../actions';
import {connect} from 'react-redux';
import {SCHEMA} from '../scripts/data';
import AppSidebar from '../components/AppSidebar';

const styles = {
  containerStyle : {
    // display: 'subgrid',
    // gridTemplateRows: '0fr auto'
  },
  paperStyle : {
    backgroundColor: 'rgba(232, 240, 194, 0.5)',
    // gridRow: '1/2',
  },
  menuItemStyle : {
    width: 112,
    textAlign: 'center'
  },
}
const mapStateToProps = (state, ownProps) => {
  return {
    category: state.selectedCategory,
    perPage: state.perPage,
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCategoryClick: (category, page, perPage) => {
      dispatch(selectCategory(category));
      dispatch(partialFetch(category, page, perPage));
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
    categories: Object.keys(SCHEMA),
    styles: styles,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AppSidebar);
