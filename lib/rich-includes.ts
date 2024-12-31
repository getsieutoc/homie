export const userIncludes = {
  memberships: {
    select: {
      id: true,
      tenantId: true,
      status: true,
    },
  },
};

export const resultIncludes = {
  vendor: {
    select: {
      id: true,
      engineName: true,
      email: true,
      url: true,
    },
  },
};
