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
    
    // Log the email data (for debugging)
    console.log("Sending email:");
    console.log(`From: ${name} <${email}>`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    // Create form data for FormSubmit.co
    const emailFormData = new FormData();
    emailFormData.append('name', name);
    emailFormData.append('email', email);
    emailFormData.append('_subject', subject); // FormSubmit uses _subject
    emailFormData.append('message', message);
    
    // Important FormSubmit.co configuration options
    emailFormData.append('_captcha', 'false'); // Disable captcha
    emailFormData.append('_template', 'box'); // Use the "box" template
    emailFormData.append('_replyto', email); // Set reply-to as sender's email
    
    // Using the proper FormSubmit.co endpoint
    // The hash at the end is to avoid spam filtering
    const response = await fetch(`https://formsubmit.co/chadwig87@gmail.com`, {
      method: 'POST',
      body: emailFormData,
      // Don't set 'Accept': 'application/json' as FormSubmit returns HTML by default
    });
    
    // Handle the response - FormSubmit returns HTTP 302 on success for the first submission
    // and HTTP 200 for subsequent submissions after email confirmation
    if (response.ok || response.status === 302) {
      return { 
        success: true, 
        message: "Thank you for your message! I'll get back to you soon."
      };
    } else {
      console.error("Form submission failed with status:", response.status);
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