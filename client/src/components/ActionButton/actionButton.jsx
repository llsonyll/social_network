const ActionButton = ({
  label,
  action,
  bg = "bg-green-700",
  disabled = false,
}) => {
  return (
    <button
      className={`${bg} px-2 py-1 text-sm rounded-md disabled:opacity-75`}
      onClick={action}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default ActionButton;
