'use strict'

const isDateValid = (dateString) => {
  // return moment(dateString, 'YYYY-MM-DD', true).isValid()
  // date format is 'YYYY-MM-DD'
  return /^(\d{4})-(\d{1,2})-(\d{1,2})$/.test(dateString)
}

const addCompletion = (arg, tokens) => {
  if (tokens[0] === 'x') {
    arg.completion = 'x'
    return tokens.slice(1)
  }

  arg.completion = null
  return tokens
}


const priorityMarkers = ['(A)', '(B)', '(C)', '(D)', '(E)']
const addPriority = (arg, tokens) => {
  if (priorityMarkers.indexOf(tokens[0]) > -1) {
    arg.priority = tokens[0]
    return tokens.slice(1)
  }

  arg.priority = null
  return tokens
}

const addDates = (arg, tokens) => {
  const [A, B] = tokens
  const isDateAvalid = isDateValid(A)
  const isDateBvalid = isDateValid(B)

  if (isDateAvalid && isDateBvalid) {
    arg.completionDate = A
    arg.creationDate = B

    return tokens.slice(2)
  }
  else if(isDateAvalid) {
    if (arg.completion) {
      arg.completionDate = A
      arg.creationDate = null
    }
    else {
      arg.creationDate = A
      arg.completionDate = null
    }

    return tokens.slice(1)
  }

  arg.completionDate = null
  arg.creationDate = null
  return tokens
}

const addDescription = (arg, tokens) => {
  arg.description = tokens.join(' ')

  return tokens
}

const addTags = (arg, tokens) => {
  arg.tags = arg.tags || []
  for (const token of tokens) {
    const tagBits = token.split(':')
    if (tagBits.length === 2) {
      const tag = Object.create(null)
      tag[tagBits[0]] = tagBits[1]

      arg.tags.push(tag)
    }
  }

  return tokens
}

const addProjectsAndContexts = (arg, tokens) => {
  const projects = []
  const contexts = []

  for (const token of tokens) {
    if (token.startsWith('+')) {
      const project = token.slice(1)
      projects.push(project)
    } else if (token.startsWith('@')) {
      const context = token.slice(1)
      contexts.push(context)
    }
  }

  arg.projects = projects.join(' ')
  arg.contexts = contexts.join(' ')

  return tokens
}

const getTokens = (str) => {
  return (
    str.split(' ')
    .map(t => t.trim())
    .filter(t => !!t)
  )
}

const parseTodoStr = (str) => {
  const res = Object.create(null)
  res.text = str
  const tokens = getTokens(str)

  addTags(res,
    addProjectsAndContexts(res,
      addDescription(res,
        addDates(res,
          addPriority(res,
            addCompletion(res, tokens)
          )
        )
      )
    )
  )

  return res
}

// const data = [
  /*'call mom',
  'x check the message',
  '(A) text tom',
  'x (C) check home work',
  '2019-12-30 visit the city',
  '2019-11-04 2019-12-16 complete my studies',
  'check the new task +work +task', */
  /*'create additional tasks @work',
  'create additional tasks +tasks @phone', */

  // https://github.com/todotxt/todo.txt
  /*'(A) Thank Mom for the meatballs @phone',
  '(B) Schedule Goodwill pickup +GarageSale @phone',
  'Post signs around the neighborhood +GarageSale',
  '@GroceryStore Eskimo pies',

  '(A) Call Mom',
  'Really gotta call Mom (A) @phone @someday',
  '(b) Get back to the boss',
  '(B)->Submit TPS report'

  '2011-03-02 Document +TodoTxt task format',
  '(A) 2011-03-02 Call Mom',
  '(A) Call Mom 2011-03-02'

  '(A) Call Mom +Family +PeaceLoveAndHappiness @iphone @phone',
  'Email SoAndSo at soandso@example.com',
  'Learn how to add 2+2'

  'x 2011-03-03 Call Mom',
  'xylophone lesson',
  'X 2012-01-01 Make resolutions',
  '(A) x Find ticket prices'
  */
  /*
  'x 2011-03-02 2011-03-01 Review Tim\'s pull request +TodoTxtTouch @github',
  '2011-03-03 Call Mom',
  'x 2011-03-03 Call Mom',
  'x check the message',
  '(A) Call Mom +Family +PeaceLoveAndHappiness @iphone @phone',
  'test additional tags like due:2010-01-02'
  // */
// ].map(parseTodoStr)

// console.log(data.map(i => JSON.stringify(i.tags)))
// console.log(data)
module.exports.parseTodoStr = parseTodoStr
