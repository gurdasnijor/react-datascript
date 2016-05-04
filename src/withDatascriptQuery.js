import React from 'react';
import shallowEqual from './shallowEqual';
import datascript from 'datascript';
import parseQueryAttributes from './parseQueryAttributes';


export default ({ query, pull, rules, dbConn, initialParams }) =>
  BaseComponent => {
    return class extends React.Component {
      static contextTypes = {
        conn: React.PropTypes.object
      };

      static propTypes = {
        entityIds: React.PropTypes.array,
        params: React.PropTypes.array,
        conn: React.PropTypes.object
      };

      constructor(props, context) {
        super(props, context);
        this.conn = props.conn || context.conn;
        this.state = {
          result: [],
          params: props.params || initialParams,
          parsedQueryAttrs: query ? parseQueryAttributes(query) : {}
        };
      }

      componentWillMount() {
        this.execQuery();
        datascript.listen(this.conn, this.execQuery);
      }

      componentWillUnmount() {
        datascript.unlisten(this.conn);
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
        const { result, params, parsedQueryAttrs } = this.state;

        if (report) {
          const someQueryAttrChanged = report.tx_data
            .map(({a}) => a)
            .some(a => parsedQueryAttrs[a]);

          //Did this last transaction not contain changes to any fields referenced
          //by this query?  Skip the re-query (and corresponding component update)
          if (query && !someQueryAttrChanged) {
            return;
          }
        }

        if (query) {
          const qArgs = [query, datascript.db(this.conn)];
          if (params) {
            qArgs.push(params);
          }
          if (rules) {
            qArgs.push(rules);
          }
          let queryResult = datascript.q(...qArgs);
          this.setState({ result: queryResult || this.state.result });
          return;
        }

        if (pull) {
          const { entityIds } = this.props;
          let queryResult = datascript.pull_many(datascript.db(this.conn), pull, entityIds);
          this.setState({ result: queryResult || this.state.result });
          return;
        }

        if (dbConn) {
          let queryResult = dbConn(this.conn);
          this.setState({ result: queryResult || this.state.result });
        }
      }

      transactData = (data, txMsg) => {
        datascript.transact(this.conn, data, txMsg);
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
