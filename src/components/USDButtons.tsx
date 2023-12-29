export const prerender = true;

import { createSignal } from "solid-js";

type Props = {
  onAmountChange: (amount: number) => void;
}

const USDButtons = (props: Props) => {
  const [selectedAmount, setSelectedAmount] = createSignal<number | null>(47);

  const handleAmountChange = (amount: number) => {
    setSelectedAmount(amount);
    props.onAmountChange(amount);
  };

  const handleCustomAmountChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    const numValue = value ? parseInt(value, 10) : null;

    setSelectedAmount(numValue);

    if (numValue !== null) {
      props.onAmountChange(numValue);
    }
  };

  const isCustomSelected = () => {
    const amount = selectedAmount();
    return amount === null || ![47, 72, 106, 39, 23, 17, 6].includes(amount);
  };


  return (
    <fieldset class="grid grid-cols-4 gap-2">
      <legend class='pb-2'>Choose an amount (100% of this amount goes to your cause):</legend>
      <label class="relative flex items-center justify-center">
        <input
          checked
          aria-checked="true"
          type="radio"
          id="47"
          name="donation_amount"
          role="radio"
          class="peer sr-only"
          value="47"
          onChange={() => handleAmountChange(47)}
        />
        <span class="absolute z-10 text-brand_black text-center">&dollar;47</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input
          type="radio"
          id="72"
          name="donation_amount"
          role="radio"
          class="peer sr-only"
          value="72"
          onChange={() => handleAmountChange(72)}
        />
        <span class="absolute z-10 text-brand_black text-center">&dollar;72</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>

      <label class="relative flex items-center justify-center">
        <input
          type="radio"
          id="106"
          name="donation_amount"
          role="radio"
          class="peer sr-only"
          value="106"
          onChange={() => handleAmountChange(106)}
        />
        <span class="absolute z-10 text-brand_black text-center">&dollar;106</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input
          type="radio"
          id="39"
          name="donation_amount"
          role="radio"
          class="peer sr-only"
          value="39"
          onChange={() => handleAmountChange(39)}
        />
        <span class="absolute z-10 text-brand_black text-center">&dollar;39</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input
          type="radio"
          id="23"
          name="donation_amount"
          role="radio"
          class="peer sr-only"
          value="23"
          onChange={() => handleAmountChange(23)}
        />
        <span class="absolute z-10 text-brand_black text-center">&dollar;23</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input
          type="radio"
          id="17"
          name="donation_amount"
          role="radio"
          class="peer sr-only"
          value="17"
          onChange={() => handleAmountChange(17)}
        />
        <span class="absolute z-10 text-brand_black text-center">&dollar;17</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input
          type="radio"
          id="6"
          name="donation_amount"
          role="radio"
          class="peer sr-only"
          value="6"
          onChange={() => handleAmountChange(6)}
        />
        <span class="absolute z-10 text-brand_black text-center">&dollar;6</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      {/* Custom amount input */}
      <label class="relative flex flex-col items-center justify-center text-brand_black">
        <input
          type="radio"
          id="custom_amount_radio"
          name="donation_amount"
          role="radio"
          class="peer sr-only"
          value="custom"
          checked={isCustomSelected()}
          onChange={handleCustomAmountChange}
        />
        <span class="absolute z-10 text-brand_black text-center">&dollar;420</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors">
          <input
            type="number"
            min={0}
            incremental
            id="custom_amount"
            name="custom_amount"
            placeholder="$"
            checked={isCustomSelected()}
            onInput={handleCustomAmountChange}
            class={`w-full h-full text-center border-0 peer-checked:bg-brand_pink peer-checked:border-solid peer-checked:border-4 border-brand_black p-2 peer-focus:border-brand_pink peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-brand_pink transition-colors disabled:bg-gray-100 disabled:text-gray-500 ${isCustomSelected() ? 'bg-brand_pink focus:ring-2 focus:ring-brand_pink focus:ring-offset-2 focus:ring-offset-brand_white border-solid border-1' : 'bg-brand_white'}`}
          />
        </div>
      </label>
    </fieldset>
  )
}
export default USDButtons;