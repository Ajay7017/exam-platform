import mammoth from 'mammoth'

export interface ParsedQuestion {
  statement: string
  statementImage?: string // Image in question statement
  options: {
    key: 'A' | 'B' | 'C' | 'D'
    text: string
    imageUrl?: string // Image in option
  }[]
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  marks: number
  negativeMarks: number
  difficulty: 'easy' | 'medium' | 'hard'
  explanation?: string
}

export interface ImageMapping {
  [filename: string]: string // filename -> URL
}

/**
 * Parse Word document and extract questions
 */
export async function parseWordDocument(
  fileBuffer: Buffer,
  imageMapping: ImageMapping
): Promise<{ questions: ParsedQuestion[]; errors: string[] }> {
  // Extract text from Word
  const result = await mammoth.extractRawText({
    buffer: fileBuffer,
  })

  const text = result.value

  // Split by delimiter (---)
  const sections = text.split('---').map(s => s.trim()).filter(Boolean)

  const questions: ParsedQuestion[] = []
  const errors: string[] = []

  sections.forEach((section, sectionIndex) => {
    try {
      const question = parseQuestionSection(section, imageMapping)
      questions.push(question)
    } catch (error: any) {
      errors.push(`Question ${sectionIndex + 1}: ${error.message}`)
    }
  })

  return { questions, errors }
}

/**
 * Parse a single question section
 */
function parseQuestionSection(
  section: string,
  imageMapping: ImageMapping
): ParsedQuestion {
  const lines = section.split('\n').map(l => l.trim()).filter(Boolean)

  if (lines.length === 0) {
    throw new Error('Empty question section')
  }

  // Extract statement (everything before options)
  let statement = ''
  let statementImage: string | undefined
  let i = 0

  while (i < lines.length && !lines[i].match(/^[A-D]\)/)) {
    const line = lines[i]

    // Check for image tag
    const imageMatch = line.match(/\[IMAGE:\s*([^\]]+)\]/)
    if (imageMatch) {
      const filename = imageMatch[1].trim()
      const url = imageMapping[filename] || imageMapping[filename.toLowerCase()]

      if (url) {
        statementImage = url
      } else {
        throw new Error(`Image not found: ${filename}`)
      }
    } else {
      statement += line + ' '
    }

    i++
  }

  statement = statement.trim()

  if (!statement) {
    throw new Error('Question statement is empty')
  }

  // Extract options
  const options: ParsedQuestion['options'] = []

  while (i < lines.length && lines[i].match(/^[A-D]\)/)) {
    const line = lines[i]
    const match = line.match(/^([A-D])\)\s*(.+)$/)

    if (match) {
      const key = match[1] as 'A' | 'B' | 'C' | 'D'
      let text = match[2]
      let optionImage: string | undefined

      // Check for image in option
      const imageMatch = text.match(/\[IMAGE:\s*([^\]]+)\]/)
      if (imageMatch) {
        const filename = imageMatch[1].trim()
        const url = imageMapping[filename] || imageMapping[filename.toLowerCase()]

        if (url) {
          optionImage = url
          text = text.replace(/\[IMAGE:\s*[^\]]+\]/, '').trim()
        }
      }

      options.push({
        key,
        text,
        imageUrl: optionImage,
      })
    }

    i++
  }

  if (options.length !== 4) {
    throw new Error(`Expected 4 options, found ${options.length}`)
  }

  // Extract metadata
  let correctAnswer: 'A' | 'B' | 'C' | 'D' | undefined
  let marks = 1
  let negativeMarks = 0.25
  let difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  let explanation: string | undefined

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('ANSWER:')) {
      const answer = line.replace('ANSWER:', '').trim().toUpperCase()
      if (!['A', 'B', 'C', 'D'].includes(answer)) {
        throw new Error(`Invalid answer: ${answer}`)
      }
      correctAnswer = answer as 'A' | 'B' | 'C' | 'D'
    } else if (line.startsWith('MARKS:')) {
      marks = parseInt(line.replace('MARKS:', '').trim())
      if (isNaN(marks) || marks <= 0) {
        throw new Error(`Invalid marks: ${line}`)
      }
    } else if (line.startsWith('NEGATIVE:')) {
      negativeMarks = parseFloat(line.replace('NEGATIVE:', '').trim())
      if (isNaN(negativeMarks) || negativeMarks < 0) {
        throw new Error(`Invalid negative marks: ${line}`)
      }
    } else if (line.startsWith('DIFFICULTY:')) {
      const diff = line.replace('DIFFICULTY:', '').trim().toLowerCase()
      if (!['easy', 'medium', 'hard'].includes(diff)) {
        throw new Error(`Invalid difficulty: ${diff}`)
      }
      difficulty = diff as 'easy' | 'medium' | 'hard'
    } else if (line.startsWith('EXPLANATION:')) {
      explanation = line.replace('EXPLANATION:', '').trim()
      // Collect remaining lines as explanation
      i++
      while (i < lines.length) {
        explanation += ' ' + lines[i]
        i++
      }
      break
    }

    i++
  }

  if (!correctAnswer) {
    throw new Error('Missing ANSWER field')
  }

  return {
    statement,
    statementImage,
    options,
    correctAnswer,
    marks,
    negativeMarks,
    difficulty,
    explanation,
  }
}

/**
 * Parse CSV mapping file
 */
export function parseCSVMapping(csvContent: string): ImageMapping {
  const lines = csvContent.split('\n').map(l => l.trim()).filter(Boolean)

  // Skip header
  const dataLines = lines.slice(1)

  const mapping: ImageMapping = {}

  dataLines.forEach(line => {
    const [filename, url] = line.split(',').map(s => s.trim())
    if (filename && url) {
      mapping[filename] = url
      // Also add lowercase version
      mapping[filename.toLowerCase()] = url
    }
  })

  return mapping
}

/**
 * Validate parsed questions
 */
export function validateQuestions(
  questions: ParsedQuestion[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (questions.length === 0) {
    errors.push('No questions found in document')
  }

  questions.forEach((q, index) => {
    const questionNum = index + 1

    if (!q.statement) {
      errors.push(`Question ${questionNum}: Missing statement`)
    }

    if (q.options.length !== 4) {
      errors.push(`Question ${questionNum}: Must have exactly 4 options`)
    }

    if (!q.correctAnswer) {
      errors.push(`Question ${questionNum}: Missing correct answer`)
    }

    if (q.marks <= 0) {
      errors.push(`Question ${questionNum}: Marks must be positive`)
    }

    if (q.negativeMarks < 0) {
      errors.push(`Question ${questionNum}: Negative marks cannot be negative`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}