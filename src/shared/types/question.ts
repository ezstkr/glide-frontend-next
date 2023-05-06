
type Question = {
  _id: string,
  question: string, // 질문
  passage: string, // 지문
  choices: { // 보기
    a: string,
    b: string,
    c: string,
    d: string,
  }, 
  answer: string, // 정답
  explanation: string, // 해설
  topic: string, // 주제
  subTopic: string, // 소주제
  questionType: string, // 문제 유형
  difficulty: number, // 문제의 난이도
  url: string, // article url
  highlight: Array<Highlight>,
  length: number, // passage의 문장 수
  sentences: string[] // passage를 구성하는 문장들
  createdAt: string, // <date-time>
  updatedAt: string, // <date-time>
}

const QuestionInit: Question = {
  _id: String(),
  question: String(),
  passage: String(),
  choices: {
    a: String(),
    b: String(),
    c: String(),
    d: String(),
  }, 
  answer: String(),
  explanation: String(),
  topic: String(),
  subTopic: String(),
  questionType: String(),
  difficulty: Number(),
  url: String(),
  highlight: Array(),
  length: Number(),
  sentences: Array(),
  createdAt: String(),
  updatedAt: String(),
}

type Highlight = {
  choice: string,
  sentence: string,
  correct: boolean,
}

type GetQuestion = {
  id: string,
}

type NextQuestion = {
  questionId: string,
}

type GetNextQuestion = {
  onlyUnsolved?: boolean,
}

type Answer2Index = {
  [key: string]: number
}

type Index2Answer = {
  [key: number]: string
}

type Answer2Symbol = {
  [key: string]: string
}


export { QuestionInit }
export type { Question, GetQuestion, NextQuestion, GetNextQuestion, Answer2Index, Index2Answer, Answer2Symbol }
