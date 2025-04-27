using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.DTO.Offer;
using Investo.Entities.DTO.Project;
using Investo.Entities.IRepository;
using Investo.Entities.Models;
using Microsoft.AspNetCore.Identity;

namespace Investo.DataAccess.Services.Offers
{
    public class OfferService : IOfferService
    {
        private readonly IOfferRepository _offerRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IProjectRepository _projectRepository;
        public OfferService(IOfferRepository offerRepository, UserManager<ApplicationUser> userManager, IProjectRepository projectRepository)
        {
            _offerRepository = offerRepository;
            this._userManager = userManager;
            _projectRepository = projectRepository;
        }

        public async Task<ValidationResult<ReadOfferDto>> CreateOfferAsync(CreateOrUpdateOfferDto dto)
        {
            var IsInvestorFound = await _userManager.FindByIdAsync(dto.InvestorId);
            if (IsInvestorFound == null)
            {
                return new ValidationResult<ReadOfferDto>
                {
                    Data = new ReadOfferDto(),
                    ErrorMessage = $"Investor associated with the given Offer with Id :  {dto.InvestorId} not found",
                    IsValid = false 
                };

            }

            var IsValidProject = await _projectRepository.GetById(dto.ProjectId);
            if (IsValidProject == null)
            {
                return new ValidationResult<ReadOfferDto>
                {
                    Data = new ReadOfferDto(),
                    ErrorMessage = $"Project associated with the given Offer with Id : {dto.ProjectId} not found",
                    IsValid = false
                };
            }

            // تجهيز الكيان الجديد بناءً على الداتا اللي جت من الـ DTO
            var offerEntity = new Entities.Models.Offer
            {
                OfferAmount = dto.OfferAmount,
                InvestmentType = Enum.Parse<InvestmentType>(dto.InvestmentType, ignoreCase: true),
                EquityPercentage = dto.EquityPercentage,
                ProfitShare = dto.ProfitShare,
                OfferTerms = dto.OfferTerms,
                ProjectId = dto.ProjectId,
                OfferDate = DateTime.UtcNow,
                ExpirationDate = DateTime.UtcNow.AddDays(30), // مثلا بعد 30 يوم ينتهي العرض
                Status = OfferStatus.Pending, // العرض يبدأ بـ Pending
                InvestorId = dto.InvestorId // هتحط هنا الآيدي بتاع المستثمر الحالي من التوكن أو السيشن
            };

            // إنشاء العرض في الداتابيز
            await _offerRepository.Create(offerEntity);

            // تجهيز الداتا اللي هرجعها للفرونت بعد الإنشاء
            var result = new ReadOfferDto
            {
                OfferId = offerEntity.Id,
                OfferDate = offerEntity.OfferDate,
                OfferAmount = offerEntity.OfferAmount,
                ExpirationDate = offerEntity.ExpirationDate,
                Status = offerEntity.Status.ToString(),
                InvestmentType = offerEntity.InvestmentType.ToString(),
                ProjectId = offerEntity.ProjectId,
                InvestorId = offerEntity.InvestorId,
                Investor = await GetInvestorByOfferId(offerEntity.Id) 
            };

            var SuccessCreationValidationResult = new ValidationResult<ReadOfferDto>
            {
                Data = result,
                ErrorMessage = null,
                IsValid = true
            };
            return SuccessCreationValidationResult;
        }

        public async Task<IEnumerable<ReadOfferDto>> GetAllOffers()
        {
            var offers = await _offerRepository.GetAll();
            var ReadOffers = new List<ReadOfferDto>();
            foreach(var offer in offers)
            {
                var readoffer = new ReadOfferDto
                {
                    OfferId = offer.Id,
                    OfferDate = offer.OfferDate,
                    OfferAmount = offer.OfferAmount,
                    ExpirationDate = offer.ExpirationDate,
                    Status = offer.Status.ToString(),
                    InvestmentType = offer.InvestmentType.ToString(),
                    ProjectId = offer.ProjectId,
                    InvestorId = offer.InvestorId,
                    Investor = await GetInvestorByOfferId(offer.Id)
                };
                ReadOffers.Add(readoffer);
            }
            return ReadOffers;
        }

        public async Task<InvestorBasicInfoDto> GetInvestorByOfferId(int offerId)
        {
            // أول حاجة تجيب العرض بالآيدي وتنتظر النتيجة
            var offer = await _offerRepository.GetById(offerId); 

            if (offer == null || offer.Investor == null)
                return null; // لو العرض مش موجود أو المستثمر مش موجود

            // بعدين تعمل ماب للي محتاجه بس من الـ Investor
            var investorDto = new InvestorBasicInfoDto
            {
                FirstName = offer.Investor.FirstName,
                LastName = offer.Investor.LastName,
                Bio = offer.Investor.Bio,
                ProfilePictureUrl = offer.Investor.ProfilePictureURL,
                RiskTolerance = offer.Investor.RiskTolerance,
                InvestmentGoals = offer.Investor.InvestmentGoals,
                MinInvestmentAmount = offer.Investor.MinInvestmentAmount,
                MaxInvestmentAmount = offer.Investor.MaxInvestmentAmount,
                NetWorth = offer.Investor.NetWorth,
                AnnualIncome = offer.Investor.AnnualIncome,
                AccreditationStatus = offer.Investor.AccreditationStatus
            };

            return investorDto;
        }

        public async Task<ReadOfferDto> GetOfferById(int OfferId)
        {
            var offer = await _offerRepository.GetById(OfferId);
            if (offer == null) return null;
            return new ReadOfferDto
            {
                OfferId = offer.Id,
                OfferDate = offer.OfferDate,
                OfferAmount = offer.OfferAmount,
                ExpirationDate = offer.ExpirationDate,
                Status = offer.Status.ToString(),
                InvestmentType = offer.InvestmentType.ToString(),
                ProjectId = offer.ProjectId,
                InvestorId = offer.InvestorId,
                Investor = await GetInvestorByOfferId(offer.Id)
            };
        }

        public async Task<IEnumerable<ReadOfferDto>> GetOffersByProjectId(int projectId)
        {
            var offers = await _offerRepository.GetOffersByProjectId(projectId);
            if (offers == null || !offers.Any())
                return new List<ReadOfferDto>();

            var result = new List<ReadOfferDto>();
            foreach (var offer in offers)
            {
                result.Add(new ReadOfferDto
                {
                    OfferId = offer.Id,
                    OfferDate = offer.OfferDate,
                    OfferAmount = offer.OfferAmount,
                    ExpirationDate = offer.ExpirationDate,
                    Status = offer.Status.ToString(),
                    InvestmentType = offer.InvestmentType.ToString(),
                    ProjectId = offer.ProjectId,
                    InvestorId = offer.InvestorId,
                    Investor = await GetInvestorByOfferId(offer.Id)
                });
            }

            return result;
        }
        public async Task<ValidationResult<ReadOfferDto>> RespondToOfferAsync(int offerId, string responseStatus)
        {
            var offer = await _offerRepository.GetById(offerId);
            if (offer == null)
            {
                return new ValidationResult<ReadOfferDto>
                {
                    Data = new ReadOfferDto(),
                    ErrorMessage = $"Offer with Id: {offerId} not found.",
                    IsValid = false
                };
            }

            if (!Enum.TryParse<OfferStatus>(responseStatus, true, out var status) || !Enum.IsDefined(typeof(OfferStatus), status) ||  status== OfferStatus.Pending )
            {
                return new ValidationResult<ReadOfferDto>
                {
                    Data = new ReadOfferDto(),
                    ErrorMessage = $"Invalid status value: '{responseStatus}'. Allowed values are 'Accepted' or 'Rejected'.",
                    IsValid = false
                };
            }
          

            if (offer.Status == status)
            {
                return new ValidationResult<ReadOfferDto>
                {
                    Data = new ReadOfferDto(),
                    ErrorMessage = $"The offer is already in the {offer.Status} status.",
                    IsValid = false
                };
            }

            offer.Status = status;

            var updateSuccess = await _offerRepository.UpdateOfferAsync(offer);

            var updatedOffer = new ReadOfferDto
            {
                OfferId = offer.Id,
                OfferDate = offer.OfferDate,
                OfferAmount = offer.OfferAmount,
                ExpirationDate = offer.ExpirationDate,
                Status = offer.Status.ToString(),
                InvestmentType = offer.InvestmentType.ToString(),
                ProjectId = offer.ProjectId,
                InvestorId = offer.InvestorId,
                Investor = await GetInvestorByOfferId(offer.Id)
            };

            return new ValidationResult<ReadOfferDto>
            {
                Data = updatedOffer,
                ErrorMessage = null,
                IsValid = true
            };
        }

        public async Task<IEnumerable<ProjectRaisedFundDto>> GetProjectsRaisedFundsAsync()
        {
            return await _offerRepository.GetOffersAmountForProjectAsync();
        }
    }
}
