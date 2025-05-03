using Azure;
using Investo.DataAccess.Hubs;
using Investo.DataAccess.Repository;
using Investo.Entities.DTO.Notification;
using Investo.Entities.DTO.Offer;
using Investo.Entities.IRepository;
using Investo.Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Investo.DataAccess.Services.Notifications
{
    public class NotificationService
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IOfferRepository _offerRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly INotificationRepository _notificationRepository;

        public NotificationService(IProjectRepository projectRepository, UserManager<ApplicationUser> userManager, IHubContext<NotificationHub> hubContext, INotificationRepository notificationRepository, IOfferRepository offerRepository)
        {
            _projectRepository = projectRepository;
            _userManager = userManager;
            _notificationHubContext = hubContext;
            _notificationRepository = notificationRepository;
            _offerRepository = offerRepository;
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

            var notification = new Notification
            {
                IssuerId = investor.Id,
                RecieverId = businessOwnerId,
                Message = $"عرض جديد من {investor.FirstName} {investor.LastName} على مشروع {project.ProjectTitle}",
                Payload = JsonSerializer.Serialize(new
                {
                    OfferId = offerDto.OfferId,
                    ProjectId = project.Id,
                    ProjectName = project.ProjectTitle,
                    InvestorId = investor.Id,
                    InvestorName = $"{investor.FirstName} {investor.LastName}",
                    OfferAmount = offerDto.OfferAmount,
                    InvestmentType = offerDto.InvestmentType,
                    Status = offerDto.Status,
                    OfferDate = offerDto.OfferDate,
                    ExpirationDate = offerDto.ExpirationDate
                }),
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            await _notificationRepository.SaveAsync(notification);

            // إرسال الـ notification عبر SignalR
            await _notificationHubContext.Clients.User(businessOwnerId)
                .SendAsync("ReceiveNotification", notification);
        }
        public async Task SendOfferResponseNotificationAsync(int offerId, string action)
        {
            // تحويل الـ action إلى OfferStatus
            Enum.TryParse<OfferStatus>(action, true, out var status);

            var offer = await _offerRepository.GetById(offerId);
            if (offer == null)
            {
                throw new Exception("Offer not found");
            }

            var project = await _projectRepository.GetById(offer.ProjectId);
            if (project == null)
            {
                throw new Exception("Project not found");
            }

            offer.Status = status; // Accepted or Rejected
            await _offerRepository.UpdateOfferAsync(offer);

            var notification = new Notification
            {
                IssuerId = project.OwnerId,
                RecieverId = offer.InvestorId,
                Message = status.ToString() == "Accepted"
                    ? $"تم قبول عرضك على مشروع {project.ProjectTitle}"
                    : $"تم رفض عرضك على مشروع {project.ProjectTitle}",
                Payload = JsonSerializer.Serialize(new
                {
                    OfferId = offerId,
                    ProjectId = project.Id,
                    ProjectName = project.ProjectTitle,
                    Status = status.ToString(),
                    ResponseDate = DateTime.UtcNow
                }),
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            await _notificationRepository.SaveAsync(notification);

            // إرسال الـ notification عبر SignalR
            await _notificationHubContext.Clients.User(notification.RecieverId)
                .SendAsync("ReceiveNotification", notification);
        }
    }
}
