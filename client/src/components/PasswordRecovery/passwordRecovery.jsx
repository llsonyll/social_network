import { useState, useEffect } from "react";
import logoSN from "../../../assets/LogoSN.png";

import { restorePassword } from "../../redux/actions/userActions";
import Swal from "sweetalert2";

const PasswordRecovery = ({ goBack }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const handleInputChange = (e) => setInput(e.target.value);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input === "") return;
    const { message, error } = await restorePassword(input);

    if (!error) {
      Swal.fire({
        icon: "success",
        title: "Completed",
        text: message,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Ups... Something went wrong",
        text: error,
        background: "#4c4d4c",
        color: "white",
      });
    }
  };

  useEffect(() => {
    if (input === "") {
      setError("Email: required");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input)) {
      setError("Email: invalid");
    } else {
      setError("");
    }
  }, [input]);

  return (
    <form
      className="bg-[#00000057] pt-6 px-6 md:pb-6 pb-3 shadow-md rounded flex flex-col m-2"
      onSubmit={handleSubmit}
    >
      <img src={logoSN} alt="logoSN" className="w-8 h-5 m-auto" />
      <h1 className="text-white font-semibold text-lg text-center mt-4 mb-2">
        Password Recovery
      </h1>
      <p className="text-white text-center">
        Type your email to send reset your password
      </p>
      <input
        className="mt-3 focus:ring-indigo-500 focus:border-indigo-500 h-full py-1 pl-2 pr-7 border-transparent bg-[#363636] text-white sm:text-sm rounded-md w-full"
        type="text"
        value={input}
        onChange={handleInputChange}
      />
      {error && <p className="text-red-500 text-sm pt-2"> {error}</p>}
      <input
        className="bg-green-700 text-white mt-3 py-2 disabled:opacity-50"
        type="submit"
        value="Recuperar"
        disabled={error !== ""}
      />
      <button
        className=" text-white mt-12 disabled:opacity-50 text-sm underline"
        type="button"
        onClick={goBack}
      >
        Regresar
      </button>
    </form>
  );
};

export default PasswordRecovery;
