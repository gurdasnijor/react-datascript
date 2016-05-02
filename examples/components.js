import React from 'react';
import { withDatascriptQuery } from '../index.js';


const enhanceDSRulesQuery = withDatascriptQuery({
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

export const QueryOutput = enhanceDSRulesQuery(({ result, transact, setParams }) =>
  <div>
  <h3> All follower pairs </h3>
  <ul>
    {result.map(res => (
      <li>{JSON.stringify(res)}</li>
    ))}
  </ul>
    <button onClick={() => (
      transact([{
        ":db/id": -1,
        "name": "New user",
        "follows": ["name", "Jane"]
      }]))}>
      Add friend
    </button>
    <button onClick={() => setParams('David')}>
      Change param
    </button>
  </div>
);

const enhancePullQuery = withDatascriptQuery({
  pull: '["name", {"_follows" ...}]'
});

export const PullQueryOutput = enhancePullQuery(({ result }) =>
  <div>
    <h3>Recursive pull query of all followers of Jane (along with all transitive followers) </h3>
    <code>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </code>
  </div>
);
