import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardText} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import {foreign} from '../scripts/data';

class AppForm extends React.Component {
  toNull = {};
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
      const id = this.props.item ? {id : this.props.item.id} : null;
      const item = {...id, ...this.state.selectedIds, ...this.toNull, name: this.state.name, location: {...this.props.location}};
      console.log(item)
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
    const {selects, toNull} = generateSelects(selectsData, this.handleSelectChange, this.state.selectedIds);
    this.toNull = toNull;

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
  const categories = Object.keys(data);
  let toNull = {};

  categories.forEach(category => {
    const cData = data[category];
    const options = [];

    options.push(
      <MenuItem key={0} value={null} primaryText="" />
    );

    const fKeys = foreign(category);
    const category_id = `${category}_id`;
    let fData = cData;

    if (fKeys.length > 0) {
      fData = cData.filter(item => {
        return fKeys.every(key => {
          return !ids[key] || item[key] === ids[key]
        });
      });

      if (fData.length === 0 ||
        fData.findIndex(item => item.id === ids[category_id]) === -1 ) {
        toNull = {...toNull, [category_id]: null};
      }
    }

    fData.forEach(item => {
      options.push(
        <MenuItem key={item.id} value={item.id} primaryText={item.name}/>
      );
    });

    selects.push(
      <div key={category}>
        <SelectField
          floatingLabelText={category}
          value={ids[category_id]}
          onChange={(event, index, value) => handler(category_id, value)}>
          {options}
        </SelectField>
      </div>
    );
  });

  return {selects, toNull};
}

AppForm.propTypes = {
  selectsData: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSaveClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
}

export default AppForm;
