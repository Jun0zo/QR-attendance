import dayjs from "dayjs";

export const getTimeDifferenceInHours = (targetTime) => {
  const now = dayjs();
  const target = dayjs(targetTime);

  const differenceInMilliseconds = now.diff(target);
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

  return differenceInHours;
};
