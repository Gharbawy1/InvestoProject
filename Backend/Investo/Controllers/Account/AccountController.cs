using Investo.DataAccess.Services.EmailVerification;
using Investo.DataAccess.Services.Image_Loading;
using Investo.DataAccess.Services.Notifications;
using Investo.DataAccess.Services.OAuth;
using Investo.DataAccess.Services.Token;
using Investo.Entities.DTO.Account;
using Investo.Entities.DTO.Account.BO;
using Investo.Entities.DTO.Account.BODto;
using Investo.Entities.DTO.Account.InvestorDto;
using Investo.Entities.DTO.Account.Profile;
using Investo.Entities.DTO.Account.UserDto;
using Investo.Entities.DTO.Account.UsersProfile;
using Investo.Entities.DTO.Notification;
using Investo.Entities.DTO.oAuth;
using Investo.Entities.IRepository;
using Investo.Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Security.Claims;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Investo.Presentation.Controllers.Account
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IImageLoadService _imageLoadService;
        private readonly IAuthGoogleService _authGoogleService;
        private readonly IEmailVerificationService _emailverificationService;
        private readonly INotificationsService _notificationsService;


        public AccountController(UserManager<ApplicationUser> userManager,
            ITokenService tokenService,
            SignInManager<ApplicationUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            IImageLoadService imageLoadService,
            IAuthGoogleService authGoogleService,
            IEmailVerificationService emailServiceRepository,
            INotificationRepository notificationRepository,
            INotificationsService notificationsService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _imageLoadService = imageLoadService;
            _authGoogleService = authGoogleService;
            _emailverificationService = emailServiceRepository;
            _notificationsService = notificationsService;
        }

        [HttpPost("register-User")]
        public async Task<ActionResult<RegisterDto>> RegisterUser([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (await _userManager.Users.AsNoTracking().AnyAsync(u => u.Email == registerDto.Email))
                {
                    return Conflict("This Email is already registered");
                }

                var isFirstUser = !(await _userManager.Users.AnyAsync());


                var appUser = new ApplicationUser
                {
                    UserName = Guid.NewGuid().ToString(),
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    BirthDate = registerDto.BirthDate,
                    RegistrationDate = registerDto.RegistrationDate,
                    Email = registerDto.Email,
                    PhoneNumber = registerDto.PhoneNumber,
                };
                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);

                if (!createdUser.Succeeded)
                {
                    var errors = new List<IdentityError>();
                    errors.AddRange(createdUser.Errors);
                    return StatusCode(500, errors);
                }
                // Make the UserName = FirstName+LastName+ID
                appUser.UserName = (registerDto.FirstName + registerDto.LastName+ new string(appUser.Id.Take(8).ToArray())).Trim();
                await _userManager.UpdateAsync(appUser);

                await _userManager.AddToRoleAsync(appUser, "User");
                var userRoles = await _userManager.GetRolesAsync(appUser);

                var rgDto = new RegisterResponseDTO
                {
                    UserName = appUser.UserName,
                    Email = appUser.Email,
                    FirstName = appUser.FirstName,
                    LastName = appUser.LastName,
                    Token = await _tokenService.CreateToken(appUser),
                    Roles = userRoles,
                    UserId = appUser.Id,
                    PhoneNumber = appUser.PhoneNumber,
                    IsEmailConfirmed = appUser.EmailConfirmed
                };
                await _emailverificationService.SendVerificationEmailAsync(appUser);
                return Ok(rgDto);
            }
            catch (Exception ex)
            {
                var errorDetails = ex.InnerException?.Message ?? ex.Message;
                var errorMessages = new List<string>
        {
            "An error occurred while adding User",
            $"Error Message: {errorDetails}",
        };

                return StatusCode((int)HttpStatusCode.InternalServerError, errorMessages);
            }
        }

        [HttpPost("register-investor")]
        public async Task<ActionResult<InvestorRegisterResponseDto>> RegisterInvestor([FromForm] InvestorRegisterDto investorRegisterDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (await _userManager.Users.AsNoTracking().AnyAsync(u => u.Email == investorRegisterDto.Email))
                {
                    return Conflict("This Email is already registered");
                }

                var isFirstUser = !(await _userManager.Users.AnyAsync());


                var InvestoUser = new Investor
                {
                    AccreditationStatus = investorRegisterDto.AccreditationStatus,
                    RiskTolerance = investorRegisterDto.RiskTolerance,
                    NetWorth = investorRegisterDto.NetWorth,
                    MinInvestmentAmount = investorRegisterDto.MinInvestmentAmount,
                    MaxInvestmentAmount = investorRegisterDto.MaxInvestmentAmount,
                    InvestmentGoals = investorRegisterDto.InvestmentGoals,
                    AnnualIncome = investorRegisterDto.AnnualIncome,
                    PersonInfo = new PersonInfo
                    {
                        NationalID = investorRegisterDto.NationalID,
                        // هتحط هنا اللينكات بعد الرفع
                        NationalIDImageFrontURL = await _imageLoadService.Upload(investorRegisterDto.NationalIDImageFrontURL),
                        NationalIDImageBackURL = await _imageLoadService.Upload(investorRegisterDto.NationalIDImageBackURL),
                    },
                    UserName = Guid.NewGuid().ToString(),
                    FirstName = investorRegisterDto.FirstName,
                    LastName = investorRegisterDto.LastName,
                    BirthDate = investorRegisterDto.BirthDate,
                    RegistrationDate = investorRegisterDto.RegistrationDate,
                    Email = investorRegisterDto.Email,
                    PhoneNumber = investorRegisterDto.PhoneNumber,
                };

                var createdUser = await _userManager.CreateAsync(InvestoUser, investorRegisterDto.Password);
                if (!createdUser.Succeeded)
                {
                    var errors = new List<IdentityError>();
                    errors.AddRange(createdUser.Errors);
                    return StatusCode(500, errors);
                }
                // Make the UserName = FirstName+LastName+ID
                InvestoUser.UserName = (InvestoUser.FirstName + InvestoUser.LastName + new string(InvestoUser.Id.Take(8).ToArray())).Trim();
                await _userManager.UpdateAsync(InvestoUser);

                await _userManager.AddToRoleAsync(InvestoUser, "Investor");
                var userRoles = await _userManager.GetRolesAsync(InvestoUser);

                var rgDto = new InvestorRegisterResponseDto
                {
                    UserName = InvestoUser.UserName,
                    Email = InvestoUser.Email,
                    FirstName = InvestoUser.FirstName,
                    LastName = InvestoUser.LastName,
                    Token = await _tokenService.CreateToken(InvestoUser),
                    Roles = userRoles,
                    UserId = InvestoUser.Id,
                    PhoneNumber = InvestoUser.PhoneNumber,
                    IsEmailConfirmed = InvestoUser.EmailConfirmed
                };
                await _emailverificationService.SendVerificationEmailAsync(InvestoUser);

                return Ok(rgDto);
            }
            catch (Exception ex)
            {
                var errorDetails = ex.InnerException?.Message ?? ex.Message;
                var errorMessages = new List<string>
        {
            "An error occurred while adding User",
            $"Error Message: {errorDetails}",
        };

                return StatusCode((int)HttpStatusCode.InternalServerError, errorMessages);
            }
        }

        [HttpPost("register-businessOwner")]
        public async Task<ActionResult<BORegisterResponseDto>> RegisterBO([FromForm] BORegisterDto boRegisterDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (await _userManager.Users.AsNoTracking().AnyAsync(u => u.Email == boRegisterDto.Email))
                {
                    return Conflict("This Email is already registered");
                }

                if (boRegisterDto.NationalIDImageFrontURL == null || boRegisterDto.NationalIDImageBackURL == null)
                {
                    return BadRequest("Front and back images of the National ID are required.");
                }

                var PersonInfo = new PersonInfo
                {
                    NationalID = boRegisterDto.NationalID,
                    // هتحط هنا اللينكات بعد الرفع
                    NationalIDImageFrontURL = await _imageLoadService.Upload(boRegisterDto.NationalIDImageFrontURL),
                    NationalIDImageBackURL = await _imageLoadService.Upload(boRegisterDto.NationalIDImageBackURL),
                };
                var BoUser = new BusinessOwner
                {
                    UserName = Guid.NewGuid().ToString(),
                    PersonInfo = PersonInfo,
                    FirstName = boRegisterDto.FirstName,
                    LastName = boRegisterDto.LastName,
                    BirthDate = boRegisterDto.BirthDate,
                    RegistrationDate = boRegisterDto.RegistrationDate,
                    Email = boRegisterDto.Email,
                    PhoneNumber = boRegisterDto.PhoneNumber,
                };
                
                var createdUser = await _userManager.CreateAsync(BoUser, boRegisterDto.Password);
                if (!createdUser.Succeeded)
                {
                    var errors = new List<IdentityError>();
                    errors.AddRange(createdUser.Errors);
                    return StatusCode(500, errors);
                }
                // Make the UserName = FirstName+LastName+ID
                BoUser.UserName = (BoUser.FirstName + BoUser.LastName + new string(BoUser.Id.Take(8).ToArray())).Trim();
                await _userManager.UpdateAsync(BoUser);


                await _userManager.AddToRoleAsync(BoUser, "BusinessOwner");
                var userRoles = await _userManager.GetRolesAsync(BoUser);

                var rgDto = new BORegisterResponseDto
                {
                    UserName = BoUser.UserName,
                    Email = BoUser.Email,
                    FirstName = BoUser.FirstName,
                    LastName = BoUser.LastName,
                    Token = await _tokenService.CreateToken(BoUser),
                    Roles = userRoles,
                    UserId = BoUser.Id,
                    PhoneNumber = BoUser.PhoneNumber,
                    IsEmailConfirmed = BoUser.EmailConfirmed
                };
                await _emailverificationService.SendVerificationEmailAsync(BoUser);

                return Ok(rgDto);
            }
            catch (Exception ex)
            {
                var errorDetails = ex.InnerException?.Message ?? ex.Message;
                var errorMessages = new List<string>
        {
            "An error occurred while adding User",
            $"Error Message: {errorDetails}",
        };

                return StatusCode((int)HttpStatusCode.InternalServerError, errorMessages);
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null)
            {
                return Unauthorized("Invalid Email or password");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded)
            {
                return Unauthorized("Invalid Email or password");
            }

            var userRoles = await _userManager.GetRolesAsync(user);

            LoginResponseDto logResponseDto = new LoginResponseDto
            {
                Token = await _tokenService.CreateToken(user),
                Roles = userRoles,
                UserId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfilePictureURL = user.ProfilePictureURL,

                // Rest Of data will be in get profile endpoint
            };

            return Ok(logResponseDto);
        }

        [HttpPost("AddRole")]
        public async Task<IActionResult> AddRole([FromBody] string roleName)
        {
            if (string.IsNullOrWhiteSpace(roleName))
            {
                return BadRequest("Role name is required");
            }
            var role = new IdentityRole { Name = roleName };

            var result = await _roleManager.CreateAsync(role);

            if (result.Succeeded)
            {
                return StatusCode((int)HttpStatusCode.OK, $"Role '{roleName}' added successfully");
            }
            else
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return BadRequest(errors);
            }
        }

        [HttpPost("upgrade-to-investor")]
        [Authorize]
        public async Task<ActionResult<InvestorRegisterResponseDto>> UpgradeToInvestor([FromForm] UpgradeToInvestorDto investorRegisterDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // نلاقي اليوزر الحالي
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized("اليوزر مش موجود");
                }

                // نتأكد إنه مش Investor أصلاً
                if (await _userManager.IsInRoleAsync(user, "Investor"))
                {
                    return BadRequest("إنت Investor أصلاً!");
                }

                // ننشئ Investor جديد
                var investor = new Investor
                {
                    Id = user.Id, // لازم نفس الـ ID
                    AccreditationStatus = investorRegisterDto.AccreditationStatus,
                    RiskTolerance = investorRegisterDto.RiskTolerance,
                    ProfilePictureURL = await _imageLoadService.Upload(investorRegisterDto.ProfilePictureURL),
                    NetWorth = investorRegisterDto.NetWorth,
                    MinInvestmentAmount = investorRegisterDto.MinInvestmentAmount,
                    MaxInvestmentAmount = investorRegisterDto.MaxInvestmentAmount,
                    InvestmentGoals = investorRegisterDto.InvestmentGoals,
                    AnnualIncome = investorRegisterDto.AnnualIncome,
                    PersonInfo = new PersonInfo
                    {
                        NationalID = investorRegisterDto.NationalID,
                        NationalIDImageFrontURL = await _imageLoadService.Upload(investorRegisterDto.NationalIDImageFrontURL),
                        NationalIDImageBackURL = await _imageLoadService.Upload(investorRegisterDto.NationalIDImageBackURL),
                    },
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    BirthDate = user.BirthDate,
                    RegistrationDate = user.RegistrationDate,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    UserName = user.UserName,
                    PasswordHash = user.PasswordHash,
                    EmailConfirmed = user.EmailConfirmed,
                    Bio = user.Bio,
                    Address = user.Address,
                };

                // نحذف اليوزر القديم من الداتابيز
                var deleteResult = await _userManager.DeleteAsync(user);
                if (!deleteResult.Succeeded)
                {
                    return StatusCode(500, deleteResult.Errors);
                }

                // نضيف الـ Investor الجديد
                var createResult = await _userManager.CreateAsync(investor);
                if (!createResult.Succeeded)
                {
                    return StatusCode(500, createResult.Errors);
                }

                // نضيف الـ Role الجديد
                await _userManager.AddToRoleAsync(investor, "Investor");
                var userRoles = await _userManager.GetRolesAsync(investor);

                var response = new InvestorRegisterResponseDto
                {
                    UserName = investor.UserName,
                    Email = investor.Email,
                    FirstName = investor.FirstName,
                    LastName = investor.LastName,
                    Token = await _tokenService.CreateToken(investor),
                    Roles = userRoles,
                    UserId = investor.Id,
                    PhoneNumber = investor.PhoneNumber
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                var errorDetails = ex.InnerException?.Message ?? ex.Message;
                var errorMessages = new List<string>
        {
            "فيه مشكلة وإحنا بنعمل upgrade لليوزر",
            $"الرسالة: {errorDetails}"
        };
                return StatusCode((int)HttpStatusCode.InternalServerError, errorMessages);
            }
        }

        [HttpPost("upgrade-to-businessowner")]
        [Authorize]
        public async Task<ActionResult<InvestorRegisterResponseDto>> UpgradeToBusinessOwner([FromForm] UpgradeToBoDto BusinessOwnerRegiesterDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // نلاقي اليوزر الحالي
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized("اليوزر مش موجود");
                }

                if (await _userManager.IsInRoleAsync(user, "BusinessOwner"))
                {
                    return BadRequest("إنت BusinessOwner أصلاً!");
                }

                var BusinessOwner = new BusinessOwner
                {
                    Id = user.Id, // لازم نفس الـ ID
                    PersonInfo = new PersonInfo
                    {
                        NationalID = BusinessOwnerRegiesterDto.NationalID,
                        NationalIDImageFrontURL = await _imageLoadService.Upload(BusinessOwnerRegiesterDto.NationalIDImageFrontURL),
                        NationalIDImageBackURL = await _imageLoadService.Upload(BusinessOwnerRegiesterDto.NationalIDImageBackURL),
                    },
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    BirthDate = user.BirthDate,
                    RegistrationDate = user.RegistrationDate,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    UserName = user.UserName,
                    PasswordHash = user.PasswordHash,
                    Bio = user.Bio,
                    Address = user.Address,
                };

                // نحذف اليوزر القديم من الداتابيز
                var deleteResult = await _userManager.DeleteAsync(user);
                if (!deleteResult.Succeeded)
                {
                    return StatusCode(500, deleteResult.Errors);
                }

                // نضيف الـ Investor الجديد
                var createResult = await _userManager.CreateAsync(BusinessOwner);
                if (!createResult.Succeeded)
                {
                    return StatusCode(500, createResult.Errors);
                }

                // نضيف الـ Role الجديد
                await _userManager.AddToRoleAsync(BusinessOwner, "BusinessOwner");
                var userRoles = await _userManager.GetRolesAsync(BusinessOwner);

                var response = new InvestorRegisterResponseDto
                {
                    UserName = BusinessOwner.UserName,
                    Email = BusinessOwner.Email,
                    FirstName = BusinessOwner.FirstName,
                    LastName = BusinessOwner.LastName,
                    Token = await _tokenService.CreateToken(BusinessOwner),
                    Roles = userRoles,
                    UserId = BusinessOwner.Id,
                    PhoneNumber = BusinessOwner.PhoneNumber,
                    IsEmailConfirmed = BusinessOwner.EmailConfirmed
                    
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                var errorDetails = ex.InnerException?.Message ?? ex.Message;
                var errorMessages = new List<string>
        {
            "فيه مشكلة وإحنا بنعمل upgrade لليوزر",
            $"الرسالة: {errorDetails}"
        };
                return StatusCode((int)HttpStatusCode.InternalServerError, errorMessages);
            }
        }

        [HttpPost("upload-profile-picture")]
        [Authorize]
        public async Task<IActionResult> UploadProfilePicture([FromForm] UpdateProfileImageDto profilePicture)
        {
            try
            {
                if (profilePicture == null || profilePicture.profilePicture.Length == 0)
                {
                    return BadRequest("لازم ترفع صورة!");
                }

                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized("اليوزر مش موجود");
                }

                // نرفع الصورة وناخد الـ URL
                var pictureUrl = await _imageLoadService.Upload(profilePicture.profilePicture);
                user.ProfilePictureURL = pictureUrl;

                // نحدّث اليوزر في الداتابيز
                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    return StatusCode(500, updateResult.Errors);
                }

                return Ok(new { Message = "الصورة اترفعت بنجاح!", ProfilePictureURL = pictureUrl });
            }
            catch (Exception ex)
            {
                var errorDetails = ex.InnerException?.Message ?? ex.Message;
                var errorMessages = new List<string>
        {
            "فيه مشكلة وإحنا بنرفع الصورة",
            $"الرسالة: {errorDetails}"
        };
                return StatusCode((int)HttpStatusCode.InternalServerError, errorMessages);
            }
        }

        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto updateProfileDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized("اليوزر مش موجود");
                }

                // نحدّث البيانات اللي جات
                if (!string.IsNullOrEmpty(updateProfileDto.FirstName))
                    user.FirstName = updateProfileDto.FirstName;
                if (!string.IsNullOrEmpty(updateProfileDto.LastName))
                    user.LastName = updateProfileDto.LastName;
                if (!string.IsNullOrEmpty(updateProfileDto.PhoneNumber))
                    user.PhoneNumber = updateProfileDto.PhoneNumber;
                if (updateProfileDto.BirthDate.HasValue)
                    user.BirthDate = updateProfileDto.BirthDate.Value;
                if (!string.IsNullOrEmpty(updateProfileDto.Bio))
                    user.Bio = updateProfileDto.Bio;
                if (!string.IsNullOrEmpty(updateProfileDto.Address))
                    user.Address = updateProfileDto.Address;

                // نحدّث اليوزر في الداتابيز
                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    return StatusCode(500, updateResult.Errors);
                }

                return Ok(new
                {
                    Message = "البيانات اتحدّثت بنجاح!",
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    BirthDate = user.BirthDate,
                    Bio = user.Bio,
                    Address = user.Address,
                });
            }
            catch (Exception ex)
            {
                var errorDetails = ex.InnerException?.Message ?? ex.Message;
                var errorMessages = new List<string>
        {
            "فيه مشكلة وإحنا بنحدّث البيانات",
            $"الرسالة: {errorDetails}"
        };
                return StatusCode((int)HttpStatusCode.InternalServerError, errorMessages);
            }
        }

        /// <summary>
        /// Retrieves the profile of the currently authenticated user.
        /// </summary>
        /// <returns>
        /// Returns a UserProfileDto, InvestorProfileDto, or BusinessOwnerProfileDto based on the user type.
        /// If the user is not found, returns 404 (Not Found).
        /// </returns>
        /// <remarks>
        /// Requires authentication. Returns profile details specific to the user's role (User, Investor, or BusinessOwner).
        /// </remarks>
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetUserProfile()
        {
            try
            {
                // نجيب اليوزر الحالي
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // نجيب الـ Roles بتاع اليوزر
                var roles = await _userManager.GetRolesAsync(user);

                // لو اليوزر Investor
                if (user is Investor investor)
                {
                    var investorDto = new InvestorProfileDto
                    {
                        Id = investor.Id,
                        UserName = investor.UserName,
                        Email = investor.Email,
                        FirstName = investor.FirstName,
                        LastName = investor.LastName,
                        BirthDate = investor.BirthDate,
                        RegistrationDate = investor.RegistrationDate,
                        ProfilePictureURL = investor.ProfilePictureURL,
                        Bio = investor.Bio,
                        Address = investor.Address,
                        PhoneNumber = investor.PhoneNumber,
                        RiskTolerance = investor.RiskTolerance,
                        InvestmentGoals = investor.InvestmentGoals,
                        MinInvestmentAmount = investor.MinInvestmentAmount,
                        MaxInvestmentAmount = investor.MaxInvestmentAmount,
                        AccreditationStatus = investor.AccreditationStatus,
                        NetWorth = investor.NetWorth,
                        AnnualIncome = investor.AnnualIncome,
                    };
                    return Ok(investorDto);
                }

                // لو اليوزر BusinessOwner
                if (user is BusinessOwner businessOwner)
                {
                    var businessOwnerDto = new BusinessOwnerProfileDto
                    {
                        Id = businessOwner.Id,
                        UserName = businessOwner.UserName,
                        Email = businessOwner.Email,
                        FirstName = businessOwner.FirstName,
                        LastName = businessOwner.LastName,
                        BirthDate = businessOwner.BirthDate,
                        RegistrationDate = businessOwner.RegistrationDate,
                        ProfilePictureURL = businessOwner.ProfilePictureURL,
                        Bio = businessOwner.Bio,
                        Address = businessOwner.Address,
                        PhoneNumber = businessOwner.PhoneNumber,
                    };
                    return Ok(businessOwnerDto);
                }

                // لو اليوزر ApplicationUser عادي
                var userDto = new UserProfileDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    BirthDate = user.BirthDate,
                    RegistrationDate = user.RegistrationDate,
                    ProfilePictureURL = user.ProfilePictureURL,
                    Bio = user.Bio,
                    Address = user.Address,
                    PhoneNumber = user.PhoneNumber,
                };
                return Ok(userDto);
            }
            catch (Exception ex)
            {
                var errorDetails = ex.InnerException?.Message ?? ex.Message;
                var errorMessages = new List<string>
                {
                    "An error occurred while retrieving the user profile",
                    $"Error Message: {errorDetails}"
                };
                return StatusCode((int)HttpStatusCode.InternalServerError, errorMessages);
            }
        }

        /// <remarks>
        /// Example: { "idToken": "google_id_token", "role": "Investor", "investorData": { "firstName": "John", ... }, "businessOwnerData": null }
        /// </remarks>
        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromForm] GoogleLoginDto googleLoginDto)
        {
            try
            {
                var tokenDto = await _authGoogleService.AuthenticateWithGoogleAsync(googleLoginDto);
                return Ok(tokenDto);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (UserCreationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred", Details = ex.Message });
            }
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            var decodedToken = Uri.UnescapeDataString(token);
            Console.WriteLine($"Received Token: {token}");
            Console.WriteLine($"Decoded Token: {decodedToken}");
            var IsEmailConfirmed = await _emailverificationService.VerifyEmailAsync(user, decodedToken);
            if (IsEmailConfirmed)
            {
                return Ok("Email verified successfully");
            }

            return BadRequest("Email verification failed");
        }


        /// <summary>
        /// Retrieves the profile of a user by their ID.
        /// </summary>
        /// <param name="id">The ID of the user whose profile is to be retrieved.</param>
        /// <returns>
        /// Returns a UserProfileDto, InvestorProfileDto, or BusinessOwnerProfileDto based on the user type.
        /// If the user is not found, returns 404 (Not Found).
        /// </returns>
        /// <remarks>
        /// Requires authentication. Returns profile details specific to the user's role (User, Investor, or BusinessOwner).
        /// </remarks>
        [HttpGet("profile/{id}")]
        [Authorize]
        public async Task<IActionResult> GetUserProfileById(string id)
        {
            try
            {
                // جلب المستخدم بناءً على الـ ID
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new ValidationResult<string>
                    {
                        IsValid = false,
                        ErrorMessage = "المستخدم غير موجود"
                    });
                }

                // جلب الـ Roles بتاع المستخدم
                var roles = await _userManager.GetRolesAsync(user);

                // لو المستخدم Investor
                if (user is Investor investor)
                {
                    var investorDto = new InvestorProfileDto
                    {
                        UserName = investor.UserName,
                        Email = investor.Email,
                        FirstName = investor.FirstName,
                        LastName = investor.LastName,
                        BirthDate = investor.BirthDate,
                        RegistrationDate = investor.RegistrationDate,
                        ProfilePictureURL = investor.ProfilePictureURL,
                        Bio = investor.Bio,
                        Address = investor.Address,
                        PhoneNumber = investor.PhoneNumber,
                        RiskTolerance = investor.RiskTolerance,
                        InvestmentGoals = investor.InvestmentGoals,
                        MinInvestmentAmount = investor.MinInvestmentAmount,
                        MaxInvestmentAmount = investor.MaxInvestmentAmount,
                        AccreditationStatus = investor.AccreditationStatus,
                        NetWorth = investor.NetWorth,
                        AnnualIncome = investor.AnnualIncome,
                        
                    };
                    return Ok(investorDto);
                }

                // لو المستخدم BusinessOwner
                if (user is BusinessOwner businessOwner)
                {
                    var businessOwnerDto = new BusinessOwnerProfileDto
                    {
                        Id = businessOwner.Id,
                        UserName = businessOwner.UserName,
                        Email = businessOwner.Email,
                        FirstName = businessOwner.FirstName,
                        LastName = businessOwner.LastName,
                        BirthDate = businessOwner.BirthDate,
                        RegistrationDate = businessOwner.RegistrationDate,
                        ProfilePictureURL = businessOwner.ProfilePictureURL,
                        Bio = businessOwner.Bio,
                        Address = businessOwner.Address,
                        PhoneNumber = businessOwner.PhoneNumber,
                    };
                    return Ok(businessOwnerDto);
                }

                // لو المستخدم ApplicationUser عادي
                var userDto = new UserProfileDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    BirthDate = user.BirthDate,
                    RegistrationDate = user.RegistrationDate,
                    ProfilePictureURL = user.ProfilePictureURL,
                    Bio = user.Bio,
                    Address = user.Address,
                    PhoneNumber = user.PhoneNumber,
                };
                return Ok(userDto);
            }
            catch (Exception ex)
            {
                var errorDetails = ex.InnerException?.Message ?? ex.Message;
                var errorMessages = new List<string>
                {
                    "حدث خطأ أثناء استرجاع ملف المستخدم",
                    $"تفاصيل الخطأ: {errorDetails}"
                };
                return StatusCode((int)HttpStatusCode.InternalServerError, errorMessages);
            }
        }

        [HttpGet("notifications")]
        [Authorize]
        public async Task<ActionResult<ValidationResult<List<NotificationDto>>>> GetUserNotifications()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new ValidationResult<List<NotificationDto>>
                    {
                        IsValid = false,
                        ErrorMessage = "المستخدم غير مصرح له بالوصول"
                    });
                }

                // get all notifications of a specific user 
                var notifications = await _notificationsService.GetUserNotificationsAsync(userId);

                return Ok(new ValidationResult<List<NotificationDto>>
                {
                    IsValid = true,
                    Data = notifications
                });
            }
            catch (Exception ex)
            {
                var errorDetails = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new ValidationResult<List<NotificationDto>>
                {
                    IsValid = false,
                    ErrorMessage = $"خطأ أثناء جلب الإشعارات: {errorDetails}"
                });
            }
        }

        [HttpPut("mark-notification-as-read/{NotificationId}")]
        [Authorize]
        public async Task<ActionResult<ValidationResult<NotificationDto>>> MarkNotificationAsRead(int NotificationId)
        {
            try
            {
                 await _notificationsService.MarkNotificationsAsReadAsync(NotificationId);
                var notification = await _notificationsService.GetNotificationsByIdAsync(NotificationId);


                return Ok(new ValidationResult<NotificationDto>
                {
                    IsValid = true,
                    Data = notification
                });
            }
            catch (Exception ex)
            {
                var errorDetails = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new ValidationResult<List<NotificationDto>>
                {
                    IsValid = false,
                    ErrorMessage = $"خطأ أثناء جلب الإشعارات: {errorDetails}"
                });
            }
        }


    }

}

