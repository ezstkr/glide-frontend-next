import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { OMRState } from '../store'; // Update the import path according to your project structure

import { CSSTransition } from 'react-transition-group';
import { ResultPageDiv } from './result.styled';


const ResultPage: React.FC = () => {
  const [transition, setTransition] = useState({
    after_0: false,
    after_2000: false,
    after_2500: false,
  });

  const correctCount = OMRState.item.filter(Boolean).length;
  const questionCount = OMRState.n_question;
  const score = Number(((correctCount / questionCount) * 100).toFixed(1));
  const resultKeyword = score >= 80 ? 'excellent' : score >= 50 ? 'good' : 'poor';
  const iconSrc = `/assets/icons/result/${resultKeyword}.svg`; // Update the path according to your project structure

  const scoreRef = useRef<HTMLDivElement>(null);
  const correctCountRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setAnimationTimeout();
    valueUpdateAnimation(scoreRef.current, score);
    valueUpdateAnimation(correctCountRef.current, correctCount, '', 0);
  }, []);

  const setAnimationTimeout = () => {
    setTransition((prev) => ({ ...prev, after_0: true }));
    setTimeout(() => {
      setTransition((prev) => ({ ...prev, after_2000: true }));
    }, 2000);
    setTimeout(() => {
      setTransition((prev) => ({ ...prev, after_2500: true }));
    }, 2500);
  };

  const valueUpdateAnimation = (
    valueElement: HTMLDivElement | HTMLSpanElement | null,
    realValue: number,
    subfix: string = '%',
    fractionDigits: number = 1,
    runtime: number = 1200,
    n_shares: number = 30,
    timeout: number = 250,
  ) => {
    if (valueElement) {
      valueElement.innerHTML = `0${fractionDigits !== 0 ? '.' + '0'.repeat(fractionDigits) : ''}${subfix}`;

      setTimeout(function () {
        let n = 1;
        let set = setInterval(function () {
          valueElement.innerHTML = `${(realValue / n_shares * n).toFixed(fractionDigits)}${subfix}`;
          if (n === n_shares) clearInterval(set);
          n++;
        }, runtime / n_shares);
      }, timeout);
    }
  };

  return (
    <ResultPageDiv id="result" className="w-100">
      <div id="result-title" className="has-background-light2 py-4">
        <CSSTransition in={transition.after_2000} timeout={500} classNames="slide-y-down">
          <div className="col-a-center">
            <h2>Result</h2>
  
            <img src={iconSrc} alt="Result Icon" />
  
            <h1>{resultKeyword.toUpperCase()}</h1>
          </div>
        </CSSTransition>
      </div>
  
      <div id="result-detail" className="has-background-white">
        <div className="container col">
          <CSSTransition in={transition.after_0} timeout={500} classNames="zoom-y">
            <div id="your-score">
              <h2 className="bold">Your Score</h2>
  
              <div className="space-between has-background-light2 rounded-5 mt-4 p-5">
                <span>
                  <h2 className="b-700">TOEFL</h2>
                  <h2 className="b-500">Reading Test</h2>
                </span>
  
                <span id="total-score" className="col-a-center has-background-white rounded-4 py-3 px-4">
                  <h4>TOTAL SCORE</h4>
                  <span className="row-a-end">
                    <h3>
                      <span ref={correctCountRef}>0</span>/{questionCount}
                    </h3>
                    <p ref={scoreRef} className="row-j-center">0.0%</p>
                  </span>
                </span>
              </div>
            </div>
          </CSSTransition>
  
          <CSSTransition in={transition.after_2500} timeout={500} classNames="slide-y-down">
            <div id="analysis">
              <h2 className="bold">Analysis</h2>
  
              <div className="columns mt-4">
                <div className="column has-background-light2 rounded-5 p-5">
                  <h5>
                    Your <span className="tag-custom">Weak</span> Point
                  </h5>
  
                  <p className="has-background-white rounded-4 mt-3 p-3">
                    {data.weakPoint}
                  </p>
                </div>
  
                <div className="column has-background-light2 rounded-5 p-5">
                  <h5>
                    Your <span className="tag-custom has-background-info">Strong</span> Point
                  </h5>
  
                  <p className="has-background-white rounded-4 mt-3 p-3">
                    {data.strongPoint}
                  </p>
                </div>
              </div>
  
              <div className="col-a-center mt-5">
                <button className="btn-submit is-primary rounded-3 mt-3" onClick={() => router.push('/')}>
                  Retry
                </button>
  
                <p id="bottom" className="my-5">
                  Want to try more tests?
                  <a href="https://www.testglider.com/" className="underline has-text-grey-dark" target="_blank" rel="noopener noreferrer">
                    Visit TestGlider
                  </a>
                </p>
              </div>
            </div>
          </CSSTransition>
        </div>
      </div>
    </ResultPageDiv>
  );
};

export default ResultPage;
