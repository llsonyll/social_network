import AdminBoard from "../../components/AdminBoard";
import { useSelector } from "react-redux";
import { MdAdminPanelSettings } from "react-icons/md";

const Admin = () => {
  const isAdmin = useSelector((state) => state.auth.loggedUser.isAdmin);

  if (!isAdmin) {
    return (
      <div className="text-neutral-400 font-bold text-base text-center md:pt-10 pt-5 flex flex-col justify-center items-center">
        <div className="text-6xl my-2">
          <MdAdminPanelSettings />
        </div>
        Pagina solo para administradores
      </div>
    );
  }

  return (
    <div className="md:my-4 my-2">
      <AdminBoard />
    </div>
  );
};

export default Admin;
