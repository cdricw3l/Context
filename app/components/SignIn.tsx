// app/components/SignIn.tsx

import { signIn } from 'next-auth/react';

const SignIn = () => {
  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    signIn('credentials', { email, password, callbackUrl: '/' });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <form onSubmit={handleSignIn} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Sign In</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" id="email" required className="mt-1 p-2 w-full border rounded" />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" name="password" id="password" required className="mt-1 p-2 w-full border rounded" />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
