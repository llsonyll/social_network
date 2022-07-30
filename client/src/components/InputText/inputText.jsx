const InputText = ({ value, setValue }) => {
  return (
    <div className="info_row flex gap-4">
      <div className="basis-1/4 font-light"> {value} </div>
      <input
        type="text"
        className="focus:ring-indigo-500 focus:border-indigo-500 py-1 pl-2 pr-7 border-transparent bg-[#363636] text-white sm:text-sm rounded-md w-full basis-3/4"
      />
    </div>
  );
};

export default InputText;
