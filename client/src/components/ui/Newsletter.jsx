import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('email');
  const [submitted, setSubmitted] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input based on subscription type
    if (subscriptionType === 'email' && email.trim() === '') {
      setSubmissionMessage('Please enter a valid email address');
      return;
    }

    if (subscriptionType === 'telegram' && telegram.trim() === '') {
      setSubmissionMessage('Please enter your Telegram username');
      return;
    }

    try {
      // Send data to the appropriate API endpoint based on subscription type
      if (subscriptionType === 'email') {
        // For email subscription
        // This is just a simulation - you'd normally call an API here
        console.log('Email subscription:', email);

        // Simulate API call
        // const response = await fetch('/api/newsletter/subscribe/email', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email })
        // });
      } else {
        // For Telegram subscription
        console.log('Telegram subscription:', telegram);

        // Call the Telegram subscription API
        const response = await fetch(
          'http://localhost:3001/api/telegram/subscribe',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: telegram }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to subscribe');
        }

        console.log('Subscription response:', data);
      }

      // Show success message
      setSubmitted(true);
      setSubmissionMessage('Thank you for subscribing!');
      setEmail('');
      setTelegram('');
    } catch (error) {
      console.error('Subscription error:', error);
      setSubmissionMessage(
        error.message || 'An error occurred during subscription'
      );
    }

    // Reset after 5 seconds if it's a success
    if (submitted) {
      setTimeout(() => {
        setSubmitted(false);
        setSubmissionMessage('');
      }, 5000);
    }
  };

  return (
    <div className='max-w-3xl mx-auto text-center'>
      <div className='text-blue-200 font-medium mb-2'>STAY UPDATED</div>
      <h2 className='text-4xl font-bold text-white mb-6'>
        Join Our Newsletter
      </h2>
      <p className='text-lg text-blue-100 mb-8'>
        Subscribe to get notified about new releases, book recommendations, and
        exclusive offers.
      </p>

      {submitted ? (
        <div className='bg-green-100 text-green-800 p-4 rounded-lg max-w-lg mx-auto'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 mx-auto mb-2'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 13l4 4L19 7'
            />
          </svg>
          <p className='font-medium'>{submissionMessage}</p>
          <p className='text-sm'>
            We'll send updates to your{' '}
            {subscriptionType === 'email' ? 'inbox' : 'Telegram account'}.
          </p>
        </div>
      ) : (
        <div className='max-w-lg mx-auto'>
          {/* Subscription type toggle */}
          <div className='flex justify-center mb-4'>
            <div className='bg-black bg-opacity-30 inline-flex rounded-lg p-1'>
              <button
                type='button'
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  subscriptionType === 'email'
                    ? 'bg-white text-black'
                    : 'text-white'
                }`}
                onClick={() => setSubscriptionType('email')}
              >
                Email
              </button>
              <button
                type='button'
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                  subscriptionType === 'telegram'
                    ? 'bg-white text-black'
                    : 'text-white'
                }`}
                onClick={() => setSubscriptionType('telegram')}
              >
                <svg
                  viewBox='0 0 24 24'
                  className='w-4 h-4 mr-1 fill-current'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.18-.04-.26-.02-.11.02-1.86 1.17-5.25 3.47-.5.34-.95.51-1.36.5-.45-.01-1.3-.25-1.94-.46-.78-.26-1.4-.4-1.35-.85.03-.22.46-.45 1.3-.68 5.1-2.22 8.5-3.68 10.13-4.38 1.62-.69 3.11-1.08 3.75-.62.26.18.41.56.37.99z' />
                </svg>
                Telegram
              </button>
            </div>
          </div>

          {/* Input area */}
          <div className='flex flex-col sm:flex-row gap-2'>
            {subscriptionType === 'email' ? (
              <input
                type='email'
                placeholder='Your email address'
                className='flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-800'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <input
                type='text'
                placeholder='Your Telegram username (e.g. @username)'
                className='flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-800'
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
              />
            )}
            <button
              onClick={handleSubmit}
              className='bg-white hover:bg-gray-100 text-black font-medium px-6 py-3 rounded-lg transition-colors'
            >
              Subscribe
            </button>
          </div>

          {submissionMessage && !submitted && (
            <div className='mt-2 text-red-300 text-sm'>{submissionMessage}</div>
          )}
        </div>
      )}

      <div className='mt-6 text-blue-200 text-sm'>
        No spam, just books. You can unsubscribe at any time.
      </div>

      {/* Telegram Bot Info */}
      {subscriptionType === 'telegram' && (
        <div className='mt-4 bg-black bg-opacity-40 max-w-lg mx-auto rounded-lg p-4 text-left'>
          <div className='flex items-start'>
            <svg
              viewBox='0 0 24 24'
              className='w-6 h-6 mr-3 text-white fill-current mt-1'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.18-.04-.26-.02-.11.02-1.86 1.17-5.25 3.47-.5.34-.95.51-1.36.5-.45-.01-1.3-.25-1.94-.46-.78-.26-1.4-.4-1.35-.85.03-.22.46-.45 1.3-.68 5.1-2.22 8.5-3.68 10.13-4.38 1.62-.69 3.11-1.08 3.75-.62.26.18.41.56.37.99z' />
            </svg>
            <div>
              <h3 className='text-white font-medium text-lg'>
                How to subscribe via Telegram:
              </h3>
              <ol className='text-blue-100 list-decimal list-inside mt-2 space-y-1 text-sm'>
                <li>
                  Search for our bot{' '}
                  <span className='bg-black bg-opacity-60 text-white px-2 py-0.5 rounded'>
                    @Adilibs_bot
                  </span>{' '}
                  on Telegram
                </li>
                <li>Start a conversation with the bot by clicking "Start"</li>
                <li>
                  Type{' '}
                  <span className='bg-black bg-opacity-60 text-white px-2 py-0.5 rounded'>
                    /subscribe
                  </span>{' '}
                  to begin receiving updates
                </li>
                <li>
                  Enter your Telegram username above to complete registration
                </li>
              </ol>
              <div className='text-white text-xs mt-3'>
                Already subscribed? Type{' '}
                <span className='bg-black bg-opacity-60 text-white px-1.5 py-0.5 rounded'>
                  /help
                </span>{' '}
                to see available commands
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletter;
