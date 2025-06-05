/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';

const Typewriter = ({ text, delay = 100, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (currentIndex < text.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, text, delay]);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <span className={`inline-block text-center leading-tight ${className}`}>
      {displayedText.split('').map((char, index) => (
        char === ' ' ? (
          <br key={`br-${index}`} />
        ) : (
          <span
            key={index}
            className="inline-block letter-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {char}
          </span>
        )
      ))}
    </span>
  );
};

export default Typewriter;
