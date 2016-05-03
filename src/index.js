import React from 'react';
import createHelper from 'recompose/createHelper';
import shallowEqual from 'recompose/shallowEqual';
import datascript from 'datascript';
import { read,write,edn,List,UUID } from 'edn-js';

const d = datascript;


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

      parseQueryAttributes = (query) => {
        const parsedQuery = read(query.trim())
        const whereKeywordIndex = parsedQuery.indexOf(Symbol.for(':where'));
        const whereClauses = parsedQuery.slice(whereKeywordIndex + 1);

        //TODO:  Get this to work with rules + not/or/or-join + expression
        //clauses...  Also figure out different parse rules for pull syntax
        return whereClauses.map(([_, attr]) => attr)
          .reduce((attrMap, attr) => Object.assign(attrMap, {[attr]: true}), {})
      }

      constructor(props, context) {
        super(props, context);
        this.conn = props.conn || context.conn;
        this.state = {
          result: [],
          params: props.params || initialParams,
          parsedQueryAttrs: query ? this.parseQueryAttributes(query) : {}
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
