using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Investo.DataAccess.Services.Image_Loading
{
    public interface IImageLoadService
    {
        Task<string> Upload(IFormFile file);
    }
}
