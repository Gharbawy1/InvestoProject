using Google.Apis.Auth;
using Investo.Entities.DTO.oAuth;
using Investo.Entities.DTO.Token;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.DataAccess.Services.OAuth
{
    public interface IAuthGoogleService
    {
        Task<OAuthLoginResponse> AuthenticateWithGoogleAsync(GoogleLoginDto idToken);
        Task<GoogleJsonWebSignature.Payload> ValidateGoogleTokenAsync(string idToken);

    }
}
