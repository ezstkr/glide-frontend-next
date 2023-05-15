import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAxios } from '@/lib/api'
import { getSession } from 'next-auth/react';
import ChatBot from '@/components/chatbot';
import { signOut } from 'next-auth/react'

import { useDispatch, useSelector } from "react-redux";
// import { selectQuestionItem, getQuestion } from "@/store/slices/questionSlice";
import { selectNQuesetion, updateOMR } from "@/store/slices/OMRSlice";
import { selectUserCurriculum, updateUserQuestion } from "@/store/slices/userSlice";
import { selectBotisOpen, selectBotMessageData } from "@/store/slices/botSlice";
import { wrapper } from '@/store/store';

import { MessageData } from "react-chat-bot/src/shared/types/react-chat-bot";
import { Answer2Index, Answer2Symbol, Index2Answer, Question } from '@/shared/types/question';
import { UpdateUserQuestion } from "@/shared/types/user";
import QuestionPageDiv from "./[id].module";


export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const session: any = await getSession(ctx)
    const axios = useAxios(session?.accessToken);
    const { id }: any = ctx.query;
    
    let response: any, q: Question | any, passageWithHighlight: string;
    try {
      // const response = await store.dispatch(getQuestion({ id }))
      response = await axios.get(`/questions/${id}`)
      q  = response.data
      const choiceSymbols: Answer2Symbol = {'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ'}
      passageWithHighlight = getPassageWithHighlight(q, choiceSymbols)
    } catch (e) {
      q = e.response.data
      passageWithHighlight = ''
    } finally {
      return ({ props: { session, id, q, passageWithHighlight } })
    }

    function getPassageWithHighlight(q: Question, choiceSymbols: Answer2Symbol) {
      let passageWithHighlight = q.passage.slice();
      for (const highlight of q?.highlight ?? []) {
        passageWithHighlight = passageWithHighlight.replace(
          highlight.sentence, 
          `<span class="${highlight.correct ? 'green' : 'red'}">` 
          + choiceSymbols[highlight.choice] + highlight.sentence + 
          '</span>'
        )
      }

      return passageWithHighlight
    }
  }
)


const QuestionPage = ({ session, id, q, passageWithHighlight }) => {
  const router = useRouter();

  if (q.statusCode && q.statusCode !== 200) {
    if (q.statusCode === 401) {
      signOut()
    } else {
      router.push('/')
    }
    return <></>
  }

  const axios = useAxios(session?.accessToken);
 
  const dispatch = useDispatch();
  const userCurriculum = useSelector(selectUserCurriculum);
  const n_question = useSelector(selectNQuesetion);
  // const q = useSelector(selectQuestionItem);
  const isOpenRedux = useSelector(selectBotisOpen);
  const messageData = useSelector(selectBotMessageData);

  const answer2Index: Answer2Index = {'a': 0, 'b': 1, 'c': 2, 'd': 3}
  const index2Answer: Index2Answer = {0: 'A', 1: 'B', 2: 'C', 3: 'D'}
  
  const q_idx = userCurriculum.findIndex((item: UpdateUserQuestion) => item.questionId === q._id) + 1
  const isMyQuestion = q_idx !== 0
  const q_explanation = q.explanation.replaceAll(String.fromCharCode(10), " <br><br> ")
  const answerIndex = answer2Index[q.answer]
  const isLastQuestion = q_idx === n_question

  const [userChoiceIndex, setUserChoiceIndex] = useState<null | number>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [scenario, setScenario] = useState<MessageData[][]>([]);

  const startTextList = [
    '안녕하세요! <br> 당신의 영어 학습 도우미, 글라이디입니다 😊 <br> 문제 풀이 중 도움이 필요하시면 언제든지 채팅으로 편하게 질문해주세요. 아래 제공된 다양한 옵션 중 하나를 선택하여 사용해보는 것도 좋은 방법이에요. 기쁜 마음으로 도와드리겠습니다!',
    '1번 문제를 완료하셨군요! <br> 이제 2번 문제를 시작해봅시다. <br><br> 이해가 잘 되지 않거나 추가 설명이 필요하시면 <br> 언제든지 알려주세요. <br> 도와드리기 위해 여기 있어요! 😇',
    '2번 문제도 잘 해결하셨어요! <br> 이제 3번 문제로 넘어가봅시다. <br><br> 만약 어려움이 있거나 더 깊이 이해하고 싶으시면 언제든지 말씀해주세요. 항상 도와드리기 위해 기다리고 있어요! ',
    '3번 문제까지 모두 해결하셨군요! <br> 이제 2문제밖에 남지 않았어요. <br> 끝까지 완주해보아요 😊 <br><br> 문제를 풀다가 혹시나 헷갈리거나 추가적인 정보가 필요하시면 망설이지 말고 알려주세요!',
    '4번 문제도 성공적으로 마무리하셨네요! <br> 이제 마지막 문제가 남았어요. <br> 화이팅하시고 끝까지 잘 마무리 해봅시다! <br><br> 만약 도움이 필요하시면 언제든지 알려주세요. 함께 끝까지 힘을 합쳐 최선의 결과를 이끌어냅시다!',
  ];

  useEffect(() => {
    setUserChoiceIndex(null);
    setChecked(false);
    updateScenarioData();
  }, [id]);

  const updateScenarioData = async () => {
    // const response = await axios.post('/chat', { questionId: id, text: 'Try a similar example' });
    // const similarExampleId = response.data.response;

    const newScenario: MessageData[][] = [[{
      agent: 'bot',
      type: 'button',
      text: startTextList[isMyQuestion ? q_idx-1 : 0],
      disableInput: false,
      reselectable: true,
      options: [
        { action: 'postback', value: null, text: 'Give me a hint' },
        { action: 'postback', value: null, text: 'Quiz me!' },
        { action: 'postback', value: null, text: 'Try a similar example' },
        { action: 'postback', value: null, text: 'Key vocabulary' },
        { ...
          q_idx === 1 ? { 
            action: 'url', value: q.url, text: messageData.length === 0 ? 'Give me the source for this passage' : 'Source for this passage',
          } : { 
            action: 'postback', value: null, text: 'Translate to Korean' 
          },
        }
      ],
    }]];
    setScenario(newScenario);
  };

  const check = async () => {
    const correct = userChoiceIndex === answerIndex
    dispatch(updateUserQuestion({ questionId: q._id, solved: true, correct: correct }))
      .then(async (result: any) => {
        if (!!result.error) await signOut()
      }
    )
    dispatch(updateOMR({
      index: q_idx - 1, 
      correct: correct
    }))
    setChecked(true)
  };

  const next = () => {
    if (!isLastQuestion) {
      const nextQuestionIdx = q_idx
      const nextId = userCurriculum[nextQuestionIdx].questionId
      router.push(`/question/id/${nextId}`)
    } else {
      router.push(`/question/result`)
    }
  };

  return (
    <QuestionPageDiv id="quiz" className="col-a-center">
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
                        id={`choice_${key}`}
                        type="radio"
                        name="userChoiceIndex"
                        value={idx}
                        checked={userChoiceIndex === idx}
                        onChange={(e) => setUserChoiceIndex(Number(e.target.value))}
                      />
                      <label htmlFor={`choice_${key}`}>{q.choices[key]}</label>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <>
              <div id="answer">
                <div id="answer-info" className="space-between-a-unset">
                  <span className="col-j-end">{q.questionType}</span>
              
                  <span>
                    <div className="row-a-center">
                      <span className="row-a-center mr-2"><i className="tag is-success my-auto"></i>Correct Answer</span>
                      <span className="row-a-center"><i className="tag is-danger my-auto"></i>Incorrect Answer</span>
                    </div>
                    <div className="row-a-center row-j-end"><i className="tag is-light"></i>Your Selection</div>
                  </span>
                </div>
              
                <div id="question" className="space-between mt-5">
                  <i className="has-text-danger">Q</i>
                  <span className="w-100">{q.question}</span>
                </div>
              
                <div id="choices-checked" className="col mt-5">
                  {["a", "b", "c", "d"].map((choice, idx) => (
                    <div className="space-between-a-unset" key={`choice_checked_${idx}`}>
                      <i
                        className={`tag is-large mr-2 bold ${
                          answerIndex === idx
                            ? "is-success"
                            : userChoiceIndex === idx && answerIndex !== idx
                            ? "is-danger"
                            : "is-white"
                        }`}
                      >
                        <span>{idx === 0 ? "A" : idx === 1 ? "B" : idx === 2 ? "C" : "D"}</span>
                      </i>
                      <span className={`choice w-100 px-3 py-2 ${userChoiceIndex === idx ? "has-background-light" : ""}`}>
                        {q.choices[choice]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div id="explanation">
                <h2 className="subtitle bold">Explanation</h2>
              
                <p>Correct Answer: {q.answer.toUpperCase()}</p>
                <p>Your Selection: {userChoiceIndex !== null ? index2Answer[userChoiceIndex] : ""}</p>
              
                <h2 className="subtitle bold mt-5">This is a Negative Factual Information question. </h2>
              
                <div dangerouslySetInnerHTML={{ __html: q_explanation }}></div>
              </div>
            </>
          )}
        </div>

        <div id="article" className="page-item col">
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
            <>
              <h2 id="subtopic">{q.subTopic}</h2>
              <p dangerouslySetInnerHTML={{__html: passageWithHighlight}}></p>
              
              <div className="w-100 row-j-center">
                <h4 id="article-url" className="has-background-light2">
                  Do you wanna check out <a href={q.url} target="_blank" className="underline">this article?</a>
                </h4>
              </div>
            </>
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
        isOpen={q_idx === 1 ? true : isOpenRedux}
        storeMessage={isMyQuestion ? true : false}
        ratingEnable={true}
      />
    </QuestionPageDiv>
  );
};

export default QuestionPage;
