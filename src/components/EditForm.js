import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardText} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';

class EditForm extends React.Component {
  inputRef = React.createRef();
  handleNameChange = (event) => {
    this.props.onNameChange(event.target.value);
  }
  handleSelectChange = (key, value) => {
    this.props.onSelectChange(key, value);
  }
  handleSaveClick = () => {
    this.props.onSaveClick();
  }
  handleCancelClick = () => {
    this.props.onCancelClick();
  }
  componentDidMount() {
    this.inputRef.current.focus();
  }
  render() {
    const {data, selectedIds, name} = this.props;
    const {buttonStyle, leftButtonStyle, rightButtonStyle, labelStyle, cardContainer} = this.props.styles;

    const selects = generateSelects(data, this.handleSelectChange, selectedIds);

    return (
      <Card containerStyle={cardContainer}>
        <CardText>
          <TextField
            value={name}
            onChange={this.handleNameChange}
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
            onClick={this.handleCancelClick}/>`
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

export default EditForm;
