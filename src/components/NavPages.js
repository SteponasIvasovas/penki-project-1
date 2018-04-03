import React from 'react';
import Pagination from 'material-ui-pagination';
import {Card} from 'material-ui/Card';

const cardContainer = {
  backgroundColor: 'rgba(232, 240, 194, 0.5)',
  textAlign: 'center',
}

class NavPages extends React.Component {
  handlePageClick = (page) => {
    page--;
    if (this.props.current !== page)
      this.props.onPageClick(page);
  }
  render() {
    return (
      <Card style={cardContainer}>
        <Pagination
          total={this.props.pages}
          current={this.props.current + 1}
          display={this.props.perPage}
          onChange={this.handlePageClick}/>
      </Card>
    );
  }
}

export default NavPages;
