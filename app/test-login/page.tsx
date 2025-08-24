import { getUser } from '@/app/lib/utils/authUtils';
import { redirect } from 'next/navigation';

export default async function TestLoginPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Login Test Page</h1>

        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h2 className="font-semibold text-green-800">✅ Login Successful!</h2>
            <p className="text-green-700 mt-2">
              User: {user.email}
              <br />
              Role: {user.role}
              <br />
              ID: {user.id}
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-blue-800">🔧 Test Instructions</h3>
            <ul className="text-blue-700 mt-2 text-sm space-y-1">
              <li>• This page should load without errors</li>
              <li>• You should see your user information</li>
              <li>• No automatic logout should occur</li>
              <li>• Page should remain stable</li>
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
