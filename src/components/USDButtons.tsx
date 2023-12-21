const USDButtons = () => {
  return (
    <fieldset class="grid grid-cols-4 gap-2">
      <legend class='pb-2'>Choose an amount:</legend>
      <label class="relative flex items-center justify-center">
        <input checked aria-checked="true" type="radio" id="50" name="donation_amount" role="radio" class="peer sr-only" value="50" />
        <span class="absolute z-10 text-brand_black">&dollar;47</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input type="radio" id="75" name="donation_amount" role="radio" class="peer sr-only" value="75" />
        <span class="absolute z-10 text-brand_black">&dollar;72</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>

      <label class="relative flex items-center justify-center">
        <input type="radio" id="100" name="donation_amount" role="radio" class="peer sr-only" value="100" />
        <span class="absolute z-10 text-brand_black">&dollar;106</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input type="radio" id="40" name="donation_amount" role="radio" class="peer sr-only" value="40" />
        <span class="absolute z-10 text-brand_black">&dollar;39</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input type="radio" id="25" name="donation_amount" role="radio" class="peer sr-only" value="25" />
        <span class="absolute z-10 text-brand_black">&dollar;23</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input type="radio" id="15" name="donation_amount" role="radio" class="peer sr-only" value="15" />
        <span class="absolute z-10 text-brand_black">&dollar;17</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      <label class="relative flex items-center justify-center">
        <input type="radio" id="10" name="donation_amount" role="radio" class="peer sr-only" value="10" />
        <span class="absolute z-10 text-brand_black">&dollar;6</span>
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
      </label>
      {/* Custom amount input */}
      <label class="relative flex flex-col items-center justify-center text-brand_black">
        <input type="radio" id="custom_amount_radio" name="donation_amount" role="radio" class="peer sr-only" value="custom" />
        <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors">
          <input type="number" id="custom_amount" name="custom_amount" placeholder="$" class="w-full h-full text-center border-0 peer-checked:bg-brand_pink peer-checked:border-solid peer-checked:border-4 border-brand_black p-2 peer-focus:border-brand_pink peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-brand_pink transition-colors disabled:bg-gray-100 disabled:text-gray-500" />
        </div>
      </label>
    </fieldset>
  )
}
export default USDButtons;