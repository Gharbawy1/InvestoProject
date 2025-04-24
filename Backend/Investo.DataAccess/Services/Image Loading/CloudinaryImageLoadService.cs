using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace Investo.DataAccess.Services.Image_Loading
{
    public class CloudinaryImageLoadService : IImageLoadService
    {
        const string cloud = "dhnlpsrf4";
        const string ApiKey = "527911327834983";
        const string ApiSecret = "X9zNKVaqzHYgZYtG1THmLiiMqhU";

        private readonly Cloudinary _cloudinary;

        public CloudinaryImageLoadService()
        {
            var account = new Account(cloud, ApiKey, ApiSecret);
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
