import { useState, useEffect } from "react";
import logoSN from "../../../assets/LogoSN.png";

const PasswordRecovery = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const handleInputChange = (e) => setInput(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT");
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
      className="bg-[#00000057] md:p-12 p-6 shadow-md rounded flex flex-col m-2"
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
        disabled={input === ""}
      />
    </form>
  );
};

export default PasswordRecovery;
