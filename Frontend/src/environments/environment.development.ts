import { off } from "process";

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
  apiBase: 'https://investo.runasp.net/api',

  accountUrl: 'https://investo.runasp.net/api/Account',

  projectUrl: 'https://investo.runasp.net/api/Project',

  categoryUrl: 'https://investo.runasp.net/api/Category',

  documentUrl: 'http://localhost:3000/documents',

  offerUrl: 'https://investo.runasp.net/api/Offer',
};
