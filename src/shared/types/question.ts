
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

// const QuestionInit: Question = {
//   _id: String(),
//   question: String(),
//   passage: String(),
//   choices: {
//     a: String(),
//     b: String(),
//     c: String(),
//     d: String(),
//   }, 
//   answer: String(),
//   explanation: String(),
//   topic: String(),
//   subTopic: String(),
//   questionType: String(),
//   difficulty: Number(),
//   url: String(),
//   highlight: Array(),
//   length: Number(),
//   sentences: Array(),
//   createdAt: String(),
//   updatedAt: String(),
// }

const QuestionInit: Question = {
  _id: "64254b4c6ffe80a6f86851a0",
  question: "According to the passage, all of the following statements are true of Prohibition EXCEPT",
  passage: "It was during the same climate of liberal progress that Prohibition—the banning of the sale of alcohol—was implemented in the United States. Prohibitionists, people who advocated for Prohibition, favored the ban as a way to reduce alcohol-related crime. For example, women's groups sought to protect women and children from domestic abuse. Other Prohibitionists were opposed to the political corruption that was linked to saloons and pubs. However, the result of putting Prohibition into effect was not what Prohibitionists had expected. Instead, crime rates soared as the illegal consumption of alcohol rose. Criminal gangs took over the sale of alcohol from legitimate businesses and created a black market for the distribution of alcoholic beverages. They opened underground pubs, known as \"speakeasies,\" where people openly drank alcoholic beverages, and gang members bribed police with lucrative payments in order to keep the doors open. Gangsters were not the only people to cash in on the ban on legal sales of alcohol, however. Doctors and pharmacists of the Prohibition era made extra cash by writing prescriptions for \"medicinal alcohol,\" which was nothing more than ordinary whiskey, liquor, or wine.",
  choices: {
    a: "Different kinds of alcohol were sold as medicine.",
    b: "Illegal distribution of alcohol became a new method for gangsters to earn money.",
    c: "Prohibition helped to reduce alcohol-related crimes in the United States.",
    d: "Prohibitionists supported it in the hope that it would decrease alcohol-related crime."
  },
  answer: "c",
  explanation: 'explanation',
  topic: "natural sciences",
  subTopic: "biology",
  questionType: "negative factual",
  difficulty: 3,
  url: 'url',
  highlight: [],
  length: 10,
  sentences: [
    "It was during the same climate of liberal progress that Prohibition—the banning of the sale of alcohol—was implemented in the United States."
  ],
  createdAt: "2023-03-30T05:12:10.421+00:00",
  updatedAt: "2023-03-30T05:12:10.421+00:00"
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
