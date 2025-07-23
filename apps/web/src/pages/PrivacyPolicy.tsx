const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800 bg-gray-300 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="mb-4 text-sm text-gray-500">
        Effective Date: July 23, 2025
      </p>

      <p className="mb-4">
        Obsidian+ Web Clipper is committed to protecting your privacy. This
        policy explains how your data is handled when using the extension.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. What Data We Collect
      </h2>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <strong>Identity:</strong> If you connect a cloud provider (e.g.,
          Google Drive), we request your email for authentication purposes only.
        </li>
        <li>
          <strong>Clipped Content:</strong> All content you clip is stored
          locally on your device or in your connected cloud storage. We do not
          store any content on our servers.
        </li>
        <li>
          <strong>Settings:</strong> Your vault path, user preferences, and
          configurations are stored locally using Chrome’s storage APIs.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. What We Don’t Do</h2>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          We do <strong>not collect</strong>, track, or sell your personal data.
        </li>
        <li>
          We do <strong>not use analytics</strong> or third-party trackers.
        </li>
        <li>
          We do <strong>not store or transmit</strong> any clipped content to
          external servers.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Permissions Explanation
      </h2>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <strong>nativeMessaging:</strong> Allows communication with the native
          host app to save data to your Obsidian vault.
        </li>
        <li>
          <strong>activeTab, scripting, tabs:</strong> Enables capturing content
          from your current browser tab.
        </li>
        <li>
          <strong>contextMenus:</strong> Adds right-click clip options on pages.
        </li>
        <li>
          <strong>storage:</strong> Saves user preferences like vault paths,
          templates, etc.
        </li>
        <li>
          <strong>identity, identity.email:</strong> Used for optional
          authentication when integrating cloud sync (Google Drive, Dropbox,
          etc).
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Cloud Access (Optional)
      </h2>
      <p className="mb-4">
        When you choose to link a cloud provider, Obsidian+ uses secure OAuth to
        connect. All access is limited to your own files and can be revoked at
        any time from your provider’s dashboard.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Contact</h2>
      <p className="mb-4">
        If you have any questions or concerns regarding this privacy policy,
        please contact us at{' '}
        <a href="mailto:azeemkhandsari@gmail.com" className="text-blue-600 underline">
          azeemkhandsari@gmail.com
        </a>
        .
      </p>

      <p className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Obsidian+ Web Clipper
      </p>
    </div>
  )
}

export default PrivacyPolicy
