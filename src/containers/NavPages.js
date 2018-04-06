import React from 'react';
import Pagination from 'material-ui-pagination';
import {Card} from 'material-ui/Card';

const mapStateToProps = (state, ownProps) => {
  return {
    category: state.selectedCategory,
    page: state.items[state.selectedCategory].page,
    pages: state.items[state.selectedCategory].pages,
    perPage:: state.perPage,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onPageClick: (page) => {
      dispatch(selectPage(page));
    }
    loadData: (category, page, perPage) => {
      dispatch(fetchItems(category, page, perPage));
    }
  }
}

const cardContainer = {
  backgroundColor: 'rgba(232, 240, 194, 0.5)',
  textAlign: 'center',
}

class NavPages extends React.Component {
  handlePageClick = (page) => {
    if (this.props.page === page) return;

    this.props.onPageClick(page);
    this.props.loadData(this.props.category, page, this.props.perPage)
  }
  render() {
    const {page, pages, perPage} = this.props;

    return (
      <Card style={cardContainer}>
        <Pagination
          page={page}
          pages={pages}
          display={perPage}
          onChange={this.handlePageClick}/>
      </Card>
    );
  }
}

export default NavPages;
