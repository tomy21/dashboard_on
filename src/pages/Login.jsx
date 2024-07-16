import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineRefresh } from "react-icons/md";
import CryptoJS from "crypto-js";
import { ScaleLoader } from "react-spinners";

export default function Login() {
  const [captcha, setCaptcha] = useState("");
  const [textCaptcha, setTextCaptcha] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const navigate = useNavigate();
  const key = "PARTNER_KEY";

  const refreshString = () => {
    setCaptcha(Math.random().toString(36).slice(2, 8));
  };

  useEffect(() => {
    refreshString();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (textCaptcha === captcha) {
      setLoading(true);
      setValid(true);
      try {
        const dataLogin = {
          email: email,
          password: password,
        };

        const encrypData = CryptoJS.AES.encrypt(
          JSON.stringify(dataLogin),
          key
        ).toString();

        await axios.post(
          "https://dev-valetapi.skyparking.online/api/login",
          {
            data: encrypData,
          },
          { withCredentials: true }
        );

        navigate("/transaction");
        setLoading(false);
      } catch (error) {
        if (error.response) {
          setErrorMessage(error.response.data.msg || "Login failed");
        } else {
          // Handle other errors (network issues, etc.)
          setErrorMessage("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      setValid(false);
    }
  };
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-20">
        <div className="container w-full md:w-[80%] h-full">
          <div className="flex flex-col md:flex-row justify-center items-center text-black bg-white rounded-md p-6 shadow shadow-white">
            <div className="w-full md:w-1/2 h-full p-5">
              <div className="flex flex-col justify-center items-center">
                <img
                  src={"/images1.png"}
                  className="w-48 h-48 md:w-80 md:h-80 md:block hidden"
                  alt={"skyparking"}
                />
                <div className="flex flex-row gap-3 items-end justify-center mt-2">
                  <img
                    src={"/logo.png"}
                    className="w-12 h-12 md:w-14 md:h-14"
                    alt={"skyparking"}
                  />
                  <h1 className="text-xl md:text-2xl font-semibold">
                    SKY Parking Over Night{" "}
                  </h1>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 h-full p-5">
              <h1 className="text-base font-semibold">Welcome back, </h1>
              <h1 className="text-sm text-slate-400">
                Please login to your account
              </h1>

              <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500"></div>

              <div className="flex flex-col w-full h-full px-3 py-2 text-start">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col mb-2 text-sm">
                    <label htmlFor="email" className="mb-1">
                      Email
                    </label>
                    <input
                      type="text"
                      value={email}
                      name="email"
                      id="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-slate-400 px-3 py-2 rounded-md"
                      placeholder="Enter email"
                    />
                  </div>

                  <div className="flex flex-col mb-5 text-sm">
                    <label htmlFor="password" className="mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      name="password"
                      id="password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="border border-slate-400 px-3 py-2 rounded-md"
                      placeholder="*************"
                    />
                  </div>

                  <div className="flex flex-row space-x-5 mb-2">
                    <div
                      className={`text-base rounded-sm p-1 ${
                        valid ? "bg-green-500" : "bg-black text-white"
                      } font-semibold w-[50%] text-center`}
                    >
                      {captcha}
                    </div>
                    <button
                      type="button"
                      className="rounded-md p-2 bg-white shadow-md shadow-slate-400"
                      onClick={refreshString}
                    >
                      <MdOutlineRefresh />
                    </button>
                  </div>

                  <div className="flex flex-col mb-5 text-sm">
                    <input
                      type="text"
                      className={`border px-3 py-2 rounded-md ${
                        valid ? "border-green-500" : "border-red-500"
                      }`}
                      placeholder="Enter Captcha"
                      value={textCaptcha}
                      onChange={(e) => setTextCaptcha(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="text-center bg-emerald-500 py-2 rounded-md w-full text-sm hover:bg-emerald-400 hover:shadow-md"
                  >
                    {loading ? "Loading..." : "Login"}
                  </button>
                </form>

                {errorMessage && (
                  <div className="mb-5 text-red-500 text-sm">
                    {errorMessage}
                  </div>
                )}

                {loading && (
                  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-5 rounded-md shadow-lg">
                      <div className="flex items-center justify-center mb-3">
                        <ScaleLoader size={150} color={"#333"} loading={true} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
