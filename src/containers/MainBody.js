const mapStateToProps = (state, ownProps) => {
  return {
    category: state.selectedCategory,
    page: state[state.selectedCategory].page,
    pages: state[state.selectedCategory].pages,
    ids: state[state.selectedCategory].ids,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAddClick: () => {
      dispatch(enableCreateUI);
    }
    onDeleteClick: (category, id) => {
      dispatch(deleteAndFetch(category, id));
    }
    loadData : (category, page, perPage) => {
      dispatch(fetchItems(category, page, perPage));
    }
  }
}

class MainBody extends React.Component {
  handleDeleteClick = (id) => {
    this.props.onDeleteClick(this.props.category, id);
  }
  handleAddClick = () => {
    this.props.onAddClick();
  }
  componentDidMount() {
    this.props.loadData(this.props.category, page, perPage)
  }
  render() {
    const {category, items, ids} = this.props;

    if (!items)
      return muiWrap(<div className="main-body"><CircularProgress /></div>);

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
          {muiWrap(
            <RaisedButton
              style={{width: 200}}
              primary={true}
              label="Pridėti naują"
              onClick={onAddClick}>
            </RaisedButton>
          )}
        </div>
        <ul className='list-data'>
          {itemsUI}
        </ul>
        <div className='nav-pages'>
          {muiWrap(
            <NavPages
              onPageClick={this.handlePageClick}
              perPage={perPage}
              pages={pages}
              current={page}/>
            )}
        </div>
      </div>
    );
  }
}
