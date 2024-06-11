import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import axios from "axios";
import Loading from "./Loading";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const menuItems = [
    // {
    //   title: "Dashboard",
    //   path: "/dashboard",
    // },
    // {
    //   title: "Transaction",
    //   path: "/transaction",
    // },
    // {
    //   title: "Users",
    //   path: "/dashboard",
    // },
  ];

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.get("http://localhost:3008/api/token", {
          withCredentials: true,
        });
        setToken(response.data.accessToken);
        const decode = jwtDecode(token);
        setName(decode.name);
        setEmail(decode.email);

        if (decode.exp * 1000 < Date.now()) {
          navigate("/");
          return null;
        }
      } catch (error) {
        if (error.response) {
          navigate("/");
        }
      }
    };
    refreshToken();
  }, [navigate, token]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.get("http://localhost:3008/api/logout");
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="bg-base-100 border-b">
      <div className="container navbar mx-auto flex justify-between items-center py-3">
        <div className="container flex flex-row space-x-10 justify-end items-end">
          <div className="flex">
            <div className="flex flex-row items-end justify-start space-x-2">
              <img src={"/logo.png"} width={40} height={40} alt="Logo Sky" />
              <h1 className="text-xl font-semibold">SKY Parking</h1>
            </div>
          </div>
          <div className="flex-auto flex-row">
            <ul className="flex flex-row gap-2">
              {menuItems.map((list) => (
                <li
                  key={list.title}
                  className={`hover:bg-slate-100 py-1 px-2 rounded-md ${
                    location.pathname === list.path ? "bg-slate-100" : ""
                  }`}
                >
                  <Link to={list.path}>{list.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center gap-x-3">
          <div className="flex flex-col justify-end items-end">
            <h1 className="text-sm font-semibold">{name}</h1>
            <h1 className="text-xs text-slate-400">{email}</h1>
          </div>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Poto profile"
                  src={"/logo.png"}
                  width={40}
                  height={40}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-20 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link className="justify-between" onClick={handleLogout}>
                  Logout
                  <CiLogout />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
