"use server";

/**
 * Server action for handling contact form submissions
 * This sends form data to the provided email address.
 */
export async function sendContactFormEmail(formData: FormData) {
  try {
    // Get form data
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    
    // Validate form data
    if (!name || !email || !subject || !message) {
      return {
        success: false,
        message: "All fields are required"
      };
    }
    
    // For now, let's use EmailJS-like service without external API
    // This is a simple email forwarding implementation that bypasses the need for API keys
    
    // Log the email data (for debugging)
    console.log("Sending email:");
    console.log(`From: ${name} <${email}>`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    // In production, you should use a proper email service
    // Examples include:
    // - EmailJS (client-side)
    // - SendGrid, Mailgun, Amazon SES (server-side)
    // - FormSubmit.co (free, no API key needed)
    
    // For now, simulate successful sending
    // In a real app, you'd make the API call here
    
    // FormSubmit.co approach - no API key needed
    const emailFormData = new FormData();
    emailFormData.append('name', name);
    emailFormData.append('email', email);
    emailFormData.append('subject', subject);
    emailFormData.append('message', message);
    
    // Send email directly to your address using formsubmit.co
    // This doesn't require API keys and works with Next.js server actions
    const response = await fetch(`https://formsubmit.co/chadwig87@gmail.com`, {
      method: 'POST',
      body: emailFormData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Handle the response
    // Note: formsubmit.co will redirect on the first submission for email confirmation
    // After confirmation, it will work normally
    if (response.ok) {
      return { 
        success: true, 
        message: "Thank you for your message! I'll get back to you soon."
      };
    } else {
      return { 
        success: false, 
        message: "There was an error sending your message. Please try again." 
      };
    }
  } catch (error) {
    console.error("Error sending contact form:", error);
    return { 
      success: false, 
      message: "There was an error sending your message. Please try again."
    };
  }
} 