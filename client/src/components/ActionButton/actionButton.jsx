const ActionButton = ({ label, action, bg = "bg-green-700" }) => {
  return (
    <button
      className={`${bg} px-2 py-1 text-sm rounded-md cursor-pointer`}
      onClick={action}
    >
      {label}
    </button>
  );
};

export default ActionButton;
