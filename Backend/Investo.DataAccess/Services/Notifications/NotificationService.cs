using Investo.DataAccess.Hubs;
using Investo.Entities.DTO.Offer;
using Investo.Entities.IRepository;
using Investo.Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.DataAccess.Services.Notifications
{
    public class NotificationService
    {
        private readonly IProjectRepository _projectRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public NotificationService(IProjectRepository projectRepository, UserManager<ApplicationUser> userManager, IHubContext<NotificationHub> hubContext)
        {
            _projectRepository = projectRepository;
            _userManager = userManager;
            _notificationHubContext = hubContext;
        }
        public async Task SendOfferNotificationAsync(ReadOfferDto offerDto)
        {
            var project = await _projectRepository.GetById(offerDto.ProjectId);
            if (project == null)
            {
                throw new Exception("Project not found");
            }
            var businessOwnerId = project.OwnerId;

            var investor = await _userManager.FindByIdAsync(offerDto.InvestorId);
            if (investor == null)
            {
                throw new Exception("Investor not found");
            }

            var notification = new OfferNotification
            {
                InvestorId = investor.Id,
                InvestorName = $"{investor.FirstName} {investor.LastName}",
                ProjectName = project.ProjectTitle,
                Status = offerDto.Status,
                ExpirationDate = offerDto.ExpirationDate,
                OfferAmount = offerDto.OfferAmount,
                InvestmentType = offerDto.InvestmentType,
                OfferDate = offerDto.OfferDate,
                OfferId = offerDto.OfferId,
                ProjectId = project.Id
            };

            await _notificationHubContext.Clients.User(businessOwnerId).SendAsync("ReceiveOfferNotification", notification);
        }
    }
}
