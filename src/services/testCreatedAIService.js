const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // валидации параметров
  const validateRequestParams = ( text, count, language )=>{
    const errors = [];
  
    if (!text) {
      errors.push('Поле "text" обязательно');
    } else if (typeof text !== 'string') {
      errors.push('Поле "text" должно быть строкой');
    } else if (text.trim().length < 10) {
      errors.push('Поле "text" должно содержать минимум 10 символов');
    }
  
    if (!count) {
      errors.push('Поле "count" обязательно');
    } else if (typeof count !== 'number') {
      errors.push('Поле "count" должно быть числом');
    } else if (!Number.isInteger(count)) {
      errors.push('Поле "count" должно быть целым числом');
    } else if (count < 1) {
      errors.push('Поле "count" должно быть больше 0');
    } else if (count > 20) {
      errors.push('Поле "count" не должно превышать 20');
    }
  
    if (!language) {
      errors.push('Поле "language" обязательно');
    } else if (typeof language !== 'string') {
      errors.push('Поле "language" должно быть строкой');
    }
  
    return errors;
  }

  //генерации вопросов
  const generateQuestions= async (text, count, language, attempt = 1)=>{
    if (attempt > 3) throw new Error('Не удалось сгенерировать корректный JSON после 3 попыток');
  
    try {
      const maxTokens = Math.min(count * 300 + 1000, 8000); // Динамический max_tokens: 300 токенов на вопрос + 1000 базовых
      const prompt = `Сгенерируй ${count} экстремально сложных тестовых вопросов по теме "${text}" на языке ${language}.  
      Вопросы должны быть уровня академических исследований, олимпиад или международных соревнований, требующих глубоких знаний, анализа и нестандартного мышления.  
     Вопросы должны быть красиво оформлены и легко читаемы для человека без специальной обработки: избегай использования сырых LaTeX-выражений (например, "\\( \\int_{0}^{\\infty} x^2 e^{-x} \\, dx \\)"), вместо этого описывай формулы или концепции словами или спецсимволами,если таковые имеються. 
      Поле "correct" должно быть строго правильным с точки зрения фактов и соответствовать вопросу.  
      Ответ строго в JSON-формате без пояснений:
  
      \`\`\`json
      {
        "questions": [
          {
            "question": "Какова главная теорема Гёделя о неполноте?",
            "options": [
              "Любая формальная система является полной и непротиворечивой",
              "Любая формальная система, содержащая арифметику, либо неполна, либо противоречива",
              "Математика полностью формализуема",
              "Существует алгоритм, доказывающий все истинные утверждения"
            ],
            "correct": "Любая формальная система, содержащая арифметику, либо неполна, либо противоречива",
            "difficulty": "hard"
          }
        ]
      }
      \`\`\`  
  
      - Ответ только JSON, без пояснений.  
      - Поле "correct" всегда должно быть одним из "options".  
      - Генерируй только сложнейшие вопросы уровня эксперта.`;
  
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Ты эксперт, создающий сложные тесты. Отвечай только JSON-структурой, без пояснений.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
        temperature: 0.8,
        presence_penalty: 0.5,
      });
  
      const result = response.choices[0]?.message?.content?.trim();
      if (!result) throw new Error('Пустой ответ от OpenAI');
  
     
  
      // Попытка извлечь JSON
      const match = result.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('Некорректный JSON в ответе');
  
      const jsonString = match[0];
    
  
      // Попытка парсинга
      const parsedData = JSON.parse(jsonString);
  
      // Проверка структуры
      if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
        throw new Error('Ответ должен содержать поле "questions" в виде массива');
      }
  
      return parsedData;
    } catch (error) {
      console.error(`Ошибка при генерации вопросов (попытка ${attempt}):`, error);
      if (error instanceof SyntaxError || error.message.includes('Некорректный JSON')) {
        // Повторяем попытку с увеличенным max_tokens
        return generateQuestions(text, count, language, attempt + 1);
      }
      throw new Error('Ошибка генерации тестов: ' + error.message);
    }
  }


  // проверки и исправления ответов
  const  validateAnswers=async(questionsData, attempt = 1)=>{
    if (attempt > 2) throw new Error('Ошибка проверки тестов после 2 попыток');
  
    const questions = questionsData.questions;
  
    try {
      // Локальная проверка структуры
      const validatedQuestions = questions.map((question, index) => {
        const fixedQuestion = { ...question };
  
        if (!fixedQuestion.question || typeof fixedQuestion.question !== 'string') {
          console.warn(`Вопрос ${index + 1}: Поле "question" некорректно`);
          fixedQuestion.question = `Исправленный вопрос ${index + 1}`;
        }
  
        if (!Array.isArray(fixedQuestion.options) || fixedQuestion.options.length < 2) {
          console.warn(`Вопрос ${index + 1}: Поле "options" некорректно`);
          fixedQuestion.options = ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'];
        }
  
        if (!fixedQuestion.correct || typeof fixedQuestion.correct !== 'string') {
          console.warn(`Вопрос ${index + 1}: Поле "correct" некорректно`);
          fixedQuestion.correct = fixedQuestion.options[0];
        } else if (!fixedQuestion.options.includes(fixedQuestion.correct)) {
          console.warn(`Вопрос ${index + 1}: Поле "correct" не входит в "options"`);
          fixedQuestion.correct = fixedQuestion.options[0];
        }
  
        if (!fixedQuestion.difficulty || typeof fixedQuestion.difficulty !== 'string') {
          console.warn(`Вопрос ${index + 1}: Поле "difficulty" некорректно`);
          fixedQuestion.difficulty = 'extreme';
        }
  
        return fixedQuestion;
      });
  
      // Проверка правильности ответа через OpenAI
      const prompt = `Дан список вопросов и варианты ответа. Проверь и исправь поле "correct", чтобы оно было строго правильным с точки зрения фактов. Ответ только в формате JSON:
  
      \`\`\`json
      ${JSON.stringify({ questions: validatedQuestions }, null, 2)}
      \`\`\`
  
      - "correct" всегда должен входить в "options".
      - Ответ только JSON, без пояснений.`;
  
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Ты эксперт, определяющий правильный ответ на вопрос. Отвечай только JSON, без пояснений.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: Math.min(validatedQuestions.length * 200 + 500, 8000),
        temperature: 0.2,
      });
  
      const result = response.choices[0]?.message?.content?.trim();
      if (!result) throw new Error('Пустой ответ от OpenAI');
  
    
  
      const match = result.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('Некорректный JSON в ответе');
  
      const jsonString = match[0];
     
  
      const parsedData = JSON.parse(jsonString);
  
      if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
        throw new Error('Ответ должен содержать поле "questions" в виде массива');
      }
  
      return parsedData;
    } catch (error) {
      console.error(`Ошибка при проверке ответов (попытка ${attempt}):`, error);
      return validateAnswers(questionsData, attempt + 1);
    }
  }

 module.exports={
    validateAnswers,
    validateRequestParams,
    generateQuestions
  }

