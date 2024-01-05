import styles from "./../../style";
import { discount, robot } from "./../../assets";
import GetStarted from "./GetStarted";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="home"
      className={`flex md:flex-row flex-col ${styles.paddingY}`}
    >
      <div
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}
      >
        <div className="flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <img src={discount} alt="discount" className="w-[32px] h-[32px]" />
          <p className={`${styles.paragraph} ml-2`}>
            <span className="text-white">20%</span> Discount For{" "}
            <span className="text-white">1 Month</span> Account
          </p>
        </div>

        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]">
            A New <br className="sm:block hidden" />{" "}
            <span className="text-gradient">Generation</span>{" "}
          </h1>
          <div className="ss:flex hidden md:mr-4 mr-0 cursor-pointer hover:bg-none hover:inset-0">
            <Link to={`/signin`} className="cursor-pointer">
              <GetStarted />
            </Link>
          </div>
        </div>

        <h1 className="font-poppins font-semibold ss:text-[68px] text-[52px] text-white ss:leading-[100.8px] leading-[75px] w-full">
          AI CHATBOT.
        </h1>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Our team of experts uses a methodology to identify the machine
          learning algorithm for the creation of this chabot to fit your needs.
          Actually the bot provides informations on admission process for
          L'institut Universitaire de la Cote but later he will be able to
          assist you on different domains.
        </p>
      </div>

      <div
        className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}
      >
        <img
          src={robot}
          alt="RLBot"
          className="w-[100%] h-[100%] relative z-[5]"
        />
      </div>

      <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
      <div className="absolute z-[1] w-[80%] h-[80%] rounded-full bottom-40 white__gradient" />
      <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 pink__gradient" />

      <div className={`ss:hidden cursor-pointer hover:bg-none hover:inset-0 ${styles.flexCenter}`}>
        <Link to={`/signin`} className="cursor-pointer">
          <GetStarted />
        </Link>
      </div>
    </section>
  );
};

export default Hero;
