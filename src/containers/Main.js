import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
//mine
import {FORMAT, FOREIGN, select, remove, update, insert, foreign} from '../scripts/data.js';
import {muiWrap} from '../scripts/helpers.js'
import Sidebar from './Sidebar.js';
import InfoCard from './InfoCard.js';
import EditForm from './EditForm.js';
import NavPages from './NavPages.js';
import '../style/style.css';

const mapStateToProps = (state, ownProps) => ({
  category: state.selectedCategory,
  createUI: state.createUI,
});

class Main extends React.Component {
  render() {
    const {createUI} = this.props;

    let body;

    if (createUI) {
      body = (<CreateForm />);
    } else {
      body = (<MainBody />);
    }

    return (
      <React.Fragment>
        <div className="sidebar">
          {muiWrap(<Sidebar/>)}
        </div>
        <div className="mainbar">
          {body}
        </div>
      </React.Fragment>
    );
  }
}

const MainConnected = connect(mapStateToProps)(Main);

function generateOut(item, selected) {
  return new Promise((resolve) => {
    const cols = FORMAT[selected], fKeys = Object.keys(FOREIGN);
    let out = [], counter = 0;
    cols.forEach((col, index) => {
      if (fKeys.includes(col)) {
        const id = item[col];

        if (id) {
          select([FOREIGN[col]], (data) => {
            return data.find(dItem => dItem.id === id).name;
          }).then((name) => {
            // out[index]= `${col} : ${name}`; counter++;
            out[index] = `${name}`; counter++;
            if (counter === cols.length) {
              resolve(out);
            }
          });
        }
      } else {
        // out[index] = `${col} : ${item[col]}`; counter++;
        if (col === 'id') {
          counter++;
        } else {
          out[index] = `${item[col]}`; counter++;
        }

        if (counter === cols.length) resolve(out);
      }
    });
  });
}

export default Main;
