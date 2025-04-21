/**
 * @file ResetPassword.jsx
 * @version 1.0.0
 * @description Password reset page component for EngagePerfect AI
 * 
 * This component provides a form for users to request a password reset email.
 * It utilizes Firebase Authentication's password reset functionality.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../utils/authUtils';
import Layout from '../components/Layout';

/**
 * Password reset page component
 * @returns {JSX.Element} - Password reset page
 */
const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle password reset request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Reset your password</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center space-y-6">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
              Password reset email sent! Check your inbox for further instructions.
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={handleSubmit}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium"
              >
                try again
              </button>
              .
            </p>
            <Link
              to="/login"
              className="block text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium"
            >
              Return to sign in
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
              >
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ResetPassword;