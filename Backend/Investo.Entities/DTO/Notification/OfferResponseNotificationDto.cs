using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Notification
{
    public class OfferResponseNotificationDto
    {
        public string Id { get; set; } // معرّف الـ notification
        public string InvestorId { get; set; } // معرّف الـ Investor اللي هيستقبل الـ notification
        public int OfferId { get; set; } // معرّف الـ offer
        public int ProjectId { get; set; } // معرّف المشروع
        public string ProjectName { get; set; } // اسم المشروع
        public string Status { get; set; } // حالة العرض (Accepted أو Rejected)
        public DateTime ResponseDate { get; set; } // تاريخ القبول/الرفض
        public string Message { get; set; } // الرسالة (مثلاً: "تم قبول عرضك على مشروع X")
        public DateTime CreatedAt { get; set; } // تاريخ إنشاء الـ notification
        public bool IsRead { get; set; } // هل اتقرأ؟
    }
}
