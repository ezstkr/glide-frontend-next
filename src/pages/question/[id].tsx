import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Answer2Index, Answer2Symbol, Index2Answer, Question, QuestionInit } from '../../../shared/question';
import { Scenario } from '../../../shared/vue-chat-bot';
import { userState, OMRState, botState, questionState } from '../../../store';


const QuestionPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [q, setQ] = useState<Question>(QuestionInit);
  const [userChoiceIndex, setUserChoiceIndex] = useState<null | number>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [passageWithHighlight, setPassageWithHighlight] = useState<string>('');
  const [scenario, setScenario] = useState<Scenario>([]);

  // Helper functions and other constants go here

  useEffect(() => {
    async function fetchQuestionData() {
      // Fetch question data and set states here
    }

    fetchQuestionData();
  }, [id]);

  const check = () => {
    // Update user question and OMR state
  };

  const next = () => {
    // Navigate to next question or finish
  };

  return (
    <div id="quiz" className="col-a-center">
      <h1>
        {isMyQuestion && (
          <span>
            Question {Number(q_idx)} of {n_question}
          </span>
        )}
      </h1>

      <div className={`page${checked ? ' checked' : ''}`}>
        <div className="page-item col">
          {!checked ? (
            <>
              <div id="question">{q.question}</div>

              <div id="choices" className="col">
                {q.choices &&
                  ['a', 'b', 'c', 'd'].map((key, idx) => (
                    <div key={`choice_${idx}`} className="choice">
                      <input
                        type="radio"
                        name="userChoiceIndex"
                        value={idx}
                        checked={userChoiceIndex === idx}
                        onChange={(e) => setUserChoiceIndex(Number(e.target.value))}
                      />
                      <label>{q.choices[key]}</label>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            // ... other JSX code for the checked state ...
          )}
        </div>

        <div className="page-item col">
          {!checked ? (
            <>
              <h2 id="subtopic">{q.subTopic}</h2>
              <p>{q.passage}</p>

              <div className="w-100 row-j-center">
                <h4 id="article-url" className="has-background-light2">
                  Do you wanna check out{' '}
                  <a href={q.url} target="_blank" rel="noopener noreferrer" className="underline">
                    this article?
                  </a>
                </h4>
              </div>
            </>
          ) : (
            // ... other JSX code for the checked state ...
          )}
        </div>
      </div>

      {!checked && (
        <button
          id="btn-check"
          className="button is-primary"
          onClick={check}
          disabled={userChoiceIndex === null}
        >
          Check Answers
        </button>
      )}
      {isMyQuestion && checked && (
        <button id="btn-check" className="button is-primary" onClick={next}>
          {!isLastQuestion ? 'Next' : 'See Result'}
        </button>
      )}

      <ChatBot
        scenario={scenario}
        questionId={q._id}
        clearButton={true}
        isOpen={q_idx === 1 ? true : isOpen}
        storeMessage={isMyQuestion ? true : false}
        ratingEnable={true}
      />
    </div>
  );
};

export default QuestionPage;
