using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Notification
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string ReceiverId { get; set; }
        public string IssuerId { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }
        public string Payload { get; set; }
    }

}
