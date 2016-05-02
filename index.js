import React from 'react';
import createHelper from 'recompose/createHelper';
import shallowEqual from 'recompose/shallowEqual';
import datascript from 'datascript'


export class DBProvider extends React.Component {
  static childContextTypes = {
    conn: React.PropTypes.object
  };

  static propTypes = {
    conn: React.PropTypes.object
  };

  getChildContext() {
    return { conn: this.conn };
  }

  constructor(props, context) {
    super(props, context);
    this.conn = props.conn;
  }

  render() {
    let { children } = this.props;
    return React.Children.only(children);
  }
}


const _withDatascriptQuery = ({ query, pull, rules, initialParams }) =>
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
          params: props.params || initialParams
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
        const { result, params } = this.state;

        if (query) {
          let queryResult = [];
          const qArgs = [query, datascript.db(this.conn)];
          if (params) {
            qArgs.push(params);
          }
          if (rules) {
            qArgs.push(rules);
          }
          queryResult = datascript.q(...qArgs);
          this.setState({ result: queryResult || this.state.result });
          return;
        }

        if (pull) {
          const { entityIds } = this.props;
          let queryResult = [];

          if (!entityIds) {
            throw new Error('Cant evaluate pull expression for element without providing an entityIds prop');
          }
          const pullArgs = [datascript.db(this.conn), pull, entityIds]

          if(Array.isArray(this.props.entityIds)) {
            queryResult = d.pull_many(d.db(conn), pull, entityIds);
            this.setState({ result: queryResult || this.state.result });

            console.log(report)
          }
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

export const withDatascriptQuery = createHelper(_withDatascriptQuery, 'withDatascriptQuery');
