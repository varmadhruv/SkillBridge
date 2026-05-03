import React, { useEffect, useState } from "react";
import "./Sections.css";

function AboutUs({ studentName }) {
  return (
    <div className="section-container">
      <header className="section-header">
        <h2 className="script-heading">Did You Know About Us ?</h2>
      </header>

      <section className="info-card highlight-card">
        <p>
          We are a dedicated learning platform designed to bridge the gap between students seeking academic support and
          individuals who have strong subject knowledge but limited opportunities to teach.
        </p>
        <p>
          Our web application allows students to log in and connect with mentors based on their specific doubts or
          challenging subjects. Whether it is understanding complex concepts, preparing for exams, or building
          effective study strategies, students can receive personalized guidance tailored to their needs.
        </p>
        <p>
          At the same time, we empower knowledgeable students and individuals to become mentors. Many talented learners
          possess excellent subject expertise but lack formal teaching experience or long-term availability. Our
          platform provides them with an opportunity to share their knowledge, assist others, and earn income, even
          during short periods such as holidays or semester breaks.
        </p>
        <p>This creates a mutually beneficial ecosystem where:</p>
        <ul>
          <li>Students get their doubts resolved quickly and effectively.</li>
          <li>Mentors gain practical teaching experience and earn rewards.</li>
        </ul>
        <p>
          Especially during exam periods, our platform becomes a reliable support system where students can clarify
          doubts, strengthen concepts, and develop better study strategies to perform at their best.
        </p>
        <p>Our mission is simple:</p>
        <p className="mission-text">
          To help students learn in a way they never have before, clearer, smarter, and more confidently, by making
          quality guidance accessible whenever they need it.
        </p>
        <p className="signoff-text">-Team SkillRadius</p>
      </section>
    </div>
  );
}

export default AboutUs;
