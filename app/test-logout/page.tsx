import { getUser } from '@/app/lib/utils/authUtils';
import { redirect } from 'next/navigation';
import LogoutButton from '@/app/components/auth/LogoutButton';

export default async function TestLogoutPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Logout Test Page</h1>

        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h2 className="font-semibold text-green-800">✅ User Logged In</h2>
            <p className="text-green-700 mt-2">
              User: {user.email}
              <br />
              Role: {user.role}
              <br />
              ID: {user.id}
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-blue-800">🔧 Logout Test</h3>
            <p className="text-blue-700 mt-2 text-sm">
              Click the logout button below to test the logout functionality:
            </p>
            <div className="mt-4">
              <LogoutButton
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors text-center"
                showIcon={true}
                showText={true}
              />
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold text-yellow-800">📝 Expected Behavior</h3>
            <ul className="text-yellow-700 mt-2 text-sm space-y-1">
              <li>• Button should show loading state</li>
              <li>• Session should be cleared</li>
              <li>• Should redirect to login page</li>
              <li>• Page should reload for clean state</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <a
              href="/"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600 transition-colors"
            >
              Go to Home
            </a>
            <a
              href="/admin"
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded text-center hover:bg-green-600 transition-colors"
            >
              Go to Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
