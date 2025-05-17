import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, FormEvent } from "react";
import { securedApi } from "@/api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import React from "react";
import LogoImage from "@/assets/fwok.svg";
import Logo from "@/assets/login.svg";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await securedApi.post("http://127.0.0.1:8000/api/v1/login/", {
        email,
        password,
      });

      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/u/dashboard");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form Area */}
      <div className="flex-1 flex flex-col bg-white px-6 sm:px-12">
        {/* Logo + Brand Name Top Left */}
        <div className="flex justify-start pt-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={LogoImage}
              alt="Brand Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-semibold text-indigo-600">FitWork</span>
          </Link>
        </div>

        {/* Form Centered */}
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">
              Login to your account
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-12"
                />
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-12"
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

      {/* Right: Fullscreen Image */}
      <div className="hidden md:flex flex-1 h-screen">
        <img
          src={Logo}
          alt="Brand Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginForm;
