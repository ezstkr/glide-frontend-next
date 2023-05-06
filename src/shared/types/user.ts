
type UpdateUserQuestion = {
    questionId: string
    solved: boolean
    correct: boolean
}

type CreateCurriculumForm = {
    [key: string]: any,
    newbie?: boolean,
    difficulty?: number,
    topics?: string[],
}


export type { UpdateUserQuestion, CreateCurriculumForm }