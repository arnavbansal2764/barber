import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedInAtom } from "../recoil/atoms.ts";
import { useRecoilState } from "recoil";

export default function Signup() {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<string>("customer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    city: "",
    shopname: "",
    shopcity: "",
    shopaddress: "",
    homeservice: false,
    ownerUsername: "",
    rate: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    localStorage.setItem("username",formData.username)
  };
  const handleHomeServiceChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setFormData({ ...formData, homeservice: value === "true" });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let url = "";

    switch (profile) {
      case "customer":
        url = "http://localhost:3000/api/user/signup-user";

        break;
      case "barber":
        url = "http://localhost:3000/api/barber/signup-barber";
        break;
      case "owner":
        url = "http://localhost:3000/api/owner/signup-owner";
        break;
      default:
        return;
    }

    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // You can handle response data as needed
          localStorage.setItem("token", data.token);
          if (data.UserId) localStorage.setItem("UserId", data.UserId);
          if (data.barberId) localStorage.setItem("barberId", data.barberId);
          if (data.ownerId) localStorage.setItem("ownerId", data.ownerId);
          setIsLoggedIn(profile);
          console.log("is logged in is: ", isLoggedIn);
          alert("Signed Up");
          setFormData({
            name: "",
            email: "",
            username: "",
            password: "",
            city: "",
            shopname: "",
            shopcity: "",
            shopaddress: "",
            homeservice: false,
            ownerUsername: "",
            rate: "",
          });
          if (profile === "customer") navigate("userprofile");
          if (profile === "barber") navigate("/barberprofile");
          if (profile === "owner") navigate("ownerprofile");
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="form pb-10" onSubmit={handleSubmit}>
        <p id="heading">Signup</p>
        <div className="radio-input py-6">
          <input
            type="radio"
            id="customer"
            name="profile"
            value="customer"
            onChange={() => setProfile("customer")}
          />
          <label htmlFor="customer">Customer</label>
          <input
            type="radio"
            id="barber"
            name="profile"
            value="barber"
            onChange={() => setProfile("barber")}
          />
          <label htmlFor="barber">Barber</label>
          <input
            type="radio"
            id="owner"
            name="profile"
            value="owner"
            onChange={() => setProfile("owner")}
          />
          <label htmlFor="owner">Owner</label>
        </div>
        <div className="field">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="input-field"
            type="text"
          />
        </div>
        <div className="field">
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input-field"
            type="email"
          />
        </div>
        {/* Additional input fields based on selected profile */}
        {profile === "customer" && (
          <>
            <div className="field">
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="input-field"
                type="text"
              />
            </div>
          </>
        )}
        {profile === "barber" && (
          <>
            <div className="field">
              <input
                name="ownerUsername"
                value={formData.ownerUsername}
                onChange={handleChange}
                placeholder="Owner Name"
                className="input-field"
                type="text"
              />
            </div>
            <div className="field">
              <input
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                placeholder="Rate"
                className="input-field"
                type="number"
              />
            </div>
          </>
        )}
        {profile === "owner" && (
          <>
            <div className="field">
              <input
                name="shopname"
                value={formData.shopname}
                onChange={handleChange}
                placeholder="Shop Name"
                className="input-field"
                type="text"
              />
            </div>
            <div className="field">
              <input
                name="shopcity"
                value={formData.shopcity}
                onChange={handleChange}
                placeholder="Shop City"
                className="input-field"
                type="text"
              />
            </div>
            <div className="field">
              <input
                name="shopaddress"
                value={formData.shopaddress}
                onChange={handleChange}
                placeholder="Shop Address"
                className="input-field"
                type="text"
              />
            </div>
            <div className="field">
              <p>Home Service:</p>
              <input
                type="radio"
                id="homeServiceTrue"
                name="homeService"
                value="true"
                checked={formData.homeservice === true}
                onChange={handleHomeServiceChange}
              />
              <label htmlFor="homeServiceTrue">True</label>
              <input
                type="radio"
                id="homeServiceFalse"
                name="homeService"
                value="false"
                checked={formData.homeservice === false}
                onChange={handleHomeServiceChange}
              />
              <label htmlFor="homeServiceFalse">False</label>
            </div>
          </>
        )}
        <div className="field">
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="input-field"
            type="text"
          />
        </div>
        <div className="field">
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="input-field"
            type="password"
          />
        </div>
        <div className="btn">
          <button className="button1 mr-5">Signup</button>
        </div>
        <div className="btn">
          <p className="text-white mt-1">Already have an account ?</p>
          <button className="button2 ml-2" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
