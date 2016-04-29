import React from 'react';
import ReactDOM from 'react-dom';

import createDSContainer from '../index.js';

import datascript from 'datascript'
const d = datascript;


var socialNetworkSchema = {
  "name": {
    ":db/cardinality": ":db.cardinality/one",
    ":db/unique": ":db.unique/identity"
  },
  "friend": {
    ":db/cardinality": ":db.cardinality/many",
    ":db/valueType": ":db.type/ref"
  }
};


var conn = d.create_conn(socialNetworkSchema);


var datoms = [{
      ":db/id": -1,
      "name": "John",
      "friend": -3
    },
    {
      ":db/id": -2,
      "name": "David",
      "friend": [-3, -1]
    },
    {
      ":db/id": -3,
      "name": "Jane"
    }
];

d.transact(conn, datoms, 'transacting in some friends')


const enhance = createDSContainer({
    query: `[:find (pull ?e ["name" {"_friend" 1}])
                   :in $ ?name
                   :where [?e "name" ?name]]`,
    initialParams: 'Jane'
  },
  conn
);

// const enhance = compose(
//   createDSContainer({initialParams: string, query: string}, ?),
//   withPropsOnChange(
//     ,
//     props => ({
//       ...props,
//       foo: props.result.aklsdjfkla
//     })
//   )
// )

const QueryOutput = enhance(({ result, transact, setParams }) =>
  <div>
    All friends of jane (result of a recursive pull query of the friend graph): {JSON.stringify(result)}
    <button onClick={() => (
      transact([{
        ":db/id": -12,
        "name": "Jane's new friend",
        "friend": ["name", "Jane"]
      }]))}>
      Add friend
    </button>
    <button onClick={() => setParams('David')}>
      Change param
    </button>
  </div>
)


class TestChangeComponent extends React.Component {
  state = {
    vals: ['Jane', 'David'],
    index: 0
  }
  render() {
    return (
      <div>
        <button onClick={() => this.setState({index: this.state.index === 0 ? 1 : 0})}>Next </button>
        <QueryOutput params={this.state.vals[this.state.index]} />
      </div>
    )
  }
}




ReactDOM.render(<TestChangeComponent />, document.getElementById('root'));
