import datascript from 'datascript'
const d = datascript;
window.d = d;


export default function() {
  const socialNetworkSchema = {
    "name": {
      ":db/cardinality": ":db.cardinality/one",
      ":db/unique": ":db.unique/identity"
    },
    "follows": {
      ":db/cardinality": ":db.cardinality/many",
      ":db/valueType": ":db.type/ref"
    }
  };

  const conn = d.create_conn(socialNetworkSchema);
  window.conn = conn;
  const datoms = [{
        ":db/id": -1,
        "name": "John",
        "follows": -3
      },
      {
        ":db/id": -2,
        "name": "David",
        "follows": [-3, -1]
      },
      {
        ":db/id": -3,
        "name": "Jane"
      }
  ];

  d.transact(conn, datoms, 'transacting in some twitter users')
  return conn;
}
