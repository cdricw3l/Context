import { signIn } from 'next-auth/react';
import { useState } from 'react';

const SignIn = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const rep = await signIn('credentials', { email, password, callbackUrl: '/' });
    if (!rep) {
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      setErrorMessage('Sign in failed. Please try again.');
      console.log('attemptCount:', newAttemptCount);
      if (attemptCount >= 3) {
        window.location.href = '/error';
      }
    } 
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    console.log(email, password);
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      await signIn('credentials', { email, password, callbackUrl: '/' });
    } else {
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <form onSubmit={isRegistering ? handleRegister : handleSignIn} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl text-blue-500 mb-4">{isRegistering ? 'Register' : 'Sign In'}</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" id="email" required className="text-blue-500 mt-1 p-2 w-full border rounded" />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" name="password" id="password" required className="text-blue-500 mt-1 p-2 w-full border rounded" />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">{isRegistering ? 'Register' : 'Sign In'}</button>
        <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="w-full bg-gray-500 text-white p-2 rounded mt-2">
          {isRegistering ? 'Switch to Sign In' : 'Switch to Register'}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
