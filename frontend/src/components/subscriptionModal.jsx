import { paymentService } from "../services/api";
import { authService } from '../services/api';

const SubscriptionModal = ({ visible, onClose, onSelectPlan, currentPlan }) => {
  if (!visible) return null;

  const plans = [
    {
      key: 'FREE',
      name: 'Free',
      price: '$0',
      features: [
        '5 searches/month',
        'Basic support'
      ]
    },
    {
      key: 'BASIC',
      name: 'Basic',
      price: '$29/mo',
      features: [
        '100 searches/month',
        'Advanced filters',
        'Real-time updates',
        'Analytics access'
      ]
    },
    {
      key: 'PRO',
      name: 'Pro',
      price: '$79/mo',
      features: [
        '500 searches/month',
        'Advanced filters',
        'Priority support',
        'Real-time updates',
        'Custom matching algorithm',
        'Bulk operations',
        'Analytics access',
        'API access'
      ]
    },
    {
      key: 'ENTERPRISE',
      name: 'Enterprise',
      price: '$199/mo',
      features: [
        'Unlimited searches',
        'Advanced filters',
        'Priority support',
        'Real-time updates',
        'Custom matching algorithm',
        'Bulk operations',
        'Analytics access',
        'API access',
        'Custom integrations',
        'Dedicated support'
      ]
    }
  ];

  const handlePlanClick = async (planKey) => {
  try {
    const user = authService.getCurrentUser();
    if (!user?.token) {
      alert('Please login first');
      return;
    }

    console.log('Attempting checkout for:', planKey); // Debug
    const response = await paymentService.createCheckoutSession(planKey);
    
    if (!response.url) {
      throw new Error('No checkout URL received');
    }

    // Store session ID for verification
    const sessionId = new URL(response.url).searchParams.get('session_id');
    localStorage.setItem('current_payment_session', sessionId);
    
    window.location.href = response.url;
  } catch (err) {
    console.error('Full error:', {
      error: err,
      response: err.response?.data
    });
    alert(`Payment failed: ${err.response?.data?.error || err.message}`);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full relative px-5">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Choose a Subscription Plan</h2>
        <div className="flex justify-center gap-4">
          {plans.map(plan => (
            <div
              key={plan.key}
              className={`border rounded-lg p-4 cursor-pointer transition-all flex-1 min-w-[250px] ${
                currentPlan === plan.key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
              onClick={() => handlePlanClick(plan.key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handlePlanClick(plan.key)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-lg">{plan.name}</div>
                  <div className="text-gray-500">{plan.price}</div>
                </div>
                {currentPlan === plan.key && (
                  <span className="text-blue-600 font-bold">Current</span>
                )}
              </div>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                {plan.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <button
          className="mt-6 max-w-md w-full flex justify-center mx-auto bg-blue-600 
          text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SubscriptionModal;