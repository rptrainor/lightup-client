import { createSignal } from "solid-js";

type Props = {
  onAmountChange: (amount: number) => void;
}

const EURButtons = (props: Props) => {
  const [selectedAmount, setSelectedAmount] = createSignal<number | null>(43);

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
    return amount === null || ![43, 44, 94, 35, 21, 15, 4].includes(amount);
  };

  return (
    <fieldset class="grid grid-cols-4 gap-2">
      <legend class='pb-2'>Choose an amount:</legend>
      <label class="relative flex items-center justify-center">
        <input
          checked
          aria-checked="true"
          type="radio"
          id="43"
          name="donation_amount"
          role="radio"
          class="peer sr-only"
          value="43"
          onChange={() => handleAmountChange(43)}
        />
        <span class="absolute z-10 text-brand_black">&euro;43</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input
          type="radio"
          id="44"
          name="donation_amount"
          role="radio"
          class="peer sr-only"
          value="44"
          onChange={() => handleAmountChange(44)}
        />
        <span class="absolute z-10 text-brand_black">&euro;44</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>

      <label class="relative flex items-center justify-center">
        <input
          type="radio"
          id="94"
          name="donation_amount"
          role="radio"
          class="peer sr-only"
          value="94"
          onChange={() => handleAmountChange(94)}
        />
        <span class="absolute z-10 text-brand_black">&euro;94</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input
          type="radio"
          id="35"
          name="donation_amount"
          role="radio"
          class="peer sr-only"
          value="35"
          onChange={() => handleAmountChange(35)}
        />
        <span class="absolute z-10 text-brand_black">&euro;35</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input
          type="radio"
          id="21"
          name="donation_amount"
          role="radio"
          class="peer sr-only"
          value="21"
          onChange={() => handleAmountChange(21)}
        />
        <span class="absolute z-10 text-brand_black">&euro;21</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input
          type="radio"
          id="15"
          name="donation_amount"
          role="radio"
          class="peer sr-only"
          value="15"
          onChange={() => handleAmountChange(15)}
        />
        <span class="absolute z-10 text-brand_black">&euro;15</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input
          type="radio"
          id="4"
          name="donation_amount"
          role="radio"
          class="peer sr-only"
          value="4"
          onChange={() => handleAmountChange(4)}
        />
        <span class="absolute z-10 text-brand_black">&euro;4</span>
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
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors">
          <input
            type="number"
            min={0}
            incremental
            id="custom_amount"
            name="custom_amount"
            placeholder="€"
            checked={isCustomSelected()}
            onInput={handleCustomAmountChange}
            class={`w-full h-full text-center border-0 peer-checked:bg-brand_pink peer-checked:border-solid peer-checked:border-4 border-brand_black p-2 peer-focus:border-brand_pink peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-brand_pink transition-colors disabled:bg-gray-100 disabled:text-gray-500 ${isCustomSelected() ? 'bg-brand_pink focus:ring-2 focus:ring-brand_pink focus:ring-offset-2 focus:ring-offset-brand_white border-solid border-1' : 'bg-brand_white'}`}
          />
        </div>
      </label>
    </fieldset>
  )
}
export default EURButtons;