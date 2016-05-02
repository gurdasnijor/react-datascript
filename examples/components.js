import React from 'react';
import { withDatascriptQuery } from '../index.js';


/**
 * A higher order component that declares a query for returning names
 * of all users in the graph
 */
const allUserQuery = withDatascriptQuery({
  query: `
    [:find ?uname
     :where [?u "name"]
            [?u "name" ?uname]]`
});

/**
 * A higher order component that declares a query using a recursive rule
 * for listing out all edges in the user graph
 */
const allUserEdgesQuery = withDatascriptQuery({
  query: `
    [:find ?u1name ?u2name
     :in $ %
     :where (follows ?u1 ?u2)
             [?u1 "name" ?u1name]
             [?u2 "name" ?u2name]]`,
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


export const AllUsers = allUserQuery(({ result, transact, setParams }) =>
  <div>
    <h3> All users (every node in the graph)</h3>
    <ul>
      {result.map(([user]) => (
        <li>{`${user}`}</li>
      ))}
    </ul>
  </div>
);

export const AllUserEdges = allUserEdgesQuery(({ result, transact, setParams }) =>
  <div>
    <h3> All follower pairs (every edge in the graph)</h3>
    <ul>
      {result.map(([u1name, u2name]) => (
        <li>{`${u1name} follows ${u2name}`}</li>
      ))}
    </ul>
    <button onClick={() => (
      transact([{
        ":db/id": -1,
        "name": `New user + ${result.length}`,
        "follows": ["name", "Jane"]
      }]))}>
      Add friend
    </button>
  </div>
);

export const FollowerTree = followerTreePullQuery(({ result }) =>
  <div>
    <h3>A tree of all followers under Jane </h3>
    <code>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </code>
  </div>
);
