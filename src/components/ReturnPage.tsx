import { onMount, createSignal } from 'solid-js';

const ReturnPage = () => {
  const [customerEmail, setCustomerEmail] = createSignal('');
  const [showSuccess, setShowSuccess] = createSignal(false);

  onMount(async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    const response = await fetch(`/api/session-status?session_id=${sessionId}`);
    const session = await response.json();

    if (session.status === 'open') {
      window.location.replace('http://localhost:3000/checkout'); // Adjust the domain as needed
    } else if (session.status === 'complete') {
      setShowSuccess(true);
      setCustomerEmail(session.customer_email);
    }
  });

  return (
    <section id="success" classList={{ hidden: !showSuccess() }}>
      <p>
        We appreciate your business! A confirmation email will be sent to {customerEmail()}.
        If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
      </p>
    </section>
  );
};

export default ReturnPage;
