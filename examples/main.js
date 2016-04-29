import React from 'react';
import ReactDOM from 'react-dom';

import createDSContainer from '../index.js';

import datascript from 'datascript'
const d = datascript;


var socialNetworkSchema = {
  "name": {":db/cardinality": ":db.cardinality/one"},
  "friend": {
    ":db/cardinality": ":db.cardinality/one",
    ":db/valueType": ":db.type/ref"
  }
};


var conn = d.create_conn(socialNetworkSchema);
var reports = []

d.listen(conn, 'main', report => {
    reports.push(report)
})

var datoms = [{
      ":db/id": -1,
      "name": "John",
      "friend": -3
    },
    {
      ":db/id": -2,
      "name": "David",
      "friend": -3
    },
    {
      ":db/id": -3,
      "name": "Jane"
    }
];

d.transact(conn, datoms, 'transacting in some friends')


const enhance = createDSContainer(`
  [:find (pull ?e ["name" {"_friend" 1}])
   :in $
   :where [?e "name" "Jane"]]`,
  d.db(conn)
);

const QueryOutput = enhance((props) =>
  <div>
    All friends of jane (result of a recursive pull query of the friend graph): {JSON.stringify(props)}
  </div>
)



ReactDOM.render(<QueryOutput/>, document.getElementById('root'));
