import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { securedApi } from "@/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import Logo from "@/assets/fwok.svg";
import Gif from "@/assets/LOGIN.gif";

interface DecodedToken {
  is_company_admin?: boolean;
  is_candidate?: boolean;
  is_fitwork_admin?: boolean;
  [key: string]: any;
}

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.is_company_admin) {
        navigate("/c/dashboard", { replace: true });
      } else {
        navigate("/u/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await securedApi.post("http://127.0.0.1:8000/api/v1/login/", {
        email,
        password,
      });

      const { access, refresh } = res.data;

      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);

      const decoded: DecodedToken = jwtDecode(access);

      if (decoded.is_company_admin) {
        navigate("/c/dashboard");
      } else {
        navigate("/u/dashboard");
      }
    } catch (error) {
      alert("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form Area */}
      <div className="flex-1 flex flex-col bg-white px-6 sm:px-12">
        {/* Logo + Brand Name */}
        <div className="flex justify-start pt-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="Brand Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-semibold text-indigo-600">FitWork</span>
          </Link>
        </div>

        {/* Form Section */}
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">
              Login to your account
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-12"
                  placeholder="Enter your email here"
                />
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-12"
                  placeholder="Enter your password here"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-base font-semibold"
                disabled={!email || !password}
              >
                Login
              </Button>

              <p className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-indigo-600 hover:underline">
                  Register here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Right: Image Area */}
      <div className="bg-indigo-300 hidden md:flex flex-1 h-screen items-center justify-center">
        <img src={Gif} alt="Brand Visual" className="w-[500px] h-[500px] object-contain" />
      </div>
    </div>
  );
};

export default LoginForm;
