type BasicNotFoundProps = {
  text: string;
};

const BasicNotFound = ({ text }: BasicNotFoundProps) => (
  <div className="dark:bg-navy-blue-800 flex flex-1 items-center justify-center rounded-3xl bg-white shadow-lg">
    <h1 className="text-2xl">{text}</h1>
  </div>
);

export default BasicNotFound;
