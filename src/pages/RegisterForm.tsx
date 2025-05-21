import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, FormEvent } from "react";
import { plainApi } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";
import React from "react";
import Gif from "@/assets/REGISTER.gif";
import Logo from "@/assets/fwok.svg";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await plainApi.post("http://127.0.0.1:8000/api/v1/register/", {
        email,
        username,
        password,
      });

      navigate("/login");
    } catch (error) {
      alert("Registration failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Fullscreen Image */}
      <div className="bg-indigo-300 hidden md:flex flex-1 h-screen items-center justify-center">
        <img
          src={Gif}
          alt="Brand Visual"
          className="w-[600px] h-[600px] object-contain"
        />
      </div>
      {/* Right: Form Area */}
      <div className="flex-1 flex flex-col bg-white px-6 sm:px-12">
        {/* Logo + Brand Name Top Right */}
        <div className="flex justify-end pt-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={Logo}
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
              Create your account
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
                  placeholder="Enter your email here"
                />
              </div>

              <div>
                <Label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-12"
                  placeholder="Enter your username here"
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
                  placeholder="Enter your password here"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-base font-semibold"
                disabled={!email || !username || !password}
              >
                Register
              </Button>

              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 hover:underline">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
