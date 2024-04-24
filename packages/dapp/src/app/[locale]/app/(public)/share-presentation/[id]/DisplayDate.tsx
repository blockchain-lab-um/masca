export const DisplayDate = ({ text, date }: { text: string; date: string }) => {
  const parsed = Date.parse(date);
  return (
    <div className="flex flex-col items-start space-y-0.5">
      <h2 className="dark:text-navy-blue-200 pr-2 font-bold text-gray-800">
        {text}:
      </h2>
      <h3 className="text-md dark:text-navy-blue-200 text-gray-700">
        {!Number.isNaN(parsed) ? new Date(parsed).toLocaleDateString() : date}
      </h3>
    </div>
  );
};
