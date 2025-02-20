const express = require("express");
const { OpenAI } = require("openai");
const User = require("../models/User");
const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const router = express.Router();

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_APIKEY,
});

/**
 * Generates a playful joke based on task description and status.
 */
router.post("/generate-joke", async (req, res) => {
  const { description, status, language = "ro" } = req.body;

  if (!description || !status) {
    return res
      .status(400)
      .json({ message: "Description and status are required" });
  }

  try {
    const prompt =
      language === "ro"
        ? `Ești Ionică, un prieten virtual cu un ego mare și o personalitate puternică. Pe baza descrierii: "${description}" și a stării (${status}), creează un comentariu ironic și jucăuș sub 180 de caractere.`
        : `You're Ionica, a virtual friend with a big ego and strong personality. Based on this task: "${description}" and its status (${status}), create a short ironic remark under 180 characters.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
      temperature: 0.7,
    });

    const joke = response.choices[0].message.content.trim();

    return res.json({ message: "Joke generated successfully", joke });
  } catch (error) {
    console.error("Error generating joke:", error);
    return res.status(500).json({ message: "Failed to generate joke" });
  }
});

/**
 * Generates a detailed medical lesson based on a given subject.
 */
const generateLesson = async (subject, language) => {
  try {
    const prompt =
      language === "ro"
        ? `Creează o lecție detaliată despre subiectul: "${subject}". Include:
        - Titlu lecției
        - Paragraf introductiv
        - Secțiuni clare cu titluri și conținut detaliat
        - Liste și tabele unde este nevoie
        - Rezumat final
        - Conţinut foarte lung şi satisfăcător pentru un examen
        - Formatează totul în HTML, începând cu <h1>, fără tag-urile <html> și <body>.`
        : `Create a detailed lesson on the topic: "${subject}". Include:
        - Title of the lesson
        - Introduction paragraph
        - Clearly structured sections with titles and detailed content
        - Lists and tables where needed
        - Summary at the end
        - Format everything in HTML, starting with <h1>, without <html> or <body> tags.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating lesson:", error);
    throw new Error("Error generating lesson content.");
  }
};

/**
 * Generates quiz questions based on a lesson.
 */
const generateQuiz = async (subject, lessonContent, language) => {
  try {
    const prompt =
      language === "ro"
        ? `Generează un set de 15 întrebări cu variante de răspuns bazate pe conținutul următor:
      
      Subiect: ${subject}
      Lecție: ${lessonContent}
      
      Format JSON strict:
      [
        {
          "question": "Ce medicament este utilizat în anestezia locală?",
          "options": { "A": "Lidocaina", "B": "Adrenalina", "C": "Ibuprofen", "D": "Paracetamol" },
          "correctAnswers": ["A"] (include şi multiple răspunsuri corecte["A","B"])
        },
        {
          "question": "Ce medicament este utilizat în anestezia locală?",
          "options": { "A": "Lidocaina", "B": "Adrenalina", "C": "Ibuprofen", "D": "Paracetamol" },
          "correctAnswers": ["A","B"] (include şi multiple răspunsuri corecte["A","B"])
        },
        (...15 questions total)
      ]
      
      Fără text adițional, doar JSON pur.`
        : `Generate a set of 15 multiple-choice questions based on the following:

      Subject: ${subject}
      Lesson: ${lessonContent}
      
      Strict JSON format:
      [
        {
          "question": "Which medication is used for local anesthesia?",
          "options": { "A": "Lidocaine", "B": "Adrenaline", "C": "Ibuprofen", "D": "Paracetamol" },
          "correctAnswers": ["A","B"] (include also multiple correct answers ["A","B"])
        },
        {
          "question": "Which medication is used for local anesthesia?",
          "options": { "A": "Lidocaine", "B": "Adrenaline", "C": "Ibuprofen", "D": "Paracetamol" },
          "correctAnswers": ["A"] (include also multiple correct answers ["A","B"])
        },
        (...15 questions total)
      ]
      
      Return only pure JSON, without extra text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let jsonText = response.choices[0].message.content.trim();

    // Clean up the code block markers and surrounding whitespace
    jsonText = jsonText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Ensure there are no newline characters or other non-JSON text
    jsonText = jsonText.replace(/(\r\n|\n|\r)/gm, ""); // Remove newlines
    jsonText = jsonText.trim(); // Ensure no leading/trailing spaces

    // Try parsing the cleaned-up JSON
    const quizQuestions = JSON.parse(jsonText);

    return quizQuestions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    console.error("Error details:", error);
    throw new Error("Error generating quiz questions.");
  }
};

router.post("/generate-lesson-and-quiz", async (req, res) => {
  const { userId, subject, language = "ro" } = req.body;

  if (!subject || !userId) {
    return res.status(400).json({ error: "Subject and userId are required" });
  }

  try {
    // Step 1: Generate the lesson
    const lessonContent = await generateLesson(subject, language);

    // Step 2: Save the lesson
    const lesson = new Lesson({
      title: `Lesson on ${subject}`,
      content: lessonContent,
      subject: subject,
      user: userId, // Linking lesson to user
    });

    await lesson.save();

    // Step 3: Generate the quiz
    const quizQuestions = await generateQuiz(subject, lessonContent, language);

    // Step 4: Save the quiz
    const quiz = new Quiz({
      lesson: lesson._id,
      totalQuestions: quizQuestions.length,
      passingScore: 100,
      user: userId,
      questions: [],
    });

    await quiz.save();

    // Step 5: Save the quiz questions
    for (const q of quizQuestions) {
      const question = new Question({
        quiz: quiz._id,
        questionText: q.question,
        answerChoices: Object.values(q.options),
        correctAnswers: q.correctAnswers,
      });

      await question.save();
      quiz.questions.push(question._id);
    }

    // Step 6: Save the updated quiz with question references
    await quiz.save();

    // Step 7: Update the lesson with quiz reference
    lesson.quizzes = lesson.quizzes || [];
    lesson.quizzes.push(quiz._id);
    await lesson.save();

    // Step 8: Update the user's lessons and quizzes
    const user = await User.findById(userId);
    user.lessons.push(lesson._id);
    user.quizzes.push(quiz._id);
    await user.save();

    return res.json({ lessonId: lesson._id });
  } catch (error) {
    console.error("Error generating and saving lesson and quiz:", error);
    return res.status(500).json({
      error:
        "An error occurred while generating and saving the lesson and quiz.",
    });
  }
});

module.exports = router;
