import React from 'react';
import createHelper from 'recompose/createHelper';
import shallowEqual from 'recompose/shallowEqual';
import datascript from 'datascript'


const withDatascriptQuery = ({ query, initialParams }, conn) =>
  BaseComponent => {
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          result: [],
          params: props.params || initialParams
        };
      }

      componentWillMount() {
        this.execQuery();
        datascript.listen(conn, 'main', this.execQuery)
      }

      componentWillReceiveProps({ params }) {
        if (!shallowEqual(params, this.props.params)) {
          this.setParams(params);
        }
      }

      setParams = (params) => {
        this.setState({params}, this.execQuery);
      }

      execQuery = (report) => {
        console.log(report);
        const result = datascript.q(query, datascript.db(conn), this.state.params);
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
            setParams={this.setParams}
          />
        );
      }
    }
  }

export default createHelper(withDatascriptQuery, 'withDatascriptQuery');
