import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardText} from 'material-ui/Card';
import PropTypes from 'prop-types';

class AppCard extends React.Component {
  render() {
    const {children, onEditClick, onDeleteClick, styles} = this.props;
    const {cardContainer, textContainer, buttonContainer, buttonStyle, labelStyle} = styles;

    return (
      <Card containerStyle={cardContainer}>
        <CardText style={textContainer}>
          {children}
        </CardText>
        <CardActions style={buttonContainer} >
          <RaisedButton
            primary={true}
            style={buttonStyle}
            label="Redaguoti"
            labelStyle={labelStyle}
            onClick={onEditClick}/>
          <RaisedButton
            secondary={true}
            style={buttonStyle}
            label="Ištrinti"
            labelStyle={labelStyle}
            onClick={onDeleteClick}/>
        </CardActions>
      </Card>
    );
  }
}

AppCard.propTypes = {
  children: PropTypes.string.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
}

export default AppCard;
