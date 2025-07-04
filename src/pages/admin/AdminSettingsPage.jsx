import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailUpdates: true,
    twoFactorAuth: false
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Settings saved successfully");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800">Admin Settings</h3>
        <p className="text-sm md:text-base text-gray-600">Manage your admin panel preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="space-y-3 md:space-y-4">
          <h4 className="text-base md:text-lg font-medium text-gray-900">General Settings</h4>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-3 border-b border-gray-100">
            <div className="flex-1">
              <label htmlFor="notifications" className="block text-xs md:text-sm font-medium text-gray-700">
                Enable Notifications
              </label>
              <p className="text-xs md:text-sm text-gray-500">Get alerts for important activities</p>
            </div>
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="h-5 w-10 md:h-6 md:w-11 rounded-full bg-gray-200 appearance-none checked:bg-yellow-600 transition-colors duration-200"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-3 border-b border-gray-100">
            <div className="flex-1">
              <label htmlFor="darkMode" className="block text-xs md:text-sm font-medium text-gray-700">
                Dark Mode
              </label>
              <p className="text-xs md:text-sm text-gray-500">Switch to dark theme</p>
            </div>
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="darkMode"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleChange}
                className="h-5 w-10 md:h-6 md:w-11 rounded-full bg-gray-200 appearance-none checked:bg-yellow-600 transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <h4 className="text-base md:text-lg font-medium text-gray-900">Security</h4>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-3 border-b border-gray-100">
            <div className="flex-1">
              <label htmlFor="twoFactorAuth" className="block text-xs md:text-sm font-medium text-gray-700">
                Two-Factor Authentication
              </label>
              <p className="text-xs md:text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="twoFactorAuth"
                name="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onChange={handleChange}
                className="h-5 w-10 md:h-6 md:w-11 rounded-full bg-gray-200 appearance-none checked:bg-yellow-600 transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <h4 className="text-base md:text-lg font-medium text-gray-900">Email Preferences</h4>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-3 border-b border-gray-100">
            <div className="flex-1">
              <label htmlFor="emailUpdates" className="block text-xs md:text-sm font-medium text-gray-700">
                Email Updates
              </label>
              <p className="text-xs md:text-sm text-gray-500">Receive weekly summary emails</p>
            </div>
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="emailUpdates"
                name="emailUpdates"
                checked={settings.emailUpdates}
                onChange={handleChange}
                className="h-5 w-10 md:h-6 md:w-11 rounded-full bg-gray-200 appearance-none checked:bg-yellow-600 transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 md:pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm md:text-base"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}