type Props = {
  onClick: () => void;
}
const CheckoutInfo = (props: Props) => {
  return (
    <div class="bg-brand_white flex flex-col p-4 border-solid border-4 border-brand_black mx-auto">
      <h2 class="text-xl md:text-2xl font-bold text-center text-brand_black">
        Be A Light with a Donation
      </h2>
      <p class="text-sm md:text-base text-gray-600 mt-2">
        When you donate, a 20% "Sustainability Contribution" is added to support our operations and ensure your impact is lasting. But here's the exciting part:
      </p>
      <div class="mt-2">
        <h3 class="font-semibold text-brand_black">Earn As You Empower:</h3>
        <p class="text-sm md:text-base text-gray-600 mt-2">
          After your donation, receive a unique referral link. You earn 10% back from the Sustainability Contributions for each donation made through your link. A simple, powerful way to support more research.
        </p>
      </div>
      <div class="mt-2">
        <h3 class="font-semibold text-brand_black">Get Two, Get It All Back:</h3>
        <p class="text-sm md:text-base text-gray-600 mt-2">
          Just two successful donations via your link return your full 20% Sustainability Contribution! It's easy and impactful.
        </p>
      </div>
      <div class="mt-2">
        <h3 class="font-semibold text-brand_black">Passive Income for Passionate Support:</h3>
        <p class="text-sm md:text-base text-gray-600 mt-2">
          Continue to earn 10% from all Sustainability Contributions made with your link — forever! A lucrative way to make ongoing, extra money while championing the science you care about.
        </p>
      </div>
      <button 
        onClick={props.onClick}
        class='bg-brand_pink px-4 sm:px-6 py-2 border-4 border-brand_black text-sm md:text-base w-full mt-2 uppercase gap-2'
      >
        <p class="text-brand_black font-black bg-brand_pink animate-breath flex flex-row-reverse flex-nowrap items-center justify-center gap-4">
          Start Donating, Start Earning
        </p>
      </button>
    </div>
  );
};

export default CheckoutInfo;
