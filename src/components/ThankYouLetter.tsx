type Props = {
  creatorName: string;
}

const ThankYouLetter = (props: Props) => {
  return (
    <div
      class='flex flex-col gap-4 bg-brand_white p-4 border-solid border-4 border-brand_black text-brand_black'
    >
      <p>Hi,</p>
      <p>
        {
          `Thank you for your generosity! You've just made a significant impact on ${props.creatorName
          }'s work. This is just the beginning of our journey together towards change. Did you know that most of our supporters feel an even deeper connection to the cause when they share their commitment with others? By using this affiliate link to invite your friends and family to join our mission, you're not only amplifying your impact but also becoming part of a larger community dedicated to making a difference. Let's create a wave of positive change together. Share your support now and watch our collective impact grow!`
        }
      </p>
      <p>
        {
          "P.S. You can also share your link on social media and in your email signature. The more people you reach, the more you can earn!"
        }
      </p>
      <img src="https://imagedelivery.net/xHZxKHrwCcaO8iTco-Njhg/14b9a8f7-9183-4768-b53f-f77cd8a87f00/small" alt="Ryan's signature" class="w-24 aspect-video mx-4" />
    </div>
  )
};

export default ThankYouLetter;