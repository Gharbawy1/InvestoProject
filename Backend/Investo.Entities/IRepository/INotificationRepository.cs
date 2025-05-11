using Investo.Entities.DTO.Notification;
using Investo.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.IRepository
{
    public interface INotificationRepository
    {
        Task SaveAsync(Notification notification);
        Task<List<Notification>> GetNotificationsByUserIdAsync(string userId);
        Task MarkNotificationsAsReadAsync(int notificationId);
        Task<Notification> GetNotificationsByIdAsync(int notificationId);
    }
}
