import Error from "@/assets/ERROR.gif";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <div className="flex items-center justify-center flex-col">
        <img src={Error} alt="error" />
      </div>
      <h2 className="text-center text-xl">
        This page don't belong to us.
        <span className="underline pl-2">
          <Link to="/">Back to root</Link>
        </span>
      </h2>
    </>
  );
}

export default NotFound;
