import {connect} from 'react-redux';
import {enableEditUI, deleteAndFetch, requireSelectsDataForAll} from '../actions';
import AppCard from '../components/AppCard';

const styles = {
  cardContainer : {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
    backgroundColor: 'rgba(232, 240, 194, 0.5)'
  },
  textContainer : {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  labelStyle : {fontSize: 10},
  buttonStyle : {margin: 5},
  buttonContainer : {
    textAlign: 'right'
  },
}

const mapStateToProps = (state, ownProps) => {
  return {
    category: state.selectedCategory,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onDeleteClick: (category, id) => {
      dispatch(deleteAndFetch(category, id));
    },
    onEditClick: (category, id) => {
      dispatch(enableEditUI(category, id));
    },
    setSelectsDataRequire: (category) => {
      dispatch(requireSelectsDataForAll(category));
    }
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    onEditClick: () => dispatchProps.onEditClick(stateProps.category, ownProps.id),
    onDeleteClick: () => {
      dispatchProps.onDeleteClick(stateProps.category, ownProps.id)
      dispatchProps.setSelectsDataRequire(stateProps.category);
    },
    children: ownProps.children,
    styles: styles,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AppCard);
