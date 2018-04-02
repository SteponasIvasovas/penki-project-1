import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

function muiWrap(...components) {
  const wrapped = components.map((c, i) => {
    return (
      <MuiThemeProvider key={i}>
        {c}
      </MuiThemeProvider>
    )
  })
  return wrapped;
}

function cap(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
}

export {muiWrap, cap};
