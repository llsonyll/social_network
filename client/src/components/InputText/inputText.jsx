const InputText = ({ label, value, setValue, disabled = false, maxLength='25' }) => {
  return (
    <div className="info_row flex gap-4">
      <div className="basis-1/4 font-light"> {label} </div>
      <input
        type="text"
        name={label.toLowerCase()}
        value={value}
        disabled={disabled}
        onChange={setValue}
        maxLength={maxLength}
        className="focus:ring-indigo-500 focus:border-indigo-500 py-1 pl-2 pr-7 border-transparent bg-[#363636] text-white sm:text-sm rounded-md w-full basis-3/4 disabled:opacity-70 disabled:z-auto"
      />
    </div>
  );
};

export default InputText;
