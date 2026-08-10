import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../components/layout/Sidebar';
import MicButton from '../../components/voice/MicButton';

import './home.css';

function Home() {
  const navigate = useNavigate();

  const suggestions = [
    'What medicines should I take today?',
    'What food should I avoid?',
    'Do I have any appointments?',
    'Remind me to take my medicine',
  ];

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="home-main">

        <div className="home-header">
          <div>
            <h1>
              Good morning! <span>👋</span>
            </h1>

            <p>How can I help you today?</p>
          </div>

          <button
            className="summary-button"
            onClick={() => navigate('/app/health')}
          >
            <FileText size={17} />
            View Health Summary
          </button>
        </div>

        <div className="voice-area">

          <MicButton
            onClick={() => navigate('/app/session')}
          />

          <h2>Tap the mic and speak</h2>

          <p>
            You can speak in Hindi, English or Hinglish
          </p>

          <div className="suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => navigate('/app/session')}
              >
                {suggestion}
              </button>
            ))}
          </div>

        </div>

        <footer>
          🔒 Your data is private and secure.
        </footer>

      </main>

    </div>
  );
}

export default Home;