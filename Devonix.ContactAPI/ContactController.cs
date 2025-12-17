using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text.Json;

namespace Devonix.ContactAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public ContactController(IConfiguration configuration)
        {
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ContactFormModel model)
        {
            // Basic validation
            if (!ModelState.IsValid)
                return BadRequest(new { error = "All fields are required." });

            // Verify reCAPTCHA
            var recaptchaSecret = _configuration["RECAPTCHA_SECRET_KEY"];
            var recaptchaResponse = await _httpClient.PostAsync(
                $"https://www.google.com/recaptcha/api/siteverify?secret={recaptchaSecret}&response={model.RecaptchaToken}",
                null
            );

            var recaptchaResult = JsonSerializer.Deserialize<RecaptchaResponse>(
                await recaptchaResponse.Content.ReadAsStringAsync()
            );

            if (!recaptchaResult.Success)
                return BadRequest(new { error = "reCAPTCHA verification failed." });

            // Send email via SendGrid
            var sendGridKey = _configuration["SENDGRID_API_KEY"];
            var client = new SendGridClient(sendGridKey);
            var from = new EmailAddress("noreply@devonix.com", "Devonix Contact Form");
            var subject = $"New Contact Form Submission from {model.Name}";
            var to = new EmailAddress("devonix.sa@gmail.com", "Devonix");
            var htmlContent = $@"
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> {model.Name}</p>
                <p><strong>Company:</strong> {model.Company}</p>
                <p><strong>Email:</strong> {model.Email}</p>
                <p><strong>Phone:</strong> {model.Phone}</p>
                <p><strong>Message:</strong><br/>{model.Message}</p>
            ";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, "", htmlContent);
            var response = await client.SendEmailAsync(msg);

            if (response.IsSuccessStatusCode)
                return Ok(new { message = "Message sent successfully" });
            else
                return StatusCode(500, new { error = "Failed to send email" });
        }
    }

    public class ContactFormModel
    {
        public string Name { get; set; }
        public string Company { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Message { get; set; }
        public string RecaptchaToken { get; set; }
    }

    public class RecaptchaResponse
    {
        public bool Success { get; set; }
        public string[] ErrorCodes { get; set; }
    }
}
