const mapStateToProps = (state, ownProps) => {
  return {
    category: state.selectedCategory,
    item: state.entities[state.selectedCategory][ownProps.id],
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onEditSaveClick: (category, id, item) => {
      dispatch(updateItem(category, id, item));
      dispatch(disableEditUI(category, id));
    }
    onEditCancelClick: (category, id) => {
      dispatch(disableEditUI(category, id));
    }
    onPageClick: (page) => {
      dispatch(selectPage(page));
    }
    loadData : (category, page, perPage) => {
      dispatch(fetchItems(category, page, perPage));
    }
  }
}

class DataRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIds: getSelectedIds(),
      name: this.props.item.name,
      errorText: '',
    }
  }
  handleEditSaveClick = () => {
    if (this.state.name.length > 0) {
      const item = {...this.state.selectedIds, name: this.state.name};
      this.props.onEditSaveClick(this.props.category, item);
    } else {
      this.setState({errorText: 'Laukelis privalomas'});
    }
  }
  handleEditCancelClick = () => {
    this.props.onEditCancelClick(this.props.category, this.props.id);
  }
  handleEditNameChange = (name) => {
    this.setState({name});
  }
  handleEditSelectChange = (key, value) => {
    this.setState({
      selectedIds: {...this.state.selectedIds, [key]: value},
    });
  }
  componentDidMount() {
    generateOut(this.state.item, this.props.selected).then(out => {
      this.setState({
        out: out.filter(e => e).join(', '),
        count: 0,
        editable: false,
      });
    });
  }
  render() {
    const {selectsData, onEditSaveClick, onEditCancelClick, item, id} = this.props;
    if (!this.state.out)
      return muiWrap(<div style={{width: '100%', height: 50}}><CircularProgress /></div>);

    let body;
    if (item.editUI) {
      const styles = {
        cardContainer : {backgroundColor: 'rgba(232, 240, 194, 0.5)'},
        labelStyle : {fontSize: 10},
        buttonStyle : {margin: 5},
      };

      body = (
        muiWrap(
          <EditForm
            name={this.state.name}
            data={selectsData}
            styles={styles}
            selectedIds={this.state.selectedIds}
            onNameChange={this.handleEditNameChange}
            onSelectChange={this.handleEditSelectChange}
            onSaveClick={onEditSaveClick}
            onCancelClick={onEditCancelClick}/>
        )
      );
    } else {
      body = (
        muiWrap(
          <InfoCard id={id}>
            {this.state.out}
          </InfoCard>
        )
      );
    }

    return (
      <li>
        {body}
      </li>
    );
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
