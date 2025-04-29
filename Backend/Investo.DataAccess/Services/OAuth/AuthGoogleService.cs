using Google.Apis.Auth;
using Investo.DataAccess.Services.Image_Loading;
using Investo.DataAccess.Services.Token;
using Investo.Entities.DTO.oAuth;
using Investo.Entities.DTO.Token;
using Investo.Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.DataAccess.Services.OAuth
{
    public class AuthGoogleService : IAuthGoogleService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly string _googleClientId;
        private readonly IImageLoadService _imageLoadService;

        public AuthGoogleService(UserManager<ApplicationUser> userManager, ITokenService tokenService
            , IConfiguration configuration, IImageLoadService imageLoadService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _googleClientId = configuration["Authorization:Google:ClientId"]
            ?? throw new ArgumentNullException(nameof(configuration), "Google Client ID is not configured in appsettings.json");
            _imageLoadService = imageLoadService;
        }

        public async Task<OAuthLoginResponse> AuthenticateWithGoogleAsync([FromForm] GoogleLoginDto googleLoginDto)
        {
            try
            {
                // Validate the ID token and retrieve the payload
                var payload = await ValidateGoogleTokenAsync(googleLoginDto.IdToken);
                if (payload == null)
                    throw new UnauthorizedAccessException("Invalid Google token");

                // Validate the Role
                var validRoles = new[] { "User", "Investor", "BusinessOwner" };
                if (!validRoles.Contains(googleLoginDto.Role))
                    throw new ArgumentException("Invalid role. Must be User, Investor, or BusinessOwner.");

                // Validate data objects based on Role
                if (googleLoginDto.Role == "Investor")
                {
                    if (googleLoginDto.InvestorData == null)
                        throw new ArgumentException("InvestorData is required for Investor role.");
                    if (googleLoginDto.BusinessOwnerData != null)
                        // To indicate to the client "Frontend"
                        throw new ArgumentException("BusinessOwnerData must be null for Investor role.");
                }
                else if (googleLoginDto.Role == "BusinessOwner")
                {
                    if (googleLoginDto.BusinessOwnerData == null)
                        throw new ArgumentException("BusinessOwnerData is required for BusinessOwner role.");
                    if (googleLoginDto.InvestorData != null)
                        throw new ArgumentException("InvestorData must be null for BusinessOwner role.");
                }
                else // User
                {
                    if (googleLoginDto.InvestorData != null || googleLoginDto.BusinessOwnerData != null)
                        throw new ArgumentException("InvestorData and BusinessOwnerData must be null for User role.");
                }

                // Check if the user already exists by email
                var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Email == payload.Email);

                // If user doesn't exist, create a new user
                if (user == null)
                {
                    // Determine the user type based on Role
                    ApplicationUser newUser;
                    if (googleLoginDto.Role == "Investor")
                    {
                        var investorData = googleLoginDto.InvestorData;
                        newUser = new Investor
                        {
                            UserName = payload.Email.Split('@')[0],
                            Email = payload.Email,
                            PhoneNumber = "N/A",
                            FirstName = investorData.FirstName,
                            LastName = investorData.LastName,
                            BirthDate = investorData.BirthDate,
                            RegistrationDate = DateTime.UtcNow,
                            PersonInfo = new PersonInfo
                            {
                                NationalID = investorData.NationalID,
                                NationalIDImageFrontURL = await _imageLoadService.Upload(investorData.NationalIDImageFront),
                                NationalIDImageBackURL = await _imageLoadService.Upload(investorData.NationalIDImageBack)
                            },
                            RiskTolerance = investorData.RiskTolerance,
                            InvestmentGoals = investorData.InvestmentGoals,
                            MinInvestmentAmount = investorData.MinInvestmentAmount,
                            MaxInvestmentAmount = investorData.MaxInvestmentAmount,
                            AccreditationStatus = investorData.AccreditationStatus,
                            NetWorth = investorData.NetWorth,
                            AnnualIncome = investorData.AnnualIncome
                        };
                    }
                    else if (googleLoginDto.Role == "BusinessOwner")
                    {
                        var businessOwnerData = googleLoginDto.BusinessOwnerData;
                        newUser = new BusinessOwner
                        {
                            UserName = payload.Email.Split('@')[0],
                            Email = payload.Email,
                            PhoneNumber = "N/A",
                            FirstName = businessOwnerData.FirstName,
                            LastName = businessOwnerData.LastName,
                            BirthDate = businessOwnerData.BirthDate,
                            RegistrationDate = DateTime.UtcNow,
                            PersonInfo = new PersonInfo
                            {
                                NationalID = businessOwnerData.NationalID,
                                NationalIDImageFrontURL = await _imageLoadService.Upload(businessOwnerData.NationalIDImageFront),
                                NationalIDImageBackURL = await _imageLoadService.Upload(businessOwnerData.NationalIDImageBack)
                            }
                        };
                    }
                    else // User
                    {
                        newUser = new ApplicationUser
                        {
                            UserName = payload.Email.Split('@')[0],
                            Email = payload.Email,
                            PhoneNumber = "N/A",
                            FirstName = payload.GivenName ?? "Unknown",
                            LastName = payload.FamilyName ?? "Unknown",
                            BirthDate = DateTime.UtcNow,
                            RegistrationDate = DateTime.UtcNow
                        };
                    }


                    // Create the user
                    var result = await _userManager.CreateAsync(newUser);
                    if (!result.Succeeded)
                    {
                        var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                        throw new UserCreationException($"Failed to create user: {errors}");
                    }

                    // Assign the role
                    await _userManager.AddToRoleAsync(newUser, googleLoginDto.Role);

                    // Generate token
                    var token = await _tokenService.CreateToken(newUser);
                    var userRoles = await _userManager.GetRolesAsync(newUser);

                    return new OAuthLoginResponse
                    {
                        UserId = newUser.Id,
                        Roles = userRoles,
                        Token = token,
                        UserName = newUser.UserName,
                        Email = newUser.Email,
                    };
                }
                else
                {
                    // Else the user is already regestred before we will generate a toke for him
                    // Generate token
                    var token = await _tokenService.CreateToken(user);
                    var userRoles = await _userManager.GetRolesAsync(user);

                    // Determine ProfileType
                    string profileType = user is Investor ? "Investor" : user is BusinessOwner ? "BusinessOwner" : "User";

                    return new OAuthLoginResponse
                    {
                        UserId = user.Id,
                        Roles = userRoles,
                        Token = token,
                        UserName = user.UserName,
                        Email = user.Email,
                    };
                }
            }
            catch (UnauthorizedAccessException)
            {
                throw;
            }
            catch (UserCreationException)
            {
                throw;
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Google authentication failed: {ex.Message}", ex);
            }
        }

        public async Task<GoogleJsonWebSignature.Payload> ValidateGoogleTokenAsync(string idToken)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(idToken);

                if (payload == null || string.IsNullOrEmpty(payload.Email))
                    throw new UnauthorizedAccessException("Invalid Google Token: Payload is null or missing email");

                return payload;
            }
            catch (Google.Apis.Auth.InvalidJwtException ex)
            {
                throw new UnauthorizedAccessException("Invalid Google Token: " + ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to validate Google Token: " + ex.Message, ex);
            }
        }
    }
}
