r.dbList().contains('todos')
  .do(function(databaseExists) {
    return r.branch(
      databaseExists,
      { dbs_created: 0 },
      r.dbCreate('todos')
    );
  }).run();