using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.DTO.Offer;
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

            var isOfferAlreadyExists = await _offerRepository.IsThereAnyOffersForInvestor(dto.InvestorId);

            if (isOfferAlreadyExists)
            {
                return new ValidationResult<ReadOfferDto>
                {
                    Data = new ReadOfferDto(),
                    ErrorMessage = $"Investor with Id : {dto.InvestorId} has already made an offer.",
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
                ExpirationDate = offer.ExpirationDate,
                Status = offer.Status.ToString(),
                InvestmentType = offer.InvestmentType.ToString(),
                ProjectId = offer.ProjectId,
                InvestorId = offer.InvestorId,
                Investor = await GetInvestorByOfferId(offer.Id)
            };
        }
    }
}
