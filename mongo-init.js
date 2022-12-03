db.createUser({
  user: 'mongomin',
  pwd: 'VRKSMGPEE8ahxgM4',
  roles: [
    {
      role: 'dbOwner',
      db: 'hashira-guru-bintang',
    },
  ],
});
