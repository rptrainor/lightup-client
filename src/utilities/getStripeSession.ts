async function getStripeSession(session_id: string) {
  if (!session_id) {
    return;
  }
  const response = await fetch(`/api/session-status?session_id=${session_id}`);
  return await response.json();
}

export default getStripeSession;