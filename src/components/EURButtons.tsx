const EURButtons = () => {
  return (
    <fieldset class="grid grid-cols-4 gap-2">
      <legend class='pb-2'>Choose an amount:</legend>
      <label class="relative flex items-center justify-center">
        <input checked aria-checked="true" type="radio" id="43" name="donation_amount" role="radio" class="peer sr-only" value="43" />
        <span class="absolute z-10 text-brand_black">&euro;43</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input type="radio" id="64" name="donation_amount" role="radio" class="peer sr-only" value="64" />
        <span class="absolute z-10 text-brand_black">&euro;64</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>

      <label class="relative flex items-center justify-center">
        <input type="radio" id="96" name="donation_amount" role="radio" class="peer sr-only" value="96" />
        <span class="absolute z-10 text-brand_black">&euro;96</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input type="radio" id="35" name="donation_amount" role="radio" class="peer sr-only" value="35" />
        <span class="absolute z-10 text-brand_black">&euro;35</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input type="radio" id="21" name="donation_amount" role="radio" class="peer sr-only" value="21" />
        <span class="absolute z-10 text-brand_black">&euro;21</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input type="radio" id="15" name="donation_amount" role="radio" class="peer sr-only" value="15" />
        <span class="absolute z-10 text-brand_black">&euro;15</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input type="radio" id="5" name="donation_amount" role="radio" class="peer sr-only" value="5" />
        <span class="absolute z-10 text-brand_black">&euro;5</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      {/* Custom amount input */}
      <label class="relative flex flex-col items-center justify-center text-brand_black">
        <input type="radio" id="custom_amount_radio" name="donation_amount" role="radio" class="peer sr-only" value="custom" />
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors">
          <input type="number" id="custom_amount" name="custom_amount" placeholder="€" class="w-full h-full text-center border-0 peer-checked:bg-brand_pink peer-checked:border-solid peer-checked:border-4 border-brand_black p-2 peer-focus:border-brand_pink peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-brand_pink transition-colors disabled:bg-gray-100 disabled:text-gray-500" />
        </div>
      </label>
    </fieldset>
  )
}
export default EURButtons;