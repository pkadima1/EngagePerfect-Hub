/**
 * @file Dashboard.jsx
 * @version 1.0.0
 * @description Dashboard page component for EngagePerfect AI
 * 
 * This component serves as the main dashboard for authenticated users,
 * displaying their subscription information, usage statistics, and 
 * providing access to the AI content generation features.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Layout from '../components/Layout';

/**
 * Dashboard page component
 * @returns {JSX.Element} - Dashboard page
 */
const Dashboard = () => {
  const { isAuthenticated, loading, userData, currentUser } = useUser();
  const navigate = useNavigate();
  
  // Default values for plan information (used if userData is incomplete)
  const planType = userData?.plan_type || 'free';
  const requestsLimit = userData?.requests_limit || 250;
  const requestsUsed = userData?.requests_used || 51;
  const requestsRemaining = requestsLimit - requestsUsed;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  // Loading state while checking authentication
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold mb-2">
            Welcome, {userData?.displayName || currentUser?.displayName || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create human-like content with the power of AI.
          </p>
        </div>

        {/* Subscription Status */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Plan</p>
              <p className="font-medium capitalize">
                {planType === 'free' ? 'Free' : planType === 'pro' ? 'Pro' : planType === 'enterprise' ? 'Enterprise' : 'Free'} Plan
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Usage</p>
              <div className="flex items-center gap-2">
                <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      requestsRemaining / requestsLimit < 0.2 ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(requestsUsed / requestsLimit) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm whitespace-nowrap">
                  {requestsUsed}/{requestsLimit} requests
                </span>
              </div>
            </div>
            {planType === 'free' && (
              <button
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
                onClick={() => {
                  // Will be implemented with Stripe integration
                  console.log('Upgrade subscription clicked');
                }}
              >
                Upgrade Plan
              </button>
            )}
          </div>
        </div>

        {/* Content Generator Placeholder */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">AI Content Generator</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Generate human-like content for your needs. Enter your prompt below:
          </p>

          <div className="mb-4">
            <textarea
              rows="4"
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your prompt here..."
            ></textarea>
          </div>

          <button
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
            onClick={() => {
              // Will be implemented in future iterations
              console.log('Generate content clicked');
            }}
          >
            Generate Content
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;