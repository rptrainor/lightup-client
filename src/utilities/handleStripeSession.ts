async function getStripeSession(session_id: string | undefined) {
  if (!session_id) {
    return;
  }
  const response = await fetch(`/api/session-status?session_id=${session_id}`);
  return await response.json();
}

// The method that takes sessionId and calls getStripeSession
async function handleStripeSession(sessionId: string) {
  try {
    const sessionData = await getStripeSession(sessionId);
    return sessionData;
    // Handle the session data as needed
  } catch (error) {
    console.error('Error fetching Stripe session:', error);
    // Handle error
  }
}

export default handleStripeSession;
