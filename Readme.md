react-datascript
===



An API for declarative component-level queries over complex application state (with solid performance over any arbitrary structure: trees, large denormalized lists, sparse datasets, etc)  [Read here for details as to how that's made possible](http://tonsky.me/blog/datascript-internals/)

[datascript](https://github.com/tonsky/datascript) serves as the in-memory data store to service these queries, and supports powerful graph query/traversal capabilities (with support for recursive rules), aggregations, and covers almost all of [datomic's datalog query syntax](http://docs.datomic.com/query.html)


## Installation


```
npm install --save react-datascript
```



# Why?

There are a multitude of excellent state management solutions in the React ecosystem (Redux being one of the most popular.)  As the complexity of a single state tree grows, and access patterns become more convoluted to accommodate fast retrieval/transformation (having to hand-roll indexing strategies in a lot of cases) it becomes apparent that we're resolving many of the same problems that most database implementations have already addressed.

This project is a proof of concept built to expose the power of datascript to React developers in building more declarative interfaces that focus on the "what" over the "how".

The best solution to make maximal benefit of datascript would be to use it in native clojurescript, and [a library like om.next to integrate with it](https://github.com/omcljs/om/wiki/DataScript-Integration-Tutorial), but this library serves as a decent solution to start using it today without having to switch out languages and ecosystems just yet.


# Overview

## API

#### `<DBProvider>`

 [`<DBProvider>`](https://github.com/gurdasnijor/react-datascript/blob/master/index.js#L10) is a react-redux style provider component for passing a datascript db connection down to connected components via `context`.

Intantiate a datascript db, and pass the connection to the provider as a `conn` prop

```javascript
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

const conn = datascript.create_conn(twitterUserSchema);

/*Transact some data into the db..*/

/*...Wrap the component you want to provide access to the datascript db instance for its descendants: */

<DBProvider conn={conn}>
  <SomeComponentWithAssociatedQuery />
</DBProvider>

```

#### `withDatascriptQuery()`

[`withDatascriptQuery()`](withDatascriptQuery) is a higher order component for defining a component that has an associated datalog query (think `Relay.createContainer()`, if you're familiar with Relay's API.)

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

See the [components within the included example](https://github.com/gurdasnijor/react-datascript/blob/master/examples/components.js) to get a sense of some of the different queries that are possible.



# TODO

1)  Improve render performance by expanding query parsing logic to incorporate broader range of query structures (including pull syntax, and rules) so that a determination can be made whether to re-render or not based on the attributes of newly transacted data being present in the parsed attribute set.  Only basic query support exists today (full re-renders happen in all other cases)

2)  



##Learning Datalog
http://www.learndatalogtoday.org/

#Datascript resources
http://tonsky.me/blog/datascript-internals/
