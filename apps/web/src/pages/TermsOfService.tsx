const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800 bg-gray-300 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="mb-4 text-sm text-gray-500">Effective Date: July 23, 2025</p>

      <p className="mb-4">
        These Terms of Service ("Terms") govern your use of the Obsidian+ Web Clipper browser extension and associated services ("Service"). By using the Service, you agree to these Terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Service</h2>
      <p className="mb-4">
        Obsidian+ Web Clipper allows you to capture and save content from the web to your local Obsidian vault or linked cloud storage. You are responsible for using the Service in compliance with all applicable laws and regulations.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. User Data</h2>
      <p className="mb-4">
        We do not collect or store personal data unless you explicitly authorize cloud storage integration (e.g., Google Drive). Even in such cases, data is accessed securely via OAuth and not retained by us.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. User Responsibilities</h2>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>You agree not to misuse the extension or interfere with its functionality.</li>
        <li>You are responsible for securing your vault and any sensitive information stored within it.</li>
        <li>You must not use the extension to store or distribute illegal or harmful content.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Intellectual Property</h2>
      <p className="mb-4">
        The Obsidian+ Web Clipper, its name, logo, and source code (excluding Obsidian itself or third-party integrations) are the intellectual property of the developer. All rights reserved.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Modifications and Updates</h2>
      <p className="mb-4">
        We may update these Terms from time to time. Continued use of the extension after changes are made constitutes your acceptance of the revised Terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Disclaimer of Warranty</h2>
      <p className="mb-4">
        The Service is provided "as is" without warranty of any kind. We do not guarantee the accuracy, reliability, or availability of the Service. Use at your own risk.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Limitation of Liability</h2>
      <p className="mb-4">
        In no event shall the developer be liable for any direct, indirect, incidental, or consequential damages arising from the use of the Service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact</h2>
      <p className="mb-4">
        If you have any questions or concerns about these Terms, please contact us at <a href="mailto:azeemkhandsari@gmail.com" className="text-blue-600 underline">azeemkhandsari@gmail.com</a>.
      </p>

      <p className="mt-10 text-sm text-gray-500">© {new Date().getFullYear()} Obsidian+ Web Clipper. All rights reserved.</p>
    </div>
  );
};

export default TermsOfService;
