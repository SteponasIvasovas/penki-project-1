import React from 'react';
import {connect} from 'react-redux';
import EditForm from './EditForm';
import EditableInfoCard from './EditableInfoCard';

const mapStateToProps = (state, ownProps) => {
  const item = state.entities[state.selectedCategory][ownProps.id]
  return {
    editUI: item.editUI,
    name: item.name
  }
};

class DataRow extends React.Component {
  render() {
    const {id, name, editUI} = this.props;
    // if (!this.state.out)
    //   return muiWrap(<div style={{width: '100%', height: 50}}><CircularProgress /></div>);

    return (
      <li>
        {editUI ? <EditForm id={id}/> : <EditableInfoCard id={id}>{name}</EditableInfoCard>}
      </li>
    );
  }
}

export default connect(mapStateToProps)(DataRow)
