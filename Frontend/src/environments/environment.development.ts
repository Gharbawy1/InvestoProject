export const environment = {
  production: false,

  // Google OAuth client ID.
  googleClientId:
    '293381514367-2i0mvhps154ba496rqcffs3d6mo8ckkf.apps.googleusercontent.com',

  // Facebook App ID.
  appId: '1142874204295756',

  // API URL for test.
  userApiUrl: 'http://localhost:3000/users',
  //fakeapiBase: 'http://localhost:3000',

  // API URL.
  baseApi: 'https://investo.runasp.net/api',

  account: {
    accountUrl: '/Account',
    registerUser: '/Account/register-User',
    registerInvestor: '/Account/register-investor',
    registerBusinessOwner: '/Account/register-businessOwner',
    login: '/Account/Login',
    addRole: '/Account/AddRole',
    upgradeToInvestor: '/Account/upgrade-to-investor',
    upgradeToBusinessOwner: '/Account/upgrade-to-businessowner',
    uploadProfilePicture: '/Account/upload-profile-picture',
    updateProfile: '/Account/update-profile',
  },

  category: {
    getAll: '/Category',
    create: '/Category',
    getById: (id: string) => `/Category/${id}`,
    updateById: (id: string) => `/Category/${id}`,
    deleteById: (id: string) => `/Category/${id}`,
  },

  project: {
    getAll: '/Project',
    create: '/Project',
    getById: (id: string) => `/Project/${id}`,
    updateById: (id: string) => `/Project/${id}`,
    deleteById: (id: string) => `/Project/${id}`,
    getProjectsByCategory: (categoryId: number) =>
      `/Project/get-projects-by-category/${categoryId}`,
    reviewProject: (projectId: number) => `/Project/review/${projectId}`,
    updateReviewStatus: '/Project/review/status',
    getStatusByOwner: (ownerId: string) => `/Project/status/owner/${ownerId}`,
    getPendingProjects: '/Project/review/pending',
    getAcceptedProjects: '/Project/review/accepted',
    getRejectedProjects: '/Project/review/rejected',
  },
};
