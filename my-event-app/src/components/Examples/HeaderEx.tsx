import Header from '../Header';
import { useState } from 'react';

export default function HeaderExample() {
  const [activeSection, setActiveSection] = useState('about');

  return (
    <div className="bg-gray-900 min-h-[200px]">
      <Header onNavigate={setActiveSection} activeSection={activeSection} />
    </div>
  );
}
