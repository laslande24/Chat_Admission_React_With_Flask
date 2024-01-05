import { robot, logo } from "./../../assets";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../style";
import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const formValidation = () => {
    const { firstname, lastname, email, password, confirmPassword } = user;
    const errors = {};

    if (!firstname.trim()) {
      errors.firstname = "First name is required";
    }

    if (!lastname.trim()) {
      errors.lastname = "Last name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Invalid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password should be at least 6 characters long";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formValidation()) {
      // Send registration data to the backend
      axios
        .post("/register", user)
        .then((response) => {
          navigate("/signin");
        })
        .catch((error) => {
          // Handle registration error
          console.error(error);
          // Show error message to the user
          alert("Registration failed");
        });
    }
  };

  const isValidEmail = (email) => {
    // Add your email validation logic here
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <section className="min-h-screen flex items-stretch text-white font-poppins font-normal">
      <div
        className="lg:flex w-1/2 hidden bg-gray-500 dark:bg-black bg-no-repeat bg-cover relative items-center"
        style={{ backgroundImage: `url(${robot})` }}
      >
        <div className="absolute bg-gray-600 opacity-60 inset-0 z-0"></div>
        <div className="w-full px-24 z-10">
          <h1 className="text-5xl font-bold text-left tracking-wide">
            Keep it special
          </h1>
          <p className="text-3xl my-4">
            Capture your personal memory in unique way, anywhere.
          </p>
        </div>
        <div className="bottom-0 absolute p-4 text-center right-0 left-0 flex justify-center space-x-4">
          <span>
            <svg
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </span>
          <span>
            <svg
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </span>
          <span>
            <svg
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </span>
        </div>
      </div>
      <div
        className="lg:w-1/2 w-full h-screen flex items-center justify-center text-center md:px-16 px-0 z-0 bg-[#6b7280] dark:bg-black"
      >
        <div
          className="absolute lg:hidden z-10 inset-0 bg-gray-500 dark:bg-black bg-no-repeat bg-cover items-center"
          style={{ backgroundImage: `url(${robot})` }}
        >
          <div className="absolute bg-gray-600 opacity-60 inset-0 z-0"></div>
        </div>
        <div className="absolute z-[1] w-[45%] h-[45%] rounded-full bottom-40 blue__gradient" />
        <div className="w-full h-screen overflow-y-auto z-20">
          <h1 className="w-auto h-7 ss:h-8 inline-flex mt-4">
            <img src={logo} alt="hoobank" className="w-[248px] h-[72px]" />
          </h1>
          <p className={`${styles.heading3} text-gray-100`}>Register using</p>
          <div className="py-2 space-x-4">
            <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">
              f
            </span>
            <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">
              G+
            </span>
            <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">
              in
            </span>
          </div>
          <p className="text-gray-100 mt-4">or use an email for your account</p>
          <form
            onSubmit={handleSubmit}
            className="ss:w-2/3 w-full px-4 lg:px-0 mx-auto"
          >
            <div className="pb-2 pt-4">
              <input
                type="text"
                name="firstname"
                id="firstname"
                placeholder="First name"
                className="block w-full p-4 text-lg rounded-sm bg-black text-gray-600"
                value={user.firstname}
                onChange={handleChange}
              />
              {errors.firstname && (
                <p className="text-red-500">{errors.firstname}</p>
              )}
            </div>
            <div className="pb-2 pt-4">
              <input
                type="text"
                name="lastname"
                id="lastname"
                placeholder="Last name"
                className="block w-full p-4 text-lg rounded-sm text-gray-600 bg-black"
                value={user.lastname}
                onChange={handleChange}
              />
              {errors.lastname && (
                <p className="text-red-500">{errors.lastname}</p>
              )}
            </div>
            <div className="pb-2 pt-4">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="block w-full p-4 text-lg rounded-sm text-gray-600 bg-black"
                value={user.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            <div className="pb-2 pt-4">
              <input
                className="block w-full p-4 text-lg rounded-sm text-gray-600 bg-black"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={user.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="pb-2 pt-4">
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm password"
                className="block w-full p-4 text-lg rounded-sm text-gray-600 bg-black"
                value={user.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="text-right text-gray-400">
              <p>
                Already have an account?{" "}
                <Link
                  to={`/signin`}
                  className="hover:underline hover:text-gray-100"
                >
                  Sign in
                </Link>
              </p>
            </div>
            <div className="w-full rounded-full bg-blue-gradient mt-4">
              <button
                type="submit"
                className="uppercase block w-full p-4 text-lg hover:text-pink-400 focus:outline-none"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
