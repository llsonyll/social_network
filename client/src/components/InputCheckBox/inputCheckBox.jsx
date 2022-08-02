const InputCheckbox = ({ value, setValue }) => {
  return (
    <div className="info_row flex gap-4">
      <div className="basis-1/4"> {value} </div>
      <div className="basis-3/4 flex gap-4">
        <input type="checkbox" /> Yes
        <input type="checkbox" /> No
      </div>
    </div>
  );
};

export default InputCheckbox;
