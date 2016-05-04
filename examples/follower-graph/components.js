import React from 'react';
import { withDatascriptQuery } from 'react-datascript';
import datascript from 'datascript';

/**
 * A higher order component that declares a query for returning names
 * of all users in the graph
 */
const allUserQuery = withDatascriptQuery({
  query: `
    [:find ?user
     :where [?u "name"]
            [?u "name" ?user]]`
});

/**
 * A higher order component that declares a query using a recursive rule
 * for listing out all edges in the user graph
 */
const allUserEdgesQuery = withDatascriptQuery({
  query: `
    [:find ?user1 ?user2
     :in $ %
     :where (follows ?u1 ?u2)
             [?u1 "name" ?user1]
             [?u2 "name" ?user2]]`,
  rules: `
    [[(follows ?e1 ?e2)
       [?e1 "follows" ?e2]]
      [(follows ?e1 ?e2)
       [?e1 "follows" ?t]
       (follows ?t ?e2)]]`
});

/**
 * A higher order component that declares a recursive pull query to walk all followers
 * for a given user (the output is a tree, rooted by the user)
 *
 */
const followerTreePullQuery = withDatascriptQuery({
  pull: '["name", {"_follows" ...}]'
});


/**
 * A higher order component that provides low level access to the
 * underlying connection object.
 *
 * This could be used for instance to perform lookups
 * on raw indexes (with the .datoms() api which accepts:
 *
 *  - the current db
 *
 *  - a string signifying the index type
 *
 *  - an optional final argument to narrow the items
 *    retrieved from the index to a particular value
 *
 *  (See http://docs.datomic.com/clojure/#datomic.api/datoms for more information)
 *  In most cases, this can be seen as a performance "escape hatch" when regular
 *  static datalog queries are not performant enough (which they should be in the majority of cases)
 *
 * In this example we retrieve all entities in the db that have an associated
 * `name` attribute)
 */
const allUsersFromIndex = withDatascriptQuery({
  dbConn: (conn) => (
    datascript.datoms(datascript.db(conn), ':aevt', 'name')
  )
});


const AllUsersComponent = ({ result }) => (
  <div>
    <h3> All users (every node in the graph)</h3>
    <ul>
      {result.map((user) => (
        <li>{`${JSON.stringify(user)}`}</li>
      ))}
    </ul>
  </div>
);

const AllUserEdgesComponent = ({ result }) => (
  <div>
    <h3> All follower pairs (every edge in the graph)</h3>
    <ul>
      {result.map(([user1, user2]) => (
        <li key={user1 + user2}>{`${user1} follows ${user2}`}</li>
      ))}
    </ul>
  </div>
);

const followerTreeComponent = ({ result, transact }) => (
  <div>
    <h3>A tree of all followers under Jane </h3>
      <button onClick={() => (
        transact([{
          ':db/id': -1,
          'name': `Follower of Jane ${new Date().getTime()}`,
          'follows': ['name', 'Jane']
        }]))}>
        Add follower
      </button>
    <code>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </code>
  </div>
);


export const AllUsers = allUserQuery(AllUsersComponent);
export const AllUsersFromIndex = allUsersFromIndex(AllUsersComponent);
export const AllUserEdges = allUserEdgesQuery(AllUserEdgesComponent);
export const FollowerTree = followerTreePullQuery(followerTreeComponent);
