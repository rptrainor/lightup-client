import { createSignal, onMount, createEffect, Match, Switch } from 'solid-js'
import { Elements } from 'solid-stripe'
import { loadStripe, type Stripe } from '@stripe/stripe-js'
import CheckoutForm from './CheckoutForm'
import { userState } from "~/stores/auth_store";

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
  const [amount, setAmount] = createSignal<number>(0)
  const [tipPercent, setTimePercent] = createSignal<number>(0);
  const [isCustomTip, setIsCustomTip] = createSignal(false);
  // IBAN: Test account number: DE89370400440532013000
  const [currency, setCurrency] = createSignal('usd');
  const [isRecurring, setIsRecurring] = createSignal(false);
  const [customerId, setCustomerId] = createSignal<string | undefined>(undefined);
  const [customerEmail, setCustomerEmail] = createSignal<string | undefined>(undefined);
  const [customerName, setCustomerName] = createSignal<string | undefined>(undefined);
  const [totalAmount, setTotalAmount] = createSignal<number>(0);


  onMount(async () => {
    const stripeResult = await loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST)
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
      totalAmount: totalAmount()
    });
  })

  return (
    <div class='flex flex-col gap-4 w-full p-4'>
      <Switch fallback={null}>
        <Match when={!clientSecret()}>
          <div class='flex gap-4 flex-wrap w-full justify-center items-baseline'>
            <button class="bg-brand_pink text-brand_black aspect-video p-2 justify-center items-center border-solid border-4 border-brand_black"><span class='h-6 w-6'>&dollar;3</span></button>
            <button class="bg-brand_pink text-brand_black aspect-video  p-2 justify-center items-center border-solid border-4 border-brand_black"><span class='h-6 w-6'>&dollar;5</span></button>

            <button class="bg-brand_pink text-brand_black aspect-video p-2 justify-center items-center border-solid border-4 border-brand_black"><span class='h-6 w-6'>&dollar;10</span></button>

            <button class="bg-brand_pink text-brand_black aspect-video p-2 justify-center items-center border-solid border-4 border-brand_black"><span class='h-6 w-6'>&dollar;25</span></button>

            <button class="bg-brand_pink text-brand_black aspect-video p-2 justify-center items-center border-solid border-4 border-brand_black"><span class='h-6 w-6'>&dollar;50</span></button>

            <button class="bg-brand_pink text-brand_black aspect-video p-2 justify-center items-center border-solid border-4 border-brand_black"><span class='h-6 w-6'>&dollar;100</span></button>

            <button class="bg-brand_pink text-brand_black aspect-video p-2 justify-center items-center border-solid border-4 border-brand_black"><span class='h-6 w-6'>&dollar;500</span></button>

            <button class="bg-brand_pink text-brand_black aspect-video p-2 justify-center items-center border-solid border-4 border-brand_black"><span class='h-6 w-6'>&dollar;1,000</span></button>

          </div>
          <form class="grid w-full max-w-sm items-center gap-1.5 mx-auto">
            <h1>How much do you want to donate?</h1>
            <div class="grid w-full max-w-sm items-center gap-1.5">
              <label>
                Enter a donation amount:
              </label>
              <input
                type='number'
                class="border p-2 rounded mt-2 text-brand_black"
                value={amount()}
                onChange={(event: Event) => setAmount(parseFloat((event.target as HTMLInputElement).value) || 0)}
              />
            </div>
            <div class="grid w-full max-w-sm items-center gap-1.5">
              <label>
                Add a tip to support Lightup (percentages are rounded to the nearest whole dollar amount):
              </label>
              <select onChange={handleTipChange} class="border p-2 rounded text-brand_black">
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
            <div class="grid w-full max-w-sm items-center gap-1.5">
              <label>
                Select currency:
              </label>
              <select onChange={(event: Event) => setCurrency((event.target as HTMLInputElement).value)} class="border p-2 rounded text-brand_black">
                <option value="usd" class='text-brand_black'>USD</option>
                <option value="eur" class='text-brand_black'>EUR</option>
              </select>
            </div>
            <div class="flex items-center py-2">
              <button onClick={() => setIsRecurring(prev => !prev)} type="button" class="bg-gray-200 aria-checked:bg-brand_pink relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand_pink focus:ring-offset-2" role="switch" aria-checked={!!isRecurring()} aria-labelledby="recurring">
                {/* <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" --> */}
                <span aria-checked={!isRecurring()} class="translate-x-0 aria-checked:translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-brand_black shadow ring-0 transition duration-200 ease-in-out"></span>
              </button>
              <label class="ml-3" id="recurring">
                <span>Make it recurring</span>
              </label>
            </div>
            <button onClick={() => handlePaymentIntent()}
              class='bg-brand_pink sm:px-6 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2 fixed sm:sticky sm:top-0 bottom-0 left-0 right-0 group z-20 max-w-[100vw]'
            >
              <h1 class="text-brand_black font-black bg-brand_pink animate-breath flex sm:flex-row-reverse flex-nowrap items-center justify-center gap-4">
                Donate
              </h1>
            </button>
          </form>
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
    </div>
  )
}
