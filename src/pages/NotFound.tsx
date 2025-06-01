import { useNavigate } from "react-router-dom";
import Error from "@/assets/ERROR.gif";

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-center flex-col">
        <img src={Error} alt="error" />
      </div>
      <h2 className="text-center text-xl">
        This page doesn't belong to us.
        <button
          onClick={() => navigate(-1)}
          className="underline text-blue-600 pl-2 hover:text-blue-800"
        >
          Go back
        </button>
      </h2>
    </>
  );
}

export default NotFound;
