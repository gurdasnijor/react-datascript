react-datascript
===

*Status: Proof of concept/Spike (not production-ready)*

A library for building React components with declarative queries over complex application state (with solid performance over any arbitrary structure: trees, large denormalized lists, sparse datasets, etc)

[datascript](https://github.com/tonsky/datascript) serves as the in-memory data store to service these queries, and supports powerful graph query/traversal capabilities (with support for recursive rules), aggregations, and covers almost all of [datomic's datalog query syntax](http://docs.datomic.com/query.html)


## Installation


```
npm install --save react-datascript
```



## Why?

There is a multitude of excellent state management solutions in the React ecosystem (Redux being one of the most popular.)  However, as  the size and complexity of a single state tree grows, and access patterns become more convoluted to accommodate fast retrieval/transformation (having to hand-roll indexing strategies in a lot of cases) it becomes apparent that we're re-solving many of the same problems that [many database implementations have already addressed](http://tonsky.me/blog/datascript-internals/).

This project is a proof of concept built to expose the power of datascript to React developers in building more declarative interfaces that focus on the "what" over the "how", with UI components that co-locate their data requirements (encoded as a query) similar in spirit to Relay and om.next.

The best solution to make maximal benefit of datascript would be to use it in native clojurescript, and [a library like om.next to integrate with it](https://github.com/omcljs/om/wiki/DataScript-Integration-Tutorial), but this library serves as a decent solution to start using it today without having to switch out languages and ecosystems just yet.


## Overview

### API

#### `<DBConnProvider>`

 [`<DBConnProvider>`](https://github.com/gurdasnijor/react-datascript/blob/master/src/dbConnProvider.js) is a react-redux style provider component for passing a datascript db connection down to connected components via `context`.

Instantiate a datascript db, and pass the connection to the provider as a `conn` prop

```javascript

/*Define a datascript attribute schema*/
const twitterUserSchema = {
  "name": {
    ":db/cardinality": ":db.cardinality/one",
    ":db/unique": ":db.unique/identity"
  },
  "follows": {
    ":db/cardinality": ":db.cardinality/many",
    ":db/valueType": ":db.type/ref"
  }
};

/*Create a connection to a new db instance using the schema*/
const conn = datascript.create_conn(twitterUserSchema);

/*Transact some data into the db...*/

/*...Provide the db to all descendant components: */
<DBConnProvider conn={conn}>
  <Component />
</DBConnProvider>

```

#### `withDatascriptQuery()`

[`withDatascriptQuery()`](https://github.com/gurdasnijor/react-datascript/blob/master/src/withDatascriptQuery.js) is a higher order component for defining a component that has an associated datalog query (think `Relay.createContainer()`, if you're familiar with Relay's API.)

```javascript

/**
 * Define a higher order component that will query for all users
 */
const allUserQuery = withDatascriptQuery({
  query: `
    [:find ?user
     :where [?u "name"]]`
});


/**
 * Create a component that will always have its query results up
 * to date,
 */
const AllUsers = allUserQuery(({ result }) =>
   <div>
     <h3> All users (every node in the graph)</h3>
     <ul>
       {result.map(([user]) => (
         <li key={user}>{`${user}`}</li>
       ))}
     </ul>
   </div>
 );
```

See the [components within the included example](https://github.com/gurdasnijor/react-datascript/blob/master/examples/follower-graph/components.js) to get a sense of some of the different queries that are possible.



## TODO

1.  Improve render performance by expanding query parsing logic to incorporate broader range of query structures (including pull syntax, and rules) so that a determination can be made whether to re-render or not based on the attributes of newly transacted data being present in the parsed attribute set.  Only basic query support exists right now

2.  Query composition

3.  Better `transact` api

4.  More complex examples (undo/redo, db replication over the wire, etc...)

5.  Optimize results of a `dbConn()` result by avoiding unnecessary renders (difficult to do since we can't make as assumptions with query structure as we could with a regular static `query`)

## Resources

- [Learning Datalog](http://www.learndatalogtoday.org/)
- [How immutability, functional programming, databases and reactivity change front-end](https://www.youtube.com/watch?v=5DyQwMQbWvs) ([slides](https://dl.dropboxusercontent.com/u/561580/conferences/2015.11%20reactive.pdf))
