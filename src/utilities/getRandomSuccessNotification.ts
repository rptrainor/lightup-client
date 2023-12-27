type SuccessNotification = {
  header: string;
  subHeader: string;
};

const successNotifications: SuccessNotification[] = [
  {
    header: "You Rock, Science Champion!",
    subHeader: "Your curiosity fuels groundbreaking research. Thanks for being awesome!"
  },
  {
    header: "You Rock the World of Research!",
    subHeader: "Your support is making a real difference in advancing scientific knowledge. Thank you!"
  },
  {
    header: "You Rock for Exploring New Frontiers!",
    subHeader: "Every visit, every read, contributes to the success of vital research projects. We're grateful for your support!"
  },
  {
    header: "You Rock, Knowledge Seeker!",
    subHeader: "Your engagement is invaluable in the pursuit of academic excellence and discovery. Thank you for being part of this journey!"
  },
  {
    header: "You Rock, Patron of Progress!",
    subHeader: "Your interest in these projects is a cornerstone in building a brighter, more informed world. Thanks for your support!"
  }
];

const getRandomSuccessNotification = (): SuccessNotification => {
  const randomIndex = Math.floor(Math.random() * successNotifications.length);
  return successNotifications[randomIndex];
};

export { type SuccessNotification, successNotifications, getRandomSuccessNotification };
