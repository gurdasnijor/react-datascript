import React from 'react';
import createHelper from 'recompose/createHelper';
import datascript from 'datascript'


const withDatascriptQuery = (query, conn, args) =>
  BaseComponent => {
    return class extends React.Component {
      state = {
        result: []
      };

      componentWillMount() {
        this.execQuery();
        datascript.listen(conn, 'main', this.execQuery)
      }

      execQuery = (report) => {
        const result = datascript.q(query, datascript.db(conn));
        this.setState({ result });
      }

      transactData(data, txMsg) {
        datascript.transact(conn, data, txMsg);
      }

      render() {
        return (
          <BaseComponent
            result={this.state.result}
            transact={this.transactData}
          />
        );
      }
    }
  }

export default createHelper(withDatascriptQuery, 'withDatascriptQuery');
