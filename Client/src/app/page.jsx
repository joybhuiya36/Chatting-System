"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.scss";
import axiosIntance from "@/utils/axiosInstance";

const App = () => {
  const navigate = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    console.log(email, password);
    axiosIntance
      .post("/auth/login", { email, password })
      .then((response) => {
        toast.success("Logged in Successfully!");
        const token = response?.data?.data?.token;
        const id = response?.data?.data?.user?._id;
        const name = response?.data?.data?.user?.name;
        const image = response?.data?.data?.user?.image;
        localStorage.setItem("token", token);
        localStorage.setItem("id", id);
        localStorage.setItem("name", name);
        localStorage.setItem("image", image);
        axiosIntance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        toast.success("Login Successfully");
        navigate.push(`/chat/${id}`);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="login-page">
      <ToastContainer />
      <div className="login">
        <div className="login__content">
          <h2 className="login__title">ChatBox</h2>
          <label htmlFor="email" className="login__label">
            Email:
          </label>
          <input
            type="text"
            className="login__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password" className="login__label">
            Password:
          </label>
          <input
            type="password"
            className="login__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={onSubmit} className="login__button">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
