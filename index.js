import React from 'react';
import createHelper from 'recompose/createHelper';
import datascript from 'datascript'


const withDatascriptQuery = (query, conn, args) =>
  BaseComponent => {
    return class extends React.Component {

      render() {
        const result = datascript.q(query, conn);
        return (
          <BaseComponent result={result}  />
        );
      }
    }
  }

export default createHelper(withDatascriptQuery, 'withDatascriptQuery');
