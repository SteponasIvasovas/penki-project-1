import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardText} from 'material-ui/Card';

const textContainer = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};
const cardContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: 5,
  backgroundColor: 'rgba(232, 240, 194, 0.5)'
};
const labelStyle = {fontSize: 10};
const buttonStyle = {margin: 5};
const buttonContainer = {
  textAlign: 'right'
};

const mapStateToProps = (state, ownProps) => {
  return {
    category: state.selectedCategory,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onDeleteClick: (category, id) => {
      dispatch(deleteAndFetch(category, id));
    }
    onEditClick: (category, id) => {
      dispatch(enableEditUI(category, id));
    }
  }
}


class InfoCard extends React.Component {
  handleDeleteClick = () => {
    this.props.onDeleteClick(this.props.category, this.props.id);
  }
  handleEditClick = () => {
    this.props.onEditClick(this.props.category, this.props.id);
  }
  render() {
    return (
      <Card containerStyle={cardContainer}>
        <CardText style={textContainer}>
          {this.props.children}
        </CardText>
        <CardActions style={buttonContainer} >
          <RaisedButton
            primary={true}
            style={buttonStyle}
            label="Redaguoti"
            labelStyle={labelStyle}
            onClick={this.handleEditClick}/>
          <RaisedButton
            secondary={true}
            style={buttonStyle}
            label="Ištrinti"
            labelStyle={labelStyle}
            onClick={this.handleDeleteClick}/>
        </CardActions>
      </Card>
    );
  }
}

export default InfoCard;
