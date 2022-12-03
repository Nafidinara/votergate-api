const allRoles = {
  user: [],
  admin: [
    'getUsers',
    'manageUsers',
    'getClasses',
    'manageClasses',
    'getFacilities',
    'manageFacilities',
    'getTheories',
    'manageTheories',
  ],
  mentor: ['getClasses', 'manageClasses', 'getFacilities', 'manageFacilities', 'getTheories', 'manageTheories'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
