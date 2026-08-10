import { HeartHandshake } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Hero from "./Hero";
import Features from "./Features";
import "./landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="brand">
          <HeartHandshake size={28} />

          <div>
            <h2>Vaani</h2>
            <span>Your Personal Health Companion</span>
          </div>
        </div>

        <button onClick={() => navigate("/login")}>Get Started</button>
      </nav>

      <Hero />
      <Features />
    </div>
  );
}

export default Landing;
