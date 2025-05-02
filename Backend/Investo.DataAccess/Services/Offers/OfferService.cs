using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
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
        private readonly IMapper _mapper;

        public OfferService(IOfferRepository offerRepository, UserManager<ApplicationUser> userManager, IProjectRepository projectRepository, IMapper mapper)
        {
            _offerRepository = offerRepository;
            _userManager = userManager;
            _projectRepository = projectRepository;
            _mapper = mapper;
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

            var isOfferAlreadyExists = await _offerRepository.HasInvestorMadeOfferForProject(dto.InvestorId, dto.ProjectId);
            if (isOfferAlreadyExists)
            {
                return new ValidationResult<ReadOfferDto>
                {
                    Data = new ReadOfferDto(),
                    ErrorMessage = $"Investor with Name : {IsInvestorFound.FirstName} has already made an offer for this project.",
                    IsValid = false
                };
            }

            var offerEntity = new Entities.Models.Offer
            {

                OfferAmount = dto.OfferAmount,
                InvestmentType = Enum.Parse<InvestmentType>(dto.InvestmentType, ignoreCase: true),
                EquityPercentage = dto.EquityPercentage,
                ProfitShare = dto.ProfitShare,
                OfferTerms = dto.OfferTerms,
                ProjectId = dto.ProjectId,
                OfferDate = DateTime.UtcNow,
                ExpirationDate = DateTime.UtcNow.AddDays(30),
                Status = OfferStatus.Pending,
                InvestorId = dto.InvestorId
            };

            await _offerRepository.Create(offerEntity);

            var result = _mapper.Map<ReadOfferDto>(offerEntity);

            return new ValidationResult<ReadOfferDto>
            {
                Data = result,
                ErrorMessage = null,
                IsValid = true
            };
        }

        public async Task<IEnumerable<ReadOfferDto>> GetAllOffers()
        {
            var offers = await _offerRepository.GetAll();
            var readOffers = _mapper.Map<List<ReadOfferDto>>(offers);

            foreach (var readOffer in readOffers)
            {
                var investorResult = await GetInvestorByOfferId(readOffer.OfferId);
                readOffer.Investor = investorResult.IsValid ? investorResult.Data : null;
            }

            return readOffers;
        }

        public async Task<ValidationResult<InvestorBasicInfoDto>> GetInvestorByOfferId(int offerId)
        {
            var offer = await _offerRepository.GetById(offerId);
            if (offer == null || offer.Investor == null)
            {
                return new ValidationResult<InvestorBasicInfoDto>
                {
                    Data = null,
                    IsValid = false,
                    ErrorMessage = "Investor not found for the offer."
                };
            }

            var investorDto = _mapper.Map<InvestorBasicInfoDto>(offer.Investor);
            return new ValidationResult<InvestorBasicInfoDto>
            {
                Data = investorDto,
                IsValid = true,
                ErrorMessage = null
            };
        }

        public async Task<ValidationResult<ReadOfferDto>> GetOfferById(int offerId)
        {
            var offer = await _offerRepository.GetById(offerId);
            if (offer == null)
            {
                return new ValidationResult<ReadOfferDto>
                {
                    Data = null,
                    IsValid = false,
                    ErrorMessage = $"Offer with Id: {offerId} not found."
                };
            }

            var readOfferDto = _mapper.Map<ReadOfferDto>(offer);
            var investorResult = await GetInvestorByOfferId(offer.Id);

            if (!investorResult.IsValid)
            {
                return new ValidationResult<ReadOfferDto>
                {
                    Data = null,
                    IsValid = false,
                    ErrorMessage = investorResult.ErrorMessage
                };
            }

            readOfferDto.Investor = investorResult.Data;
            return new ValidationResult<ReadOfferDto>
            {
                Data = readOfferDto,
                IsValid = true,
                ErrorMessage = null
            };
        }

        public async Task<ValidationResult<List<ReadOfferDto>>> GetOffersByProjectId(int projectId)
        {
            var offers = await _offerRepository.GetOffersByProjectId(projectId);

            var ListOfReadDto = new List<ReadOfferDto>();

            if (offers == null || !offers.Any())
            {
                return new ValidationResult<List<ReadOfferDto>>()
                {
                    IsValid = true,
                    ErrorMessage = "There is no Offers on this project",
                    Data = ListOfReadDto
                };
            }

            foreach (var offer in offers)
            {
                var offerDto = _mapper.Map<ReadOfferDto>(offer);

                ListOfReadDto.Add(offerDto);
              
            }

            return new ValidationResult<List<ReadOfferDto>>
            {
                Data = ListOfReadDto,
                IsValid = true,
                ErrorMessage = "Offers Retrived Succesfully"
            };
        }
    



        public async Task<ValidationResult<ReadOfferDto>> RespondToOfferAsync(int offerId, string responseStatus)
        {
            var offer = await _offerRepository.GetById(offerId);
            if (offer == null)
            {
                return new ValidationResult<ReadOfferDto>
                {
                    Data = null,
                    IsValid = false,
                    ErrorMessage = $"Offer with Id: {offerId} not found."
                };
            }

            if (!Enum.TryParse<OfferStatus>(responseStatus, true, out var status) ||
                !Enum.IsDefined(typeof(OfferStatus), status) ||
                status == OfferStatus.Pending)
            {
                return new ValidationResult<ReadOfferDto>
                {
                    Data = null,
                    IsValid = false,
                    ErrorMessage = $"Invalid status value: '{responseStatus}'. Allowed values are 'Accepted' or 'Rejected'."
                };
            }

            if (offer.Status == status)
            {
                return new ValidationResult<ReadOfferDto>
                {
                    Data = null,
                    IsValid = false,
                    ErrorMessage = $"The offer is already in the {offer.Status} status."
                };
            }

            offer.Status = status;
            await _offerRepository.UpdateOfferAsync(offer);

            var updatedOffer = _mapper.Map<ReadOfferDto>(offer);
            return new ValidationResult<ReadOfferDto>
            {
                Data = updatedOffer,
                IsValid = true,
                ErrorMessage = null
            };
        }

        public async Task<ValidationResult<IEnumerable<ReadOfferDto>>> GetOffersForCurrentUser(string userId, string userRole)
        {
            IEnumerable<Offer> offers;

            // Check user role and fetch offers
            if (userRole == "Investor")
            {
                offers = await _offerRepository.GetOffersForInvestorAsync(userId);
            }
            else if (userRole == "BusinessOwner")
            {
                offers = await _offerRepository.GetOffersForBusinessOwnerAsync(userId);
            }
            else
            {
                return new ValidationResult<IEnumerable<ReadOfferDto>>
                {
                    Data = null,
                    IsValid = false,
                    ErrorMessage = "Invalid User Role"
                };
            }

            if (offers == null || !offers.Any())
            {
                return new ValidationResult<IEnumerable<ReadOfferDto>>
                {
                    Data = new List<ReadOfferDto>(),
                    IsValid = true
                };
            }

            var readOfferDtos = _mapper.Map<IEnumerable<ReadOfferDto>>(offers);

            return new ValidationResult<IEnumerable<ReadOfferDto>>
            {
                Data = readOfferDtos,
                IsValid = true
            };
        }


        public async Task<IEnumerable<ProjectRaisedFundDto>> GetProjectsRaisedFundsAsync()
        {
            return await _offerRepository.GetOffersAmountForProjectAsync();
        }

        public async Task<ValidationResult<List<ReadOfferDto>>> GetAcceptedOffersByInvestorId(string investorId)
        {
            var investor = await _userManager.FindByIdAsync(investorId);
            if (investor == null)
            {
                return new ValidationResult<List<ReadOfferDto>>
                {
                    Data = null,
                    IsValid = false,
                    ErrorMessage = $"Investor with Id: {investorId} not found."
                };
            }

            var allOffers = await _offerRepository.GetAll();
            var offers = allOffers
                .Where(o => o.InvestorId == investorId && o.Status == OfferStatus.Accepted)
                .ToList();

            if (!offers.Any())
            {
                return new ValidationResult<List<ReadOfferDto>>
                {
                    Data = null,
                    IsValid = false,
                    ErrorMessage = $"No accepted offers found for investorID:{investorId}"
                };
            }

            var readOffersDto = _mapper.Map<List<ReadOfferDto>>(offers);

            return new ValidationResult<List<ReadOfferDto>>
            {
                Data = readOffersDto,
                IsValid = true,
                ErrorMessage = null
            };
        }



    }

}

