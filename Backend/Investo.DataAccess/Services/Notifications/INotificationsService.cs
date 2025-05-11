using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.DTO.Notification;
using Investo.Entities.DTO.Offer;

namespace Investo.DataAccess.Services.Notifications
{
    public interface INotificationsService
    {
        Task SendOfferNotificationAsync(ReadOfferDto offerDto);
        Task SendOfferResponseNotificationAsync(int offerId, string action);
        Task<List<NotificationDto>> GetUserNotificationsAsync(string userId);
        Task MarkNotificationsAsReadAsync(int notificationId);
        Task<NotificationDto> GetNotificationsByIdAsync(int notificationId);    
    }

}
