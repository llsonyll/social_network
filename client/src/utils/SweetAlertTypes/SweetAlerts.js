import Swal from "sweetalert2"
export const errorAlerts = ( text )=>{

    return Swal.fire({
        icon: "error",
        title: "Ups...",
        text: text,
        background: "#4c4d4c",
        color: "white",
        confirmButtonText: "Ok",
        confirmButtonColor: "#4E864C",
        allowEscapeKey: true,
        allowEnterKey: true,
      });
} 

export const goodAlerts = (text)=>{

  return Swal.fire({
    icon: "success",
    title: "Nice!",
    text: text,
    background: "#4c4d4c",
    color: "white",
    confirmButtonText: "Ok",
    confirmButtonColor: "#4E864C",
    allowEscapeKey: true,
    allowEnterKey: true,
  });
}
