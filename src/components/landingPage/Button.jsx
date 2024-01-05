import { Link } from "react-router-dom";

const Button = ({ styles }) => (
  <button type="button" className={`py-4 px-6 font-poppins font-medium text-[18px] text-primary ${styles}`}>
    <Link to={`/speech`}>Get Started</Link>
  </button>
);

export default Button;
