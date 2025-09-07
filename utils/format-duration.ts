export const formatDuration = (hours: number | undefined) => {
  if (!hours || hours <= 0) return "-";

  const totalSeconds = Math.round(hours * 3600);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  let result = "";
  if (h > 0) result += `${h} hr `;
  if (m > 0) result += `${m} min `;
  if (s > 0 && h === 0) result += `${s} sec`;

  return result.trim();
};
