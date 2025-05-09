using Investo.DataAccess.ApplicationContext;
using Investo.Entities.DTO.Notification;
using Investo.Entities.IRepository;
using Investo.Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.DataAccess.Repository
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly RealTimeDbContext _realTimeDbContext;

        public NotificationRepository(RealTimeDbContext realTimeDbContext)
        {
            _realTimeDbContext = realTimeDbContext;
        }

        public async Task SaveAsync(Notification notification)
        {
            _realTimeDbContext.Notifications.Add(notification);
            await _realTimeDbContext.SaveChangesAsync();
        }
        public async Task<List<Notification>> GetNotificationsByUserIdAsync(string userId)
        {
            return await _realTimeDbContext.Notifications
                .Where(n => n.RecieverId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }
        public async Task MarkNotificationsAsReadAsync(int notificationId)
        {
            var notification = await _realTimeDbContext.Notifications
                .Where(n => n.Id == notificationId)
                .FirstOrDefaultAsync();

            notification.IsRead = true;  
            await _realTimeDbContext.SaveChangesAsync();
        }

        public async Task<Notification> GetNotificationsByIdAsync(int notificationId)
        {
            return await _realTimeDbContext.Notifications.Where(n => n.Id == notificationId).FirstOrDefaultAsync();
        }
    }
}
