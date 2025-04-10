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
    
    // Using a simple EmailJS-like approach with fetch to a webhook
    // This could be replaced with a direct SMTP integration using nodemailer in production
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY",
        from_name: name,
        subject: `Contact Form: ${subject}`,
        reply_to: email,
        message: `
          Name: ${name}
          Email: ${email}
          Subject: ${subject}
          Message: ${message}
        `,
        to: "chadwig87@gmail.com" // Your email address
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
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