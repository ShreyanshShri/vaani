import { ArrowRight, HeartHandshake } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <main className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>
            Your Health.
            <br />
            <span>Our Priority.</span>
          </h1>

          <p>
            Vaani is your voice-based companion that helps you remember your
            medicines, food, appointments and important things in life.
          </p>

          <button onClick={() => navigate("/login")}>
            Get Started
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="hero-image">
          <img
            src="https://static.vecteezy.com/system/resources/previews/015/486/034/non_2x/senior-man-and-woman-talking-by-mobile-phone-free-vector.jpg"
            alt="Elderly couple using a phone"
          />
        </div>
      </div>
    </main>
  );
}

export default Hero;
