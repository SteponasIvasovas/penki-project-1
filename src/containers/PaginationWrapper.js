import {connect} from 'react-redux';
import {selectPage, fetchItems, partialFetch} from '../actions';
import AppPagination from '../components/AppPagination';

const styles = {
  cardContainer : {
    backgroundColor: 'rgba(232, 240, 194, 0.5)',
    textAlign: 'center',
  }
}

const mapStateToProps = (state, ownProps) => {
  const category = state.selectedCategory;
  const ibc = state.itemsByCategory[category];
  return {
    category: category,
    page: ibc.page,
    pages: ibc.pages,
    perPage: state.perPage,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onPageClick: (category, page) => {
      dispatch(selectPage(category, page));
    },
    loadData: (category, page, perPage) => {
      dispatch(partialFetch(category, page, perPage));
    }
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    page: stateProps.page,
    pages: stateProps.pages,
    perPage: stateProps.perPage,
    styles: styles,
    onPageClick: (page) => {
      dispatchProps.loadData(stateProps.category, page, stateProps.perPage);
      dispatchProps.onPageClick(stateProps.category, page);
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AppPagination);
