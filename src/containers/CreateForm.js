class CreateForm extends React.Component {
  state = {
    name: '',
    selectedIds: {},
    errorText: '',
  };
  handleAddSaveClick = () => {
    if (this.state.name.length > 0) {
      const item = {...this.state.selectedIds, name: this.state.name};
      this.props.onAddSaveClick(this.props.category, item);
    } else {
      this.setState({errorText: 'Laukelis privalomas'});
    }
  }
  handleAddSelectChange = (key, value) => {
    this.setState({
      selectedIds: {...this.state.selectedIds, [key]: value}
    });
  }
  handleAddNameChange = (event) => {
    this.setState({name: event.target.value});
  }
  componentDidMount() {
    this.props.onFormMount(this.props.category);
  }
  render() {
    const {category, selectsData, onAddSaveClick, onAddCancelClick} = this.props;

    if (!selectsData)
      return muiWrap(<div className="create-form"><CircularProgress /></div>);

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

    return (
      muiWrap(
        <EditForm
          styles={styles}
          name={this.state.name}
          selectedIds={this.state.selectedIds}
          data={this.props.selectsData}
          onSelectChange={this.handleAddSelectChange}
          onNameChange={this.handleAddNameChange}
          onSaveClick={this.handleAddSaveClick}
          onCancelClick={onAddCancelClick}/>
      )
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  category: state.selectedCategory,
  selectsData: state[state.selectedCategory].selectsData,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAddSaveClick: (category, item) => {
      dispatch(insertAndFetch(category, item));
      dispatch(disableCreateUI);
    },
    onAddCancelClick: () => {
      dispatch(disableCreateUI);
    },
    onFormMount: (category) => {
      dispatch(fetchSelectsData(category));
    }
  }
}

const CreateFormConnected = connect(mapStateToProps, mapDispatchToProps)(CreateForm);
export CreateFormConnected;
