import React from 'react';
import Pagination from 'material-ui-pagination';
import PropTypes from 'prop-types';
import {Card} from 'material-ui/Card';

class AppPagination extends React.Component {
  handlePageClick = (page) => {
    if (this.props.page === page) return;
    this.props.onPageClick(page);
  }
  render() {
    const {page, pages, perPage, styles} = this.props;
    const {cardContainer} = styles;

    return (
      <Card style={cardContainer}>
        <Pagination
          current={page}
          total={pages}
          display={perPage}
          onChange={this.handlePageClick}/>
      </Card>
    );
  }
}

AppPagination.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  onPageClick: PropTypes.func.isRequired,
}

export default AppPagination;
