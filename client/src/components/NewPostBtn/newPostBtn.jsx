import "./newPostBtn.css";
import { FaPlus } from "react-icons/fa";

const NewPostBtn = ({ action }) => {
  return (
    <button onClick={action}>
      <FaPlus />
    </button>
  );
};

export default NewPostBtn;
