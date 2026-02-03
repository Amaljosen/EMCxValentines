import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './App.css'

function View() {
  const backgroundImage = "https://img.freepik.com/premium-photo/valentine39s-day-love-background-with-red-pink-hearts-romantic-celebration_1294860-22831.jpg?w=360"
  const { gameId } = useParams()
  
  const [gameData, setGameData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [playerView, setPlayerView] = useState('start')
  const [playerName, setPlayerName] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showScoreMessage, setShowScoreMessage] = useState(false)

  useEffect(() => {
    fetchGameData()
  }, [gameId])

  const fetchGameData = async () => {
    try {
      setLoading(true)
      
      // Try to fetch from API first
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${gameId}`)
        if (response.data) {
          setGameData(response.data)
          console.log("✅ Data loaded from API:", response.data)
        }
      } catch (apiError) {
        console.log("⚠️ API not available, trying localStorage")
      }
      
      // Fallback to localStorage
      const localData = localStorage.getItem(`lovegame_${gameId}`)
      if (localData) {
        setGameData(JSON.parse(localData))
        console.log("📦 Data loaded from localStorage:", JSON.parse(localData))
      } else {
        setError('Quiz not found. Please check the link.')
      }
    } catch (error) {
      console.error("❌ Error loading game:", error)
      setError('Failed to load quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStart = () => {
    if (!playerName.trim()) {
      alert('💕 Please enter your name!')
      return
    }
    setPlayerView('playing')
  }

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex)
  }

  const handleNext = () => {
    if (selectedAnswer === null) {
      alert('💝 Please select an answer!')
      return
    }

    const question = gameData.questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === question.correctOption
    const points = isCorrect ? 2 : 0

    setScore(score + points)

    setAnswers([...answers, {
      questionId: question.id,
      question: question.text,
      selected: selectedAnswer,
      isCorrect: isCorrect,
      points: points
    }])

    if (currentQuestionIndex < gameData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
    } else {
      setPlayerView('result')
      setTimeout(() => setShowScoreMessage(true), 500)
    }
  }

  const resetGame = () => {
    setPlayerView('start')
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setAnswers([])
    setShowScoreMessage(false)
  }

  const getScoreMessage = () => {
    if (!gameData || !gameData.gameInfo) return null
    
    const totalPossible = gameData.questions.length * 2
    const percentage = (score / totalPossible) * 100
    
    let scoreRange = gameData.gameInfo.scoringSystem
    let messageData
    
    if (score >= scoreRange.perfect.min) {
      messageData = scoreRange.perfect.message
    } else if (score >= scoreRange.good.min) {
      messageData = scoreRange.good.message
    } else {
      messageData = scoreRange.low.message
    }
    
    return messageData
  }

  const getScoreLevel = () => {
    if (!gameData || !gameData.gameInfo) return 'low'
    
    const scoreRange = gameData.gameInfo.scoringSystem
    if (score >= scoreRange.perfect.min) return 'perfect'
    if (score >= scoreRange.good.min) return 'good'
    return 'low'
  }

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-pink-200/50 text-center">
          <div className="text-6xl mb-4 animate-pulse">💖</div>
          <p className="text-pink-600 font-medium">Loading Love Quiz...</p>
          <div className="mt-4 w-16 h-1 bg-pink-300 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (error || !gameData) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-pink-200/50 text-center max-w-md">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Not Found</h2>
          <p className="text-pink-600 mb-6">{error || 'The quiz link is invalid or expired.'}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const { gameInfo, questions } = gameData

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-900/20 via-red-900/10 to-purple-900/15 backdrop-blur-[2px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* START SCREEN */}
        {playerView === 'start' && (
          <div className="flex items-center justify-center min-h-[90vh]">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 w-full border border-pink-200/50">
              <div className="text-center">
                {gameInfo.couplePhoto && (
                  <div className="mb-6">
                    <img 
                      src={gameInfo.couplePhoto} 
                      alt="Couple" 
                      className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full object-cover border-4 border-white shadow-xl"
                    />
                  </div>
                )}
                
                <div className="text-6xl mb-4">💌</div>
                <p className="text-sm text-pink-500 mb-2">
                  {gameInfo.creatorName} made you a Love Quiz
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  {gameInfo.title}
                </h1>
                
                <div className="bg-gradient-to-r from-pink-50 to-red-50/50 rounded-xl p-4 mb-6 border border-pink-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-pink-600">From:</span>
                      <span className="font-semibold">{gameInfo.creatorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-pink-600">For:</span>
                      <span className="font-semibold text-pink-600">{gameInfo.theirName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-pink-600">Questions:</span>
                      <span className="font-semibold">{questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-pink-600">Scoring:</span>
                      <span className="font-semibold">
                        {gameInfo.totalQuestions === 5 
                          ? "2 points per question"
                          : "2 points per question"
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder={`Enter your name, ${gameInfo.theirName}`}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none text-center bg-white/70"
                  />
                </div>

                <button
                  onClick={handleStart}
                  className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-pink-500/30"
                >
                  Start Love Quiz 💘
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PLAYING SCREEN */}
        {playerView === 'playing' && (
          <div className="space-y-6 pt-4">
            {/* Progress Bar */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow p-4 border border-pink-200/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm font-semibold text-pink-600">
                  Score: {score} points
                </span>
              </div>
              <div className="w-full bg-pink-100 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-pink-200/50">
              {questions[currentQuestionIndex].questionImage && (
                <img
                  src={questions[currentQuestionIndex].questionImage}
                  alt="Question"
                  className="w-full h-48 md:h-64 object-cover rounded-xl mb-6 shadow"
                />
              )}

              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">
                {questions[currentQuestionIndex].text}
              </h2>

              {/* Options */}
              <div className="space-y-4 mb-8">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${selectedAnswer === index
                      ? 'border-pink-500 bg-gradient-to-r from-pink-50 to-red-50/50 shadow-md'
                      : 'border-pink-200 bg-white/80 hover:border-pink-300 hover:bg-pink-50/30'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${selectedAnswer === index
                        ? 'border-pink-500 bg-pink-500 text-white'
                        : 'border-pink-300'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      
                      {option.type === 'text' ? (
                        <span className="text-gray-700">{option.value}</span>
                      ) : (
                        <div className="flex-1">
                          <img 
                            src={option.image} 
                            alt={`Option ${index + 1}`} 
                            className="w-full h-24 md:h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className={`w-full py-4 px-6 rounded-xl font-bold transition-all transform ${selectedAnswer === null
                  ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white hover:scale-[1.02] shadow-lg shadow-pink-500/30'
                }`}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question 💕' : 'See Results ✨'}
              </button>
            </div>
          </div>
        )}

        {/* RESULT SCREEN */}
        {playerView === 'result' && (
          <div className="flex items-center justify-center min-h-[90vh]">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 w-full border border-pink-200/50">
              <div className="text-center">
                {gameInfo.couplePhoto && (
                  <img 
                    src={gameInfo.couplePhoto} 
                    alt="Couple" 
                    className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow-lg mb-4"
                  />
                )}
                
                <div className="text-6xl mb-2">
                  {getScoreLevel() === 'perfect' ? '🏆' : 
                   getScoreLevel() === 'good' ? '🎯' : '💝'}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Your Love Score
                </h2>
                <div className="text-5xl md:text-6xl font-bold text-red-500 mb-4 animate-pulse">
                  {score}/{questions.length * 2}
                </div>
                
                <div className="mb-6">
                  <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                    getScoreLevel() === 'perfect' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-600' :
                    getScoreLevel() === 'good' ? 'bg-gradient-to-r from-pink-100 to-red-100 text-pink-600' :
                    'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600'
                  }`}>
                    {getScoreLevel() === 'perfect' ? 'Perfect!' : 
                     getScoreLevel() === 'good' ? 'Great Job!' : 'Keep Loving!'}
                  </span>
                </div>

                {/* Score Message */}
                {showScoreMessage && getScoreMessage() && (
                  <div className="bg-gradient-to-r from-pink-50 to-red-50/50 rounded-xl p-6 mb-6 border border-pink-200 animate-fadeIn">
                    {getScoreMessage().type === 'text' ? (
                      <p className="text-lg md:text-xl font-semibold text-gray-800">
                        {getScoreMessage().text}
                      </p>
                    ) : (
                      <div>
                        <img 
                          src={getScoreMessage().image} 
                          alt="Score message" 
                          className="w-full h-48 md:h-64 object-cover rounded-xl mb-3"
                        />
                        <p className="text-pink-600 text-sm">
                          From {gameInfo.creatorName} with love 💝
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Answers Review */}
                <div className="text-left mb-6">
                  <h3 className="font-bold text-gray-800 mb-3 text-center">Your Answers:</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {answers.map((answer, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg text-sm ${answer.isCorrect 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50/50 border border-green-200' 
                          : 'bg-gradient-to-r from-red-50 to-pink-50/50 border border-red-200'
                        }`}
                      >
                        <p className="font-semibold text-gray-700">Q{index + 1}: {answer.question}</p>
                        <p className={`text-xs mt-1 ${answer.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                          {answer.isCorrect ? '✅ Correct +2 points' : '❌ Incorrect 0 points'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={resetGame}
                    className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-pink-500/30"
                  >
                    Play Again 💕
                  </button>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/30"
                  >
                    Create Your Own Quiz ✨
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default View