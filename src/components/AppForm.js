import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardText} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';

class AppForm extends React.Component {
  constructor(props) {
    super(props);
    const name = this.props.item ? this.props.item.name : '';
    const selectedIds = this.props.selectedIds ? this.props.selectedIds : {};
    this.state = {
      name,
      selectedIds,
      errorText: '',
    };
  }
  inputRef = React.createRef();
  handleNameChange = (event) => {
    this.setState({name: event.target.value});
  }
  handleSelectChange = (key, value) => {
    this.setState({
      selectedIds: {...this.state.selectedIds, [key]: value}
    });
  }
  handleSaveClick = () => {
    if (this.state.name.length > 0) {
      const id = {id : this.props.id};
      const item = {...id, ...this.state.selectedIds, name: this.state.name};
      this.props.onSaveClick(item);
    } else {
      this.setState({errorText: 'Laukelis privalomas'});
    }
  }
  componentDidMount() {
    this.inputRef.current.focus();
  }
  render() {
    const {styles, selectsData, onCancelClick} = this.props;
    const {buttonStyle, leftButtonStyle, rightButtonStyle, labelStyle, cardContainer} = styles;
    const selects = generateSelects(selectsData, this.handleSelectChange, this.state.selectedIds);

    return (
      <Card containerStyle={cardContainer}>
        <CardText>
          <TextField
            value={this.state.name}
            onChange={this.handleNameChange}
            errorText={this.state.errorText}
            floatingLabelText="Pavadinimas"
            ref={this.inputRef}/>
            {selects}
        </CardText>
        <CardActions>
          <RaisedButton
            primary={true}
            style={{...buttonStyle, leftButtonStyle}}
            label="Išsaugoti"
            labelStyle={labelStyle}
            onClick={this.handleSaveClick}/>,
          <RaisedButton
            secondary={true}
            style={{...buttonStyle, rightButtonStyle}}
            label="Atšaukti"
            labelStyle={labelStyle}
            onClick={onCancelClick}/>`
        </CardActions>
      </Card>
    );
  }
}

function generateSelects(data, handler, ids) {
  if (!data) return false;
  const selects = [];
  const keys = Object.keys(data);

  keys.forEach(key => {
    const cData = data[key];
    const options = [];

    options.push(
      <MenuItem key={0} value={null} primaryText="" />
    );

    cData.forEach(item => {
      options.push(
        <MenuItem key={item.id} value={item.id} primaryText={item.name}/>
      );
    });

    selects.push(
      <div key={key}>
        <SelectField
          floatingLabelText={key}
          value={ids[key]}
          onChange={(event, index, value) => handler(key, value)}>
          {options}
        </SelectField>
      </div>
    );
  });

  return selects;
}

AppForm.propTypes = {
  selectsData: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSaveClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
}

export default AppForm;
