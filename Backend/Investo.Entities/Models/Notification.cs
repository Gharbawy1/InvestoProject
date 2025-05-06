using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public string IssuerId {  get; set; } 
        public string RecieverId { get; set; } // معرّف اليوزر اللي هيستقبل الـ notification
        public string Message { get; set; } // الرسالة (مثلاً: "تم قبول عرضك على مشروع X")
        public string Payload { get; set; } // بيانات إضافية كـ JSON string (مثلاً: { "OfferId": "offer_1", "ProjectName": "مشروع X" })
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // تاريخ إنشاء الـ notification
        public bool IsRead { get; set; } // هل الـ notification اتقرأ؟
    }
}
