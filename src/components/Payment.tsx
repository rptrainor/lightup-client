import { createSignal, onMount, createEffect, Match, Switch, Show } from 'solid-js'
import { Elements } from 'solid-stripe'
import { loadStripe, type Stripe } from '@stripe/stripe-js'
import CheckoutForm from './CheckoutForm'
import { userState } from "~/stores/auth_store";
import USDButtons from './USDButtons';

type HandlePaymentIntentProps = {
  tipPercent: number,
  amount: number,
  currency: string,
  totalAmount: number,
  referring_userId: string | undefined,
  projectId: string
}

type CreateCustomerProps = {
  email: string;
  name: string | undefined;
}

type CreateSubscriptionProps = {
  customerId: string;
  priceId: string;
  amount: number;
  tipPercent: number;
  referring_userId: string | undefined,
  projectId: string,
  totalAmount: number,
  currency: string
}

type CreateSubscriptionResponse = {
  subscriptionId: string;
  clientSecret: string;
}

type PaymentProps = {
  referring_userId: string | undefined,
  projectId: string
}

//* ABOUT PAYMENTS
//* THIS COMPONENT CALCULATES THREE POTENTIAL PAYMENT AMOUNT NUMBERS:
//* 1. THE DONATION AMOUNT (THE AMOUNT THE USER WANTS TO DONATE)
//* IN THIS COMPONENT AMOUNT IS ALWAYS STORED AS A WHOLE DOLLAR OR EURO AMOUNT
//* 2. THE TIP AMOUNT (THE AMOUNT THE USER WANTS TO TIP)
//* IN THIS COMPONENT TIP IS ALWAYS STORED AS A VALUE BETWEEN 0 AND 1, REPRESENTING A PERCENTAGE OF THE DONATION AMOUNT VALUE
//* 3. THE TOTAL AMOUNT (DONATION + TIP)
//* IN THIS COMPONENT TOTAL AMOUNT IS ALWAYS STORED AS A WHOLE DOLLAR OR EURO AMOUNT

export default function Payment(props: PaymentProps) {
  const [stripe, setStripe] = createSignal<Stripe | null>(null)
  const [clientSecret, setClientSecret] = createSignal<string | undefined>(undefined)
  const [amount, setAmount] = createSignal<number>(47)
  const [tipPercent, setTimePercent] = createSignal<number>(0.2);
  const [isCustomTip, setIsCustomTip] = createSignal(false);
  const [currency, setCurrency] = createSignal('usd');
  const [isRecurring, setIsRecurring] = createSignal(false);
  const [customerId, setCustomerId] = createSignal<string | undefined>(undefined);
  const [customerEmail, setCustomerEmail] = createSignal<string | undefined>(undefined);
  const [customerName, setCustomerName] = createSignal<string | undefined>(undefined);
  const [totalAmount, setTotalAmount] = createSignal<number>(56);

  onMount(async () => {
    const stripeResult = await loadStripe(import.meta.env.DEV ? import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST : import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE)
    setStripe(stripeResult)
  })

  async function createCustomer({ email, name }: CreateCustomerProps): Promise<{ customerId: string | undefined, customerEmail: string | undefined, customerName: string | undefined } | undefined> {
    try {
      const response = await fetch('/api/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        customerId: data.customerId,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
      };
    } catch (error) {
      console.error("Error creating customer:", error);
      return undefined;
    }
  }

  async function createPaymentIntent({
    tipPercent,
    amount,
    currency,
    totalAmount,
  }: HandlePaymentIntentProps): Promise<string | undefined> {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, currency, tipPercent, totalAmount, referring_userId: props.referring_userId, projectId: props.projectId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      return undefined;
    }
  }

  function handleTipChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if (value === 'custom') {
      setIsCustomTip(true)
      return;
    }
    setTimePercent(parseFloat(value));
  }

  const handlePaymentIntent = async () => {
    // Safely access user state
    const user = userState();
    if (user && user.user && user.user.email) {
      const customerResponse = await createCustomer({ email: user.user.email, name: user.user.name ?? user.user.full_name });
      if (!customerResponse) {
        console.error("Failed to create customer");
        return;
      }

      // Now that we have checked customerResponse is not undefined, we can destructure it
      const { customerId, customerEmail, customerName } = customerResponse;
      setCustomerId(customerId);
      setCustomerEmail(customerEmail);
      setCustomerName(customerName);
    } else {
      console.error("User email is not available");
    }

    const currentCustomerId = customerId();
    if (!currentCustomerId) {
      console.error("Customer ID is not available");
      return;
    }

    if (isRecurring()) {
      const priceId = import.meta.env.DEV ? import.meta.env.PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID_TEST : import.meta.env.PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID_LIVE;

      const subscriptionResponse = await createSubscription({
        customerId: currentCustomerId,
        priceId,
        amount: amount(),
        tipPercent: tipPercent(),
        referring_userId: props.referring_userId,
        projectId: props.projectId,
        totalAmount: totalAmount(),
        currency: currency()
      });

      if (!subscriptionResponse) {
        console.error("Failed to create subscription");
        return;
      }
      setClientSecret(subscriptionResponse.clientSecret);
    } else {
      // One-time payment logic
      const secret = await createPaymentIntent({
        amount: amount(),
        currency: currency(),
        tipPercent: tipPercent(),
        totalAmount: totalAmount(),
        referring_userId: props.referring_userId,
        projectId: props.projectId
      });
      setClientSecret(secret);
    }
  }

  async function createSubscription({ customerId, priceId, amount, tipPercent, totalAmount }: CreateSubscriptionProps): Promise<CreateSubscriptionResponse | undefined> {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId,
          priceId,
          amount,
          tipPercent,
          totalAmount,
          referring_userId: props.referring_userId,
          projectId: props.projectId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        subscriptionId: data.subscriptionId,
        clientSecret: data.clientSecret
      };

    } catch (error) {
      console.error("Error creating subscription:", error);
      return undefined;
    }
  }

  // Handler for donation amount change
  const handleDonationAmountChange = (amount: number) => {
    setAmount(amount);
  };

  // Handler for recurring payment option
  const handleRecurringChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    setIsRecurring(value === 'yes');
  };

  const handleCurrencyChange = (value: string) => {
    const newAmount = value === 'usd' ? 47 : 43
    setCurrency(value);
    setAmount(newAmount)
  }

  createEffect(() => {
    // Calculate and set total amount
    const calculatedTotalAmount = amount() + (amount() * tipPercent());
    //* THIS IS THE ONLY LOCATION IN THIS COMPONENT WHERE ANY VALUE IS ROUNDED TO THE NEAREST DOLLAR OR EURO
    const roundedTotalAmount = Math.round(calculatedTotalAmount);
    setTotalAmount(roundedTotalAmount);
  });

  createEffect(() => {
    console.log("Payment:", {
      amount: amount(),
      currency: currency(),
      tipPercent: tipPercent(),
      isCustomTip: isCustomTip(),
      isRecurring: isRecurring(),
      totalAmount: totalAmount(),
    });
  })

  return (
    <Switch fallback={null}>
      <Match when={!clientSecret()}>
        <div class='flex flex-col gap-4 w-full p-4 mx-auto max-w-sm'>
          {/* Donation Amount Buttons */}
          <USDButtons onAmountChange={handleDonationAmountChange} />
          {/* Recurring Payment Option */}
          <div class="grid w-full items-center gap-1.5">
            <label class="">
              Make it monthly!
            </label>
            <fieldset class="grid grid-cols-2 gap-2">
              <label class="relative flex items-center justify-center">
                <input type="radio" onChange={handleRecurringChange} id="yes" name="sustaining membership" role="radio" class="peer sr-only" value="yes" />
                <span class="absolute z-10 text-brand_black">Yes, Let's go!</span>
                <div class="w-full h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
              </label>
              <label class="relative flex items-center justify-center">
                <input checked type="radio" onChange={handleRecurringChange} id="no" name="sustaining membership" role="radio" class="peer sr-only" value={"no"} />
                <span class="absolute z-10 text-brand_black">No, give once</span>
                <div class="w-full h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
              </label>
            </fieldset>
          </div>

          <div class="grid w-full items-center gap-1.5">
            {/* Tip Selection */}
            <select onChange={handleTipChange} class="w-full border-4 border-brand_black bg-brand_white text-brand_black p-2 hover:border-brand_pink focus:border-brand_pink focus:ring focus:ring-brand_pink focus:ring-opacity-50 transition ease-in-out duration-150">
              <option value={0}>0%</option>
              <option value={0.05}>5%</option>
              <option value={0.1}>10%</option>
              <option value={0.15}>15%</option>
              <option value={0.2} selected>20%</option>
              <option value={0.25}>25%</option>
              <option value={0.3}>30%</option>
              <option value={0.35}>35%</option>
              <option value={0.4}>40%</option>
              <option value={0.45}>45%</option>
              <option value={0.5}>50%</option>
              <option value={0.55}>55%</option>
              <option value={0.6}>60%</option>
              <option value={0.65}>65%</option>
              <option value={0.7}>70%</option>
              <option value={0.75}>75%</option>
              <option value={0.8}>80%</option>
              <option value={0.85}>85%</option>
              <option value={0.9}>90%</option>
              <option value={0.95}>95%</option>
              <option value={1}>100%</option>
            </select>
          </div>
          {/* Submit Button */}
          <button onClick={() => handlePaymentIntent()}
            class='bg-brand_pink sm:px-6 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2'
          >
            <h1 class="text-brand_black font-black bg-brand_pink animate-breath flex sm:flex-row-reverse flex-nowrap items-center justify-center gap-4">
              Donate
            </h1>
          </button>
        </div>
      </Match>
      <Match when={stripe() && clientSecret()}>
        <Elements stripe={stripe()} clientSecret={clientSecret()}>
          <CheckoutForm
            customerId={customerId()}
            customerEmail={customerEmail()}
            customerName={customerName()}
            setCustomerEmail={setCustomerEmail}
          />
        </Elements>
      </Match>
    </Switch>
  )
}
