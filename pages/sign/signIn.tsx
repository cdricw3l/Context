
import "../../app/globals.css";
import { getProviders, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

const SignIn = ({ providers }: { providers: any }) => {
  const router = useRouter();
  const { error } = router.query;

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'OAuthAccountNotLinked':
        return 'To confirm your identity, sign in with the same account you used originally.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden">
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="relative">
          <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-200"></div>
          <div className="absolute bottom-0 left-20 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-400"></div>
        </div>
      </div>
      <div className="relative flex flex-row-reverse z-10 p-10 bg-opacity-80 hover: rounded-sm shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">CONTEXT</h1>
        {error && (
          <div className="mb-4 text-red-500">
            {getErrorMessage(error as string)}
          </div>
        )}
        <div className="flex flex-col items-center mt-8">
          {Object.values(providers).map((provider: any) => (
            <div key={provider.name} className="mb-4">
              <button
                onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                className="px-6 py-3 text-white rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300transition duration-300"
              >
                Sign in with {provider.name} for
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default SignIn;
