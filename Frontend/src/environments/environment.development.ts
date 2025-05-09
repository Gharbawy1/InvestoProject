import { stat } from 'node:fs';

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
    getCurrentProfile: '/Account/profile',
    googleLogin: '/Account/google-login',
    getProfileByID: (id: string) => `/Account/profile/${id}`,
  },

  category: {
    getAll: '/Category',
    create: '/Category',
    getById: (id: number) => `/Category/${id}`,
    updateById: (id: number) => `/Category/${id}`,
    deleteById: (id: number) => `/Category/${id}`,
  },

  offer: {
    create: `/Offer/create-offer`,
    getOfferByOfferId: (id: number) => `/Offer/get-offer-by-id/${id}`,
    getOfferByProjectId: (id: number) => `/Offer/get-offers-byId/${id}`,
    BusinessOwnerAnswer: (id: number) => `/Offer/${id}/respond`,
    getAllForCurrentUser: `/Offer/offers/current-user`,
    getAcceptedOffers: (id: string) => `/Offer/investor/${id}/accepted_Offers`,
  },

  project: {
    getAll: '/Project',
    create: '/Project',
    getById: (id: string) => `/Project/${id}`,
    updateById: `/Project`,
    deleteById: `/Project`,
    getProjectsByCategory: (categoryId: number) =>
      `/Project/get-projects-by-category/${categoryId}`,
    reviewProject: (projectId: number) => `/Project/review/${projectId}`,
    updateReviewStatus: '/Project/review/status',
    getStatusByOwner: (ownerId: string) => `/Project/status/owner/${ownerId}`,
    getProjectsbyStatus: `/Project/GetProjectRequestsByStatus/`,
    getProjectForCurrentUser: '/Project/get-project-for-currentUser',
    getDocuments: `/Project/GetDocuments`,
  },

  notification: {
    getAll: '/Account/notifications',
    markAsRead: (id: number) => `/Account/mark-notification-as-read/${id}`,
  },

  document: {
    getAll: '/Document',
    getByUser: '/Document/get-documents-by-user',
  },

  payment: {
    createCheckoutSession: '/Stripe/create-checkout-session',
  },
};
