import React, { useEffect, useRef } from 'react';
import TypeIt from 'typeit';
import './DiveIn.css';

function DiveIn() {
  const studyRef = useRef(null);
  const withoutRef = useRef(null);
  const limitsRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current) return;
    animated.current = true;

    const instances = [];

    if (studyRef.current) {
      studyRef.current.innerHTML = '';
      instances.push(
        new TypeIt(studyRef.current, {
          speed: 90,
          startDelay: 100,
          cursor: false,
          waitUntilVisible: true,
        })
          .type('Study')
          .go()
      );
    }

    if (withoutRef.current) {
      withoutRef.current.innerHTML = '';
      instances.push(
        new TypeIt(withoutRef.current, {
          speed: 90,
          startDelay: 1100,
          cursor: false,
          waitUntilVisible: true,
        })
          .type('Without')
          .pause(1400)
          .delete()
          .type('With')
          .go()
      );
    }

    if (limitsRef.current) {
      limitsRef.current.innerHTML = '';
      instances.push(
        new TypeIt(limitsRef.current, {
          speed: 90,
          startDelay: 2200,
          cursor: false,
          waitUntilVisible: true,
        })
          .type('Limits')
          .pause(1200)
          .delete()
          .type('SkillBridge')
          .go()
      );
    }

    return () => {
      instances.forEach((instance) => instance.destroy());
    };
  }, []);

  const handleDiveIn = () => {
    window.location.href = '/Role_Page/';
  };

  return (
    <main className="dive-in-page">
      <div className="top-left-content">
        <span className="welcome-text">Welcome</span>
      </div>

      <div className="center-left-content">
        <div className="text-container">
          <div className="text-line study-line" ref={studyRef} />
          <div className="text-line without-line" ref={withoutRef} />
          <div className="text-line limits-line red-text" ref={limitsRef} />
        </div>
      </div>

      <div className="bottom-right-content">
        <button className="dive-in-btn" onClick={() => window.location.href = '/Developer/Login/index.html'}>
          Dev
        </button>
        <button className="dive-in-btn" onClick={() => window.location.href = '/Admin/Login/index.html'}>
          Admin
        </button>
        <button className="dive-in-btn" onClick={handleDiveIn}>
          Dive-In
        </button>
      </div>
    </main>
  );
}

export default DiveIn;
