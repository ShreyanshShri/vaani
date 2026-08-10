import { Mic } from 'lucide-react';

function MicButton({ onClick, listening = false }) {
  return (
    <div className={`mic-container ${listening ? 'listening' : ''}`}>

      <div className="mic-ring ring-one" />
      <div className="mic-ring ring-two" />

      <button
        className="mic-button"
        onClick={onClick}
      >
        <Mic size={34} />
      </button>

    </div>
  );
}

export default MicButton;