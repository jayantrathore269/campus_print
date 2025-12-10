# 🖨️ CampusPrint Services: Automated Student Printing Portal
CampusPrint is a proof-of-concept (POC) single-page web application designed to simplify the printing workflow for college students. It provides instant pricing quotes and securely uploads documents directly to the owner's Google Drive. This project focuses on minimizing errors and owner intervention by automating key steps like file validation and page counting.

This project solves the problem of unreliable student printing services by providing a fully automated, client-side web application. It functions as a 24/7 digital drop-off point for campus printing needs.
The core innovation is combining client-side file scanning (using PDF.js) with serverless cloud storage (Google Apps Script). This setup ensures instant, accurate pricing for students and a streamlined, error-free workflow for the service owner.
In short, CampusPrint is a system that:
Forces Quality: Only accepts PDFs, guaranteeing correct formatting.
Calculates Cost: Automatically counts pages to prevent manual errors or disputes.
Automates Intake: Files are deposited directly into your private Google Drive for zero-touch order receiving.

## 🛠️ Technology Stack

* *Frontend:* HTML5, CSS3, Vanilla JavaScript
* *External Libraries:* PDF.js (for client-side PDF processing)
* *Backend / Storage:* Google Drive (via Google Apps Script)

  **Status Updates:** Implement SMS/WhatsApp notifications when the order is ready for pickup.
* **Payment Integration:** Integrate a simple payment link (e.g., Stripe, PayPal, or Venmo QR code display) before the final "Submit" button.

