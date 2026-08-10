import { ClipboardList, Heart, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: ClipboardList,
    title: 'Remembers for You',
    description:
      'We help you remember your medicines, health history, appointments and more.',
  },
  {
    icon: Heart,
    title: 'Cares for You',
    description:
      'Get timely reminders, food alerts and guidance to take better care of your health.',
  },
  {
    icon: BarChart3,
    title: 'Always With You',
    description:
      'Just speak in Hindi, English or Hinglish — we listen, understand and help you.',
  },
];

function Features() {
  return (
    <section className="features">
      {features.map(({ icon: Icon, title, description }) => (
        <div className="feature" key={title}>
          <div className="feature-icon">
            <Icon size={22} />
          </div>

          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      ))}
    </section>
  );
}

export default Features;