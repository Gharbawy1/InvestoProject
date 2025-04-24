using Investo.DataAccess.Services.Image_Loading;
using Investo.DataAccess.Services.Token;
using Investo.Entities.DTO.Account;
using Investo.Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
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
        public AccountController(UserManager<ApplicationUser> userManager, ITokenService tokenService, SignInManager<ApplicationUser> signInManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, IImageLoadService imageLoadService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _imageLoadService = imageLoadService;
            //_authGoogleService = authGoogleService;
            // _emailSender = emailSender;
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
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    BirthDate = registerDto.BirthDate,
                    RegistrationDate = registerDto.RegistrationDate,
                    Email = registerDto.Email,
                    PhoneNumber = registerDto.PhoneNumber,
                };

                // Make the UserName = FirstName+LastName+ID
                appUser.UserName = registerDto.FirstName + registerDto.LastName;

                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);
                if (!createdUser.Succeeded)
                {
                    var errors = new List<IdentityError>();
                    errors.AddRange(createdUser.Errors);
                    return StatusCode(500, errors);
                }

                


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
                    PhoneNumber = appUser.PhoneNumber
                };

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

                return StatusCode((int)HttpStatusCode.InternalServerError,errorMessages);
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
                    ProfilePictureURL = await _imageLoadService.Upload(investorRegisterDto.ProfilePictureURL),
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
                    FirstName = investorRegisterDto.FirstName,
                    LastName = investorRegisterDto.LastName,
                    BirthDate = investorRegisterDto.BirthDate,
                    RegistrationDate = investorRegisterDto.RegistrationDate,
                    Email = investorRegisterDto.Email,
                    PhoneNumber = investorRegisterDto.PhoneNumber,
                };

                // Make the UserName = FirstName+LastName+ID
                InvestoUser.UserName = investorRegisterDto.FirstName + investorRegisterDto.LastName;

                var createdUser = await _userManager.CreateAsync(InvestoUser, investorRegisterDto.Password);
                if (!createdUser.Succeeded)
                {
                    var errors = new List<IdentityError>();
                    errors.AddRange(createdUser.Errors);
                    return StatusCode(500, errors);
                }

                

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
                    PhoneNumber = InvestoUser.PhoneNumber
                };

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
                    PersonInfo = PersonInfo,
                    ProfilePictureURL = await _imageLoadService.Upload(boRegisterDto.ProfilePictureURL),
                    FirstName = boRegisterDto.FirstName,
                    LastName = boRegisterDto.LastName,
                    BirthDate = boRegisterDto.BirthDate,
                    RegistrationDate = boRegisterDto.RegistrationDate,
                    Email = boRegisterDto.Email,
                    PhoneNumber = boRegisterDto.PhoneNumber,
                };
                // Make the UserName = FirstName+LastName+ID
                BoUser.UserName = boRegisterDto.FirstName + boRegisterDto.LastName;

                var createdUser = await _userManager.CreateAsync(BoUser, boRegisterDto.Password);
                if (!createdUser.Succeeded)
                {
                    var errors = new List<IdentityError>();
                    errors.AddRange(createdUser.Errors);
                    return StatusCode(500, errors);
                }

                


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
                    PhoneNumber = BoUser.PhoneNumber
                };

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


    }
}
