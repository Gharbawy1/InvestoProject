using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Investo.Entities.Models.Config;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Investo.DataAccess.Services.Image_Loading
{
    public class CloudinaryImageLoadService : IImageLoadService
    {
        private readonly Cloudinary _cloudinary;
        private readonly CloudinarySettings _cloudinarySettings;
        public CloudinaryImageLoadService(IOptions<CloudinarySettings> Cloudinaryoptions)
        {
            _cloudinarySettings = Cloudinaryoptions.Value ?? throw new ArgumentNullException(nameof(Cloudinaryoptions));
            var account = new Account(_cloudinarySettings.CloudName, _cloudinarySettings.ApiKey, _cloudinarySettings.ApiSecret);
            
            _cloudinary = new Cloudinary(account);
            _cloudinary.Api.Secure = true;
        }

        public async Task<string> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty or null");

            await using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, memoryStream)
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result == null)
                throw new Exception("Upload result was null from Cloudinary.");

            if (result.Error != null)
                throw new Exception($"Cloudinary error occurred: {result.Error.Message}");

            return result.Url?.ToString() ?? throw new Exception("Cloudinary returned empty URL.");
        }
    }
}
