import { useState } from 'react'
import axios from 'axios'
import { 
  Heart, 
  User, 
  Users, 
  Image as ImageIcon,
  Type, 
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Check,
  MessageSquare,
  Trophy,
  Star,
  Sparkles,
  Share2,
  Copy,
  Eye,
  FileText,
  Award,
  X,
  Gift,
  Edit2,
  Save,
  AlertCircle,
  CheckCircle,
  Radio,
  TextCursor
} from 'lucide-react'
import './App.css'

function Create() {
  const backgroundImage = "https://img.freepik.com/premium-photo/valentine39s-day-love-background-with-red-pink-hearts-romantic-celebration_1294860-22831.jpg?w=360"
  
  const [step, setStep] = useState(1)
  const [gameTitle, setGameTitle] = useState('')
  const [creatorName, setCreatorName] = useState('')
  const [couplePhoto, setCouplePhoto] = useState(null)
  const [theirName, setTheirName] = useState('')
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState({
    id: null,
    text: '',
    type: 'options', // 'options' or 'text'
    image: null,
    options: ['', '', '', ''],
    correctOption: 0,
  })
  
  // Scoring messages with both text and image
  const [messages, setMessages] = useState({
    perfect: {
      text: "Perfect! You know everything about me! ❤️",
      image: null,
      type: 'text',
      imageCaption: ''
    },
    good: {
      text: "Great! You know me pretty well! 💕",
      image: null,
      type: 'text',
      imageCaption: ''
    },
    low: {
      text: "Let's spend more time together! 😘",
      image: null,
      type: 'text',
      imageCaption: ''
    }
  })

  // Love Reveal
  const [loveReveal, setLoveReveal] = useState({
    enabled: true,
    title: '',
    image: null,
    text: '',
    type: 'text'
  })

  const [loading, setLoading] = useState(false)
  const [shareLink, setShareLink] = useState('')
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    type: 'info'
  })

  const showMessage = (title, message, type = 'info') => {
    setModalContent({ title, message, type })
    setShowModal(true)
  }

  // API Configuration - Replace with your actual backend URL
  const API_BASE_URL = "https://your-backend-api.com/api/create-quiz"

  const handleImageUpload = (e, type, messageType = null) => {
    const file = e.target.files[0]
    
    if (!file) return
    
    // Validate file size (10MB = 10 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_FILE_SIZE) {
      showMessage(
        'File Too Large',
        `Image size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds 10MB limit. Please choose a smaller image.`,
        'error'
      )
      return
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage('Invalid File', 'Please select an image file (JPEG, PNG, etc.)', 'error')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'couple') {
        setCouplePhoto(reader.result)
      } else if (type === 'question') {
        setCurrentQuestion({ ...currentQuestion, image: reader.result })
      } else if (type === 'message' && messageType) {
        setMessages({
          ...messages,
          [messageType]: {
            ...messages[messageType],
            type: messages[messageType].type, // Keep current type
            image: reader.result,
            text: messages[messageType].text,
            imageCaption: messages[messageType].imageCaption || `A special image for ${theirName}`
          }
        })
      } else if (type === 'reveal') {
        setLoveReveal({
          ...loveReveal,
          type: 'image',
          image: reader.result
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleMessageTypeChange = (messageType, type) => {
    setMessages({
      ...messages,
      [messageType]: {
        ...messages[messageType],
        type: type,
        image: type === 'text' ? messages[messageType].image : messages[messageType].image, // Keep image even when switching to text
        text: messages[messageType].text,
        imageCaption: messages[messageType].imageCaption || ''
      }
    })
  }

  const handleMessageTextChange = (messageType, text) => {
    setMessages({
      ...messages,
      [messageType]: {
        ...messages[messageType],
        text: text
      }
    })
  }

  const handleImageCaptionChange = (messageType, caption) => {
    setMessages({
      ...messages,
      [messageType]: {
        ...messages[messageType],
        imageCaption: caption
      }
    })
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options]
    newOptions[index] = value
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
  }

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      showMessage('Missing Question', '💝 Please enter a question!', 'error')
      return
    }

    if (currentQuestion.type === 'options') {
      const validOptions = currentQuestion.options.filter(opt => opt.trim() !== '')
      
      if (validOptions.length < 2) {
        showMessage('Not Enough Options', '💖 Please add at least 2 options!', 'error')
        return
      }

      if (!currentQuestion.options[currentQuestion.correctOption].trim()) {
        showMessage('Select Correct Answer', '💕 Please select a valid correct answer!', 'error')
        return
      }

      const newQuestion = {
        id: questions.length + 1,
        text: currentQuestion.text,
        type: 'options',
        image: currentQuestion.image,
        options: currentQuestion.options.filter(opt => opt.trim() !== ''),
        correctOption: currentQuestion.correctOption
      }

      setQuestions([...questions, newQuestion])
    } else {
      // Text question - no expected answer needed
      const newQuestion = {
        id: questions.length + 1,
        text: currentQuestion.text,
        type: 'text',
        image: currentQuestion.image,
        options: [],
        correctOption: -1
      }

      setQuestions([...questions, newQuestion])
    }
    
    // Reset form but keep the same question type
    setCurrentQuestion({
      id: null,
      text: '',
      type: currentQuestion.type, // Keep the same type
      image: null,
      options: ['', '', '', ''],
      correctOption: 0
    })

    if (questions.length + 1 >= 5) {
      setStep(4)
    }
  }

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const handleFinishCreator = async () => {
    if (questions.length === 0) {
      showMessage('No Questions', '💞 Please add at least one question!', 'error')
      return
    }

    if (questions.length < 5) {
      showMessage('Complete Questions', `You have ${questions.length}/5 questions. Please add all 5 questions.`, 'error')
      return
    }

    const scoringSystem = {
      perfect: { min: 8, max: 10, message: messages.perfect },
      good: { min: 5, max: 7, message: messages.good },
      low: { min: 0, max: 4, message: messages.low }
    }

    const gameData = {
      gameInfo: {
        title: gameTitle,
        creatorName: creatorName,
        theirName: theirName,
        couplePhoto: couplePhoto,
        totalQuestions: 5,
        scoringSystem: scoringSystem,
        loveReveal: loveReveal,
        createdAt: new Date().toISOString(),
        theme: 'valentine',
        totalPoints: questions.length * 2
      },
      questions: questions.map(q => ({
        id: q.id,
        text: q.text,
        type: q.type,
        questionImage: q.image,
        options: q.type === 'options' ? q.options.map((opt, idx) => ({
          index: idx,
          text: opt,
          isCorrect: idx === q.correctOption
        })) : [],
        correctOption: q.correctOption,
        points: 2
      })),
      messages: messages,
      timestamp: new Date().toISOString(),
      stats: {
        multipleChoiceQuestions: questions.filter(q => q.type === 'options').length,
        textQuestions: questions.filter(q => q.type === 'text').length,
        totalPoints: questions.length * 2
      }
    }

    console.log("🎮 Complete Game Data to be sent:", JSON.stringify(gameData, null, 2))

    setLoading(true)
    try {
      // Send to backend API
      const response = await axios.post(API_BASE_URL, gameData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-auth-token-if-needed' // Add your auth token if required
        }
      })
      
      console.log("✅ API Response:", response.data)
      
      // Extract game ID from response
      const gameId = response.data?.id || response.data?.gameId || Math.random().toString(36).substring(7)
      const link = `${window.location.origin}/view/${gameId}`
      setShareLink(link)
      
      // Also save locally as backup
      localStorage.setItem(`lovegame_${gameId}`, JSON.stringify(gameData))
      
      setStep(6)
      showMessage('Success!', `🎉 Your Love Quiz has been created successfully! Share this link with ${theirName}`, 'success')
      
    } catch (error) {
      console.error("❌ API Error:", error)
      
      // Fallback: Save locally and generate link
      const gameId = Math.random().toString(36).substring(7)
      const link = `${window.location.origin}/view/${gameId}`
      setShareLink(link)
      localStorage.setItem(`lovegame_${gameId}`, JSON.stringify(gameData))
      
      setStep(6)
      showMessage('Saved Locally', `🎉 Quiz saved locally! Share this link: ${link}`, 'info')
      
      // Log the data that would have been sent
      console.log("📦 Data that would have been sent to API:", gameData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen p-4 md:p-6"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-md w-full border border-pink-200/50 transform transition-all duration-300 animate-fadeIn">
            <div className={`p-3 rounded-full mb-4 inline-flex ${
              modalContent.type === 'error' ? 'bg-red-100' :
              modalContent.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              {modalContent.type === 'error' ? (
                <AlertCircle className="w-6 h-6 text-red-500" />
              ) : modalContent.type === 'success' ? (
                <Check className="w-6 h-6 text-green-500" />
              ) : (
                <MessageSquare className="w-6 h-6 text-blue-500" />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{modalContent.title}</h3>
            <p className="text-gray-600 mb-6">{modalContent.message}</p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-900/20 via-red-900/10 to-purple-900/15 backdrop-blur-[2px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8 pt-2 md:pt-4">
          <div className="inline-flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-pink-500/10 to-red-500/10 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full mb-3 md:mb-4">
            <Heart className="w-5 h-5 md:w-6 md:h-6 text-pink-500" fill="currentColor" />
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent font-serif">
              Create Love Quiz
            </h1>
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
          </div>
          <p className="text-sm md:text-base text-pink-600 font-medium flex items-center justify-center gap-1 md:gap-2">
            <User className="w-3 h-3 md:w-4 md:h-4" />
            For: {theirName || 'Your Special Someone'}
          </p>
          <div className="mt-1 md:mt-2 text-xs md:text-sm text-pink-500 bg-pink-100/50 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full inline-block">
            ✨ 5 Questions (Multiple Choice or Text)
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-6 md:mb-8 px-2">
          <div className="flex items-center space-x-1 md:space-x-2 bg-white/30 backdrop-blur-sm p-2 md:p-3 rounded-xl md:rounded-2xl max-w-full overflow-x-auto">
            {[1, 2, 3, 4, 5, 6].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 ${step >= stepNum 
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg transform scale-110' 
                  : 'bg-white/80 text-gray-400'}`}>
                  {step === stepNum ? (
                    <Heart className="w-4 h-4 md:w-5 md:h-5" fill="white" />
                  ) : step > stepNum ? (
                    <Check className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    stepNum
                  )}
                </div>
                {stepNum < 6 && (
                  <div className={`w-2 md:w-3 lg:w-6 h-1 transition-all duration-300 ${step > stepNum 
                    ? 'bg-gradient-to-r from-pink-500 to-red-500' 
                    : 'bg-white/50'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: SETUP */}
        {step === 1 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 border border-pink-200/50 animate-fadeIn">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-pink-500" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 font-serif">Love Story Setup</h2>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-pink-600 mb-1 md:mb-2">
                  <User className="w-3 h-3 md:w-4 md:h-4" />
                  Your Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    placeholder="Alex"
                    className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none bg-white/70"
                  />
                  <User className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-pink-400" />
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-pink-600 mb-1 md:mb-2">
                  <Heart className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" />
                  Their Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={theirName}
                    onChange={(e) => setTheirName(e.target.value)}
                    placeholder="Taylor"
                    className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none bg-white/70"
                  />
                  <Heart className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-pink-400" fill="currentColor" />
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-pink-600 mb-1 md:mb-2">
                  <FileText className="w-3 h-3 md:w-4 md:h-4" />
                  Quiz Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={gameTitle}
                    onChange={(e) => setGameTitle(e.target.value)}
                    placeholder="How well do you know me?"
                    className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none bg-white/70"
                  />
                  <Type className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-pink-400" />
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-pink-600 mb-1 md:mb-2">
                  <ImageIcon className="w-3 h-3 md:w-4 md:h-4" />
                  Couple Photo (Optional)
                </label>
                {couplePhoto ? (
                  <div className="relative group">
                    <img 
                      src={couplePhoto} 
                      alt="Couple" 
                      className="w-full h-40 md:h-48 lg:h-64 object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <button
                      onClick={() => setCouplePhoto(null)}
                      className="absolute top-2 md:top-3 right-2 md:right-3 bg-gradient-to-r from-pink-500 to-red-500 text-white p-1 md:p-2 rounded-full hover:scale-110 transition-all shadow-lg"
                    >
                      <X className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 md:h-48 border-2 border-dashed border-pink-300 rounded-xl cursor-pointer hover:border-pink-500 hover:bg-pink-50/30 transition-all duration-300 bg-white/50 group">
                    <ImageIcon className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-pink-400 mb-2 md:mb-3 group-hover:scale-110 transition-transform" />
                    <span className="text-xs md:text-sm text-center text-pink-600 font-medium">Upload couple photo</span>
                    <span className="text-xs text-pink-500 mt-1 text-center">Make it special</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, 'couple')} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>
              
              <button
                onClick={() => {
                  if (!creatorName.trim() || !theirName.trim() || !gameTitle.trim()) {
                    showMessage('Missing Information', '💝 Please fill all required fields!', 'error')
                    return
                  }
                  setStep(2)
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 md:gap-3 group"
              >
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                Start Adding Questions
                <FileText className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: QUESTIONS */}
        {step === 2 && (
          <div className="space-y-4 md:space-y-6 animate-fadeIn">
            {questions.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-6 border border-pink-200/50">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1 md:p-2 bg-pink-100 rounded-lg">
                      <FileText className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-gray-800">
                      Added Questions ({questions.length}/5)
                    </h3>
                  </div>
                  <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                    questions.length === 5 
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-600'
                      : 'bg-gradient-to-r from-pink-100 to-red-100 text-pink-600'
                  }`}>
                    {questions.length}/5
                  </span>
                </div>
                <div className="space-y-2 md:space-y-3">
                  {questions.map((q) => (
                    <div key={q.id} className="flex items-center justify-between bg-gradient-to-r from-pink-50 to-red-50/50 p-3 md:p-4 rounded-xl border border-pink-200 hover:border-pink-300 transition-colors group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 mb-1">
                          <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {q.id}
                          </div>
                          <p className="font-semibold text-gray-800 truncate text-sm md:text-base">{q.text}</p>
                          <span className={`text-xs px-1 md:px-2 py-0.5 rounded-full whitespace-nowrap ${
                            q.type === 'options' 
                              ? 'bg-purple-100 text-purple-600' 
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            {q.type === 'options' ? 'Multiple Choice' : 'Text Answer'}
                          </span>
                        </div>
                        <p className="text-xs text-pink-500 ml-7 md:ml-9">
                          {q.type === 'options' 
                            ? `${q.options?.length || 0} options • Correct: ${String.fromCharCode(65 + (q.correctOption || 0))}`
                            : 'Text answer - Any answer is correct'
                          }
                        </p>
                      </div>
                      <button 
                        onClick={() => removeQuestion(q.id)} 
                        className="opacity-0 group-hover:opacity-100 p-1 md:p-2 text-red-400 hover:text-red-600 hover:scale-125 transition-all ml-2"
                        title="Remove question"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {questions.length < 5 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 border border-pink-200/50">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1 md:p-2 bg-gradient-to-r from-pink-100 to-red-100 rounded-lg">
                      <Plus className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-pink-500" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                        Question #{questions.length + 1}
                      </h2>
                      <p className="text-xs md:text-sm text-pink-500">
                        {currentQuestion.type === 'options' ? 'Multiple choice question' : 'Text answer question'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-pink-500/10 to-red-500/10 px-2 md:px-3 py-1 rounded-full">
                    <span className="text-xs md:text-sm font-semibold text-pink-600">
                      {questions.length + 1}/5
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-pink-600 mb-1 md:mb-2">
                      <Type className="w-3 h-3 md:w-4 md:h-4" />
                      Question Text
                    </label>
                    <div className="relative">
                      <textarea
                        value={currentQuestion.text}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                        placeholder={
                          currentQuestion.type === 'options' 
                            ? "What's my favorite color?"
                            : "What was your favorite moment with me?"
                        }
                        rows="3"
                        className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none bg-white/70 resize-none"
                      />
                      <MessageSquare className="absolute left-2 md:left-3 top-3 w-3 h-3 md:w-4 md:h-4 text-pink-400" />
                    </div>
                  </div>

                  {/* Question Type Selection - Moved under question text */}
                  <div className="bg-gradient-to-r from-pink-50 to-red-50/30 rounded-xl p-3 md:p-4 border border-pink-200">
                    <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-pink-600 mb-2">
                      <Radio className="w-3 h-3 md:w-4 md:h-4" />
                      Question Type
                    </label>
                    <div className="flex gap-2 md:gap-3">
                      <button
                        onClick={() => setCurrentQuestion({ 
                          ...currentQuestion, 
                          type: 'options',
                          options: ['', '', '', '']
                        })}
                        className={`flex-1 py-2 md:py-3 rounded-lg text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2 ${
                          currentQuestion.type === 'options' 
                            ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow' 
                            : 'bg-white text-gray-700 border border-pink-200'
                        }`}
                      >
                        <Radio className="w-3 h-3 md:w-4 md:h-4" />
                        Multiple Choice
                      </button>
                      <button
                        onClick={() => setCurrentQuestion({ 
                          ...currentQuestion, 
                          type: 'text',
                          options: [],
                          correctOption: -1
                        })}
                        className={`flex-1 py-2 md:py-3 rounded-lg text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2 ${
                          currentQuestion.type === 'text' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow' 
                            : 'bg-white text-gray-700 border border-blue-200'
                        }`}
                      >
                        <TextCursor className="w-3 h-3 md:w-4 md:h-4" />
                        Text Answer
                      </button>
                    </div>
                    <p className="text-xs text-pink-500 mt-2">
                      {currentQuestion.type === 'text' 
                        ? 'Text questions: Any answer is considered correct'
                        : 'Multiple choice: Select one correct option from the choices'
                      }
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-pink-600 mb-1 md:mb-2">
                      <ImageIcon className="w-3 h-3 md:w-4 md:h-4" />
                      Question Image (Optional)
                    </label>
                    {currentQuestion.image ? (
                      <div className="relative group">
                        <img src={currentQuestion.image} alt="Question" className="w-full h-40 md:h-48 object-cover rounded-xl shadow transition-transform duration-300 group-hover:scale-[1.02]" />
                        <button
                          onClick={() => setCurrentQuestion({ ...currentQuestion, image: null })}
                          className="absolute top-2 md:top-3 right-2 md:right-3 bg-gradient-to-r from-pink-500 to-red-500 text-white p-1 md:p-2 rounded-full hover:scale-110 transition-all shadow-lg"
                        >
                          <X className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-28 md:h-32 border-2 border-dashed border-pink-300 rounded-xl cursor-pointer hover:border-pink-500 hover:bg-pink-50/30 transition-all duration-300 bg-white/50 group">
                        <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-pink-400 mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs md:text-sm text-pink-600">Add question image</span>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'question')} className="hidden" />
                      </label>
                    )}
                  </div>

                  {/* Options Section for Multiple Choice */}
                  {currentQuestion.type === 'options' && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50/30 rounded-xl p-4 md:p-6 border border-purple-200">
                      <div className="flex items-center justify-between mb-2 md:mb-3">
                        <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-purple-600">
                          <Check className="w-3 h-3 md:w-4 md:h-4" />
                          Options (Select correct one)
                        </label>
                        <span className="text-xs text-purple-500">
                          Click radio for correct answer
                        </span>
                      </div>
                      
                      <div className="space-y-3 md:space-y-4">
                        {currentQuestion.options.map((option, index) => (
                          <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50/30 p-3 md:p-4 rounded-xl border border-purple-200 hover:border-purple-300 transition-colors">
                            <div className="flex items-center gap-2 md:gap-4">
                              <div className="flex items-center gap-2 md:gap-3">
                                <input
                                  type="radio"
                                  name="correct"
                                  checked={currentQuestion.correctOption === index}
                                  onChange={() => setCurrentQuestion({ ...currentQuestion, correctOption: index })}
                                  className="w-4 h-4 md:w-5 md:h-5 text-purple-500 cursor-pointer"
                                />
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                                  <span className="font-bold text-xs md:text-sm text-purple-600">{String.fromCharCode(65 + index)}</span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => handleOptionChange(index, e.target.value)}
                                  placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                                  className="w-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white/70"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text Answer Information */}
                  {currentQuestion.type === 'text' && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50/30 rounded-xl p-4 md:p-6 border border-blue-200">
                      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                        <div className="p-1 md:p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                          <TextCursor className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm md:text-base text-blue-600">Text Answer Question</h3>
                          <p className="text-xs text-blue-500">
                            {theirName} will type their answer in a text box
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 md:p-4 rounded-lg">
                        <div className="flex items-start gap-2 md:gap-3">
                          <div className="p-1 md:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                            <Check className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-blue-600 text-sm">Note:</p>
                            <p className="text-xs text-blue-500">
                              For text answer questions, any answer from {theirName} will be considered correct.
                              This is perfect for open-ended questions about feelings, memories, or thoughts!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={`flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border ${
                    currentQuestion.type === 'options' 
                      ? 'bg-gradient-to-r from-pink-50 to-red-50/30 border-pink-200'
                      : 'bg-gradient-to-r from-blue-50 to-purple-50/30 border-blue-200'
                  }`}>
                    <div className={`p-1 md:p-2 rounded-lg ${
                      currentQuestion.type === 'options' ? 'bg-white' : 'bg-white'
                    }`}>
                      {currentQuestion.type === 'options' ? (
                        <Radio className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                      ) : (
                        <TextCursor className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm md:text-base text-pink-600">
                        {currentQuestion.type === 'options' ? 'Multiple Choice Question' : 'Text Answer Question'}
                      </p>
                      <p className="text-xs text-pink-500">
                        {currentQuestion.type === 'options' 
                          ? `${theirName} will select from ${currentQuestion.options.filter(opt => opt.trim() !== '').length} options`
                          : `${theirName} will type their answer - any answer is correct!`
                        }
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={addQuestion}
                    className={`w-full text-white font-bold py-3 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 md:gap-3 ${
                      currentQuestion.type === 'options'
                        ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 shadow-pink-500/30'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-blue-500/30'
                    }`}
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    Add Question {questions.length + 1}
                  </button>
                </div>
              </div>
            )}

            {questions.length > 0 && questions.length < 5 && (
              <div className="text-center">
                <p className="text-pink-600 text-sm mb-3">
                  Need {5 - questions.length} more questions to continue
                </p>
              </div>
            )}

            {questions.length === 5 && (
              <button
                onClick={() => setStep(3)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 md:gap-3"
              >
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                Continue to Score Messages
                <Award className="w-4 h-4 md:w-5 md-h-5" />
              </button>
            )}
          </div>
        )}

        {/* STEP 3: SCORING MESSAGES */}
        {step === 3 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 border border-pink-200/50 animate-fadeIn">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="p-1 md:p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 font-serif">
                  Score Messages
                </h2>
                <p className="text-sm md:text-base text-pink-600">Customize messages for {theirName}</p>
                <p className="text-xs text-pink-400 mt-1">💡 You can add both text and image for each score level!</p>
              </div>
            </div>
            
            <div className="space-y-6 md:space-y-8">
              {/* Perfect Score */}
              <div className="bg-gradient-to-r from-yellow-50/30 to-orange-50/30 rounded-xl p-4 md:p-6 border border-yellow-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-4 gap-2">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1 md:p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                      <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <h3 className="font-bold text-yellow-700 text-base md:text-lg">Perfect (8-10 points)</h3>
                        <span className="text-xs bg-yellow-100 text-yellow-600 px-1 md:px-2 py-0.5 rounded-full">Editable</span>
                      </div>
                      <p className="text-xs text-yellow-600">They know you completely!</p>
                    </div>
                  </div>
                  <div className="flex gap-1 md:gap-2">
                    <button
                      onClick={() => handleMessageTypeChange('perfect', 'text')}
                      className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm flex items-center gap-1 ${messages.perfect.type === 'text' 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow' 
                        : 'bg-white text-gray-700 border border-yellow-200'}`}
                    >
                      <Type className="w-2 h-2 md:w-3 md:h-3" />
                      Text Only
                    </button>
                    <button
                      onClick={() => handleMessageTypeChange('perfect', 'image')}
                      className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm flex items-center gap-1 ${messages.perfect.type === 'image' 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow' 
                        : 'bg-white text-gray-700 border border-yellow-200'}`}
                    >
                      <ImageIcon className="w-2 h-2 md:w-3 md:h-3" />
                      Add Image
                    </button>
                  </div>
                </div>
                
                {/* Text field - always visible */}
                <div className="mb-3 md:mb-4">
                  <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-yellow-600 mb-1 md:mb-2">
                    <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
                    Message Text
                  </label>
                  <div className="relative">
                    <textarea
                      value={messages.perfect.text}
                      onChange={(e) => handleMessageTextChange('perfect', e.target.value)}
                      placeholder="Perfect! You know everything about me! ❤️"
                      rows="3"
                      className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border-2 border-yellow-200 rounded-xl focus:border-yellow-500 focus:outline-none bg-white/70 resize-none"
                    />
                    <Edit2 className="absolute left-2 md:left-3 top-3 w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                  </div>
                </div>
                
                {/* Image section - only when image type is selected */}
                {messages.perfect.type === 'image' && (
                  <div className="mt-3 md:mt-4">
                    <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-yellow-600 mb-1 md:mb-2">
                      <ImageIcon className="w-3 h-3 md:w-4 md:h-4" />
                      Celebration Image
                      <span className="text-xs font-normal text-yellow-500 ml-1">(Max 10MB)</span>
                    </label>
                    
                    {messages.perfect.image ? (
                      <div className="space-y-3 md:space-y-4">
                        <div className="relative group">
                          <img 
                            src={messages.perfect.image} 
                            alt="Perfect score" 
                            className="w-full h-40 md:h-48 lg:h-64 object-cover rounded-xl shadow transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                          <div className="absolute top-2 md:top-3 right-2 md:right-3 flex gap-1 md:gap-2">
                            <button
                              onClick={() => handleMessageTypeChange('perfect', 'text')}
                              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-1 md:p-2 rounded-full hover:scale-110 transition-all shadow-lg"
                              title="Remove image"
                            >
                              <X className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Image caption field */}
                        <div>
                          <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-yellow-600 mb-1 md:mb-2">
                            <Type className="w-2 h-2 md:w-3 md:h-3" />
                            Image Caption (Optional)
                          </label>
                          <input
                            type="text"
                            value={messages.perfect.imageCaption || ''}
                            onChange={(e) => handleImageCaptionChange('perfect', e.target.value)}
                            placeholder={`A special celebration for ${theirName}!`}
                            className="w-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border-2 border-yellow-200 rounded-lg focus:border-yellow-500 focus:outline-none bg-white/70"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex items-start gap-1 md:gap-2 text-xs text-yellow-600 bg-yellow-50 p-2 md:p-3 rounded-lg">
                          <Sparkles className="w-2 h-2 md:w-3 md:h-3 mt-0.5 flex-shrink-0" />
                          <span><span className="font-medium">Suggestion:</span> Add a happy celebration image - you two smiling, fireworks, or a romantic moment!</span>
                        </div>
                        
                        <label className="flex flex-col items-center justify-center w-full h-36 md:h-48 border-2 border-dashed border-yellow-300 rounded-xl cursor-pointer hover:border-yellow-500 hover:bg-yellow-50/30 transition-all duration-300 bg-white/50 group">
                          <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
                          <span className="text-xs md:text-sm text-yellow-600 font-medium text-center">Upload celebration image</span>
                          <span className="text-xs text-yellow-500 mt-1 text-center">Max 10MB • JPG, PNG, GIF</span>
                          <span className="text-xs text-yellow-400 mt-1 text-center px-2">Suggested: Your happiest photo together! 🎉</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, 'message', 'perfect')} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Good Score */}
              <div className="bg-gradient-to-r from-pink-50/30 to-red-50/30 rounded-xl p-4 md:p-6 border border-pink-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-4 gap-2">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1 md:p-2 bg-gradient-to-r from-pink-100 to-red-100 rounded-lg">
                      <Star className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <h3 className="font-bold text-pink-700 text-base md:text-lg">Good (5-7 points)</h3>
                        <span className="text-xs bg-pink-100 text-pink-600 px-1 md:px-2 py-0.5 rounded-full">Editable</span>
                      </div>
                      <p className="text-xs text-pink-600">They know you pretty well!</p>
                    </div>
                  </div>
                  <div className="flex gap-1 md:gap-2">
                    <button
                      onClick={() => handleMessageTypeChange('good', 'text')}
                      className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm flex items-center gap-1 ${messages.good.type === 'text' 
                        ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow' 
                        : 'bg-white text-gray-700 border border-pink-200'}`}
                    >
                      <Type className="w-2 h-2 md:w-3 md:h-3" />
                      Text Only
                    </button>
                    <button
                      onClick={() => handleMessageTypeChange('good', 'image')}
                      className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm flex items-center gap-1 ${messages.good.type === 'image' 
                        ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow' 
                        : 'bg-white text-gray-700 border border-pink-200'}`}
                    >
                      <ImageIcon className="w-2 h-2 md:w-3 md:h-3" />
                      Add Image
                    </button>
                  </div>
                </div>
                
                {/* Text field - always visible */}
                <div className="mb-3 md:mb-4">
                  <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-pink-600 mb-1 md:mb-2">
                    <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
                    Message Text
                  </label>
                  <div className="relative">
                    <textarea
                      value={messages.good.text}
                      onChange={(e) => handleMessageTextChange('good', e.target.value)}
                      placeholder="Great! You know me pretty well! 💕"
                      rows="3"
                      className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none bg-white/70 resize-none"
                    />
                    <Edit2 className="absolute left-2 md:left-3 top-3 w-3 h-3 md:w-4 md:h-4 text-pink-400" />
                  </div>
                </div>
                
                {/* Image section - only when image type is selected */}
                {messages.good.type === 'image' && (
                  <div className="mt-3 md:mt-4">
                    <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-pink-600 mb-1 md:mb-2">
                      <ImageIcon className="w-3 h-3 md:w-4 md:h-4" />
                      Encouraging Image
                      <span className="text-xs font-normal text-pink-500 ml-1">(Max 10MB)</span>
                    </label>
                    
                    {messages.good.image ? (
                      <div className="space-y-3 md:space-y-4">
                        <div className="relative group">
                          <img 
                            src={messages.good.image} 
                            alt="Good score" 
                            className="w-full h-40 md:h-48 lg:h-64 object-cover rounded-xl shadow transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                          <div className="absolute top-2 md:top-3 right-2 md:right-3 flex gap-1 md:gap-2">
                            <button
                              onClick={() => handleMessageTypeChange('good', 'text')}
                              className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-1 md:p-2 rounded-full hover:scale-110 transition-all shadow-lg"
                              title="Remove image"
                            >
                              <X className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Image caption field */}
                        <div>
                          <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-pink-600 mb-1 md:mb-2">
                            <Type className="w-2 h-2 md:w-3 md:h-3" />
                            Image Caption (Optional)
                          </label>
                          <input
                            type="text"
                            value={messages.good.imageCaption || ''}
                            onChange={(e) => handleImageCaptionChange('good', e.target.value)}
                            placeholder={`You're doing great, ${theirName}!`}
                            className="w-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none bg-white/70"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex items-start gap-1 md:gap-2 text-xs text-pink-600 bg-pink-50 p-2 md:p-3 rounded-lg">
                          <Sparkles className="w-2 h-2 md:w-3 md:h-3 mt-0.5 flex-shrink-0" />
                          <span><span className="font-medium">Suggestion:</span> Add a warm, encouraging image - a cozy moment, holding hands, or a sweet memory!</span>
                        </div>
                        
                        <label className="flex flex-col items-center justify-center w-full h-36 md:h-48 border-2 border-dashed border-pink-300 rounded-xl cursor-pointer hover:border-pink-500 hover:bg-pink-50/30 transition-all duration-300 bg-white/50 group">
                          <Star className="w-8 h-8 md:w-10 md:h-10 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                          <span className="text-xs md:text-sm text-pink-600 font-medium text-center">Upload encouraging image</span>
                          <span className="text-xs text-pink-500 mt-1 text-center">Max 10MB • JPG, PNG, GIF</span>
                          <span className="text-xs text-pink-400 mt-1 text-center px-2">Suggested: A warm, happy photo of you two! 🌟</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, 'message', 'good')} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Low Score */}
              <div className="bg-gradient-to-r from-blue-50/30 to-purple-50/30 rounded-xl p-4 md:p-6 border border-blue-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-4 gap-2">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1 md:p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                      <Heart className="w-4 h-4 md:w-5 md:h-5 text-blue-500" fill="currentColor" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <h3 className="font-bold text-blue-700 text-base md:text-lg">Low (0-4 points)</h3>
                        <span className="text-xs bg-blue-100 text-blue-600 px-1 md:px-2 py-0.5 rounded-full">Editable</span>
                      </div>
                      <p className="text-xs text-blue-600">More time to connect!</p>
                    </div>
                  </div>
                  <div className="flex gap-1 md:gap-2">
                    <button
                      onClick={() => handleMessageTypeChange('low', 'text')}
                      className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm flex items-center gap-1 ${messages.low.type === 'text' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow' 
                        : 'bg-white text-gray-700 border border-blue-200'}`}
                    >
                      <Type className="w-2 h-2 md:w-3 md:h-3" />
                      Text Only
                    </button>
                    <button
                      onClick={() => handleMessageTypeChange('low', 'image')}
                      className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm flex items-center gap-1 ${messages.low.type === 'image' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow' 
                        : 'bg-white text-gray-700 border border-blue-200'}`}
                    >
                      <ImageIcon className="w-2 h-2 md:w-3 md:h-3" />
                      Add Image
                    </button>
                  </div>
                </div>
                
                {/* Text field - always visible */}
                <div className="mb-3 md:mb-4">
                  <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-blue-600 mb-1 md:mb-2">
                    <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
                    Message Text
                  </label>
                  <div className="relative">
                    <textarea
                      value={messages.low.text}
                      onChange={(e) => handleMessageTextChange('low', e.target.value)}
                      placeholder="Let's spend more time together! 😘"
                      rows="3"
                      className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white/70 resize-none"
                    />
                    <Edit2 className="absolute left-2 md:left-3 top-3 w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                  </div>
                </div>
                
                {/* Image section - only when image type is selected */}
                {messages.low.type === 'image' && (
                  <div className="mt-3 md:mt-4">
                    <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-blue-600 mb-1 md:mb-2">
                      <ImageIcon className="w-3 h-3 md:w-4 md:h-4" />
                      Loving Image
                      <span className="text-xs font-normal text-blue-500 ml-1">(Max 10MB)</span>
                    </label>
                    
                    {messages.low.image ? (
                      <div className="space-y-3 md:space-y-4">
                        <div className="relative group">
                          <img 
                            src={messages.low.image} 
                            alt="Low score" 
                            className="w-full h-40 md:h-48 lg:h-64 object-cover rounded-xl shadow transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                          <div className="absolute top-2 md:top-3 right-2 md:right-3 flex gap-1 md:gap-2">
                            <button
                              onClick={() => handleMessageTypeChange('low', 'text')}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-1 md:p-2 rounded-full hover:scale-110 transition-all shadow-lg"
                              title="Remove image"
                            >
                              <X className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Image caption field */}
                        <div>
                          <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-blue-600 mb-1 md:mb-2">
                            <Type className="w-2 h-2 md:w-3 md:h-3" />
                            Image Caption (Optional)
                          </label>
                          <input
                            type="text"
                            value={messages.low.imageCaption || ''}
                            onChange={(e) => handleImageCaptionChange('low', e.target.value)}
                            placeholder={`Let's create more memories together, ${theirName}!`}
                            className="w-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white/70"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex items-start gap-1 md:gap-2 text-xs text-blue-600 bg-blue-50 p-2 md:p-3 rounded-lg">
                          <Sparkles className="w-2 h-2 md:w-3 md:h-3 mt-0.5 flex-shrink-0" />
                          <span><span className="font-medium">Suggestion:</span> Add a loving, comforting image - a hug, sunset together, or a cute "let's try again" moment!</span>
                        </div>
                        
                        <label className="flex flex-col items-center justify-center w-full h-36 md:h-48 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-300 bg-white/50 group">
                          <Heart className="w-8 h-8 md:w-10 md:h-10 text-blue-400 mb-2 group-hover:scale-110 transition-transform" fill="currentColor" />
                          <span className="text-xs md:text-sm text-blue-600 font-medium text-center">Upload loving image</span>
                          <span className="text-xs text-blue-500 mt-1 text-center">Max 10MB • JPG, PNG, GIF</span>
                          <span className="text-xs text-blue-400 mt-1 text-center px-2">Suggested: A comforting, loving photo! 💙</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, 'message', 'low')} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-pink-50/50 to-red-50/30 rounded-xl p-3 md:p-4 border border-pink-200">
                <div className="flex items-start md:items-center gap-2 md:gap-3">
                  <div className="p-1 md:p-2 bg-gradient-to-r from-pink-100 to-red-100 rounded-lg flex-shrink-0">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-pink-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-pink-600 text-sm">Pro Tip:</p>
                    <p className="text-xs text-pink-500">
                      You can add both text and image! The text will always show, and the image appears below it when added.
                      {theirName} will love the personal touch! 💖
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl transition-all flex items-center justify-center gap-2 md:gap-3"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Questions
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 md:gap-3"
                >
                  <Gift className="w-4 h-4 md:w-5 md:h-5" />
                  Add Love Reveal
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: LOVE REVEAL */}
        {step === 4 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 border border-pink-200/50 animate-fadeIn">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="p-1 md:p-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                <Gift className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 font-serif">
                  Love Reveal
                </h2>
                <p className="text-sm md:text-base text-pink-600">Add a special message for {theirName}</p>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between mb-3 md:mb-4 p-3 md:p-4 bg-gradient-to-r from-pink-50 to-red-50/30 rounded-xl border border-pink-200">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-1 md:p-2 bg-pink-100 rounded-lg">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-pink-600">Enable Love Reveal</h3>
                    <p className="text-xs text-pink-500">Show a special message before the quiz</p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={loveReveal.enabled}
                    onChange={(e) => setLoveReveal({ ...loveReveal, enabled: e.target.checked })}
                    className="sr-only"
                    id="reveal-toggle"
                  />
                  <label
                    htmlFor="reveal-toggle"
                    className={`block w-12 md:w-14 h-6 md:h-7 rounded-full transition-all duration-300 cursor-pointer ${loveReveal.enabled 
                      ? 'bg-gradient-to-r from-pink-500 to-red-500' 
                      : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 md:top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 transform ${loveReveal.enabled 
                      ? 'translate-x-6 md:translate-x-8' 
                      : 'translate-x-0.5 md:translate-x-1'}`}></div>
                  </label>
                </div>
              </div>

              {loveReveal.enabled && (
                <>
                  <div>
                    <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-pink-600 mb-1 md:mb-2">
                      <Type className="w-3 h-3 md:w-4 md:h-4" />
                      Reveal Title
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loveReveal.title}
                        onChange={(e) => setLoveReveal({ ...loveReveal, title: e.target.value })}
                        placeholder={`A Special Message from ${creatorName} to ${theirName}`}
                        className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none bg-white/70"
                      />
                      <MessageSquare className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-pink-400" />
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-4 gap-2">
                      <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-pink-600">
                        <Gift className="w-3 h-3 md:w-4 md:h-4" />
                        Reveal Type
                      </label>
                      <div className="flex gap-1 md:gap-2">
                        <button
                          onClick={() => setLoveReveal({ ...loveReveal, type: 'text' })}
                          className={`px-3 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm flex items-center gap-1 md:gap-2 ${loveReveal.type === 'text' 
                            ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow' 
                            : 'bg-white text-gray-700 border'}`}
                        >
                          <Type className="w-2 h-2 md:w-3 md:h-3" />
                          Text Message
                        </button>
                        <button
                          onClick={() => setLoveReveal({ ...loveReveal, type: 'image' })}
                          className={`px-3 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm flex items-center gap-1 md:gap-2 ${loveReveal.type === 'image' 
                            ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow' 
                            : 'bg-white text-gray-700 border'}`}
                        >
                          <ImageIcon className="w-2 h-2 md:w-3 md:h-3" />
                          Image Message
                        </button>
                      </div>
                    </div>

                    {loveReveal.type === 'text' ? (
                      <div className="relative">
                        <textarea
                          value={loveReveal.text}
                          onChange={(e) => setLoveReveal({ ...loveReveal, text: e.target.value })}
                          placeholder={`To my dearest ${theirName},\n\nI created this quiz to show you how much our memories mean to me...`}
                          rows="5"
                          className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none bg-white/70 resize-none"
                        />
                        <Edit2 className="absolute left-2 md:left-3 top-3 w-3 h-3 md:w-4 md:h-4 text-pink-400" />
                      </div>
                    ) : (
                      <div>
                        {loveReveal.image ? (
                          <div className="relative group">
                            <img src={loveReveal.image} alt="Love reveal" className="w-full h-48 md:h-64 object-cover rounded-xl shadow transition-transform duration-300 group-hover:scale-[1.02]" />
                            <div className="absolute top-2 md:top-3 right-2 md:right-3 flex gap-1 md:gap-2">
                              <button
                                onClick={() => setLoveReveal({ ...loveReveal, image: null })}
                                className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-1 md:p-2 rounded-full hover:scale-110 transition-all shadow-lg"
                              >
                                <X className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-36 md:h-48 border-2 border-dashed border-pink-300 rounded-xl cursor-pointer hover:border-pink-500 hover:bg-pink-50/30 transition-all duration-300 bg-white/50 group">
                            <Gift className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs md:text-sm text-pink-600 font-medium text-center">Upload love reveal image</span>
                            <span className="text-xs text-pink-500 mt-1 text-center">Max 10MB • A special image for {theirName}</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleImageUpload(e, 'reveal')} 
                              className="hidden" 
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Preview */}
                  {loveReveal.title && (
                    <div className="bg-gradient-to-r from-pink-50 to-red-50/50 rounded-xl p-4 md:p-6 border border-pink-200">
                      <h3 className="font-bold text-sm md:text-base text-pink-600 mb-3 md:mb-4 flex items-center gap-1 md:gap-2">
                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                        Reveal Preview for {theirName}
                      </h3>
                      <div className="bg-white/80 rounded-lg p-3 md:p-4">
                        <h4 className="text-base md:text-lg font-bold text-gray-800 mb-2 md:mb-3">{loveReveal.title}</h4>
                        {loveReveal.type === 'image' && loveReveal.image && (
                          <img 
                            src={loveReveal.image} 
                            alt="Reveal preview" 
                            className="w-full h-28 md:h-32 object-cover rounded-lg mb-2 md:mb-3"
                          />
                        )}
                        {loveReveal.type === 'text' && loveReveal.text && (
                          <p className="text-gray-700 whitespace-pre-line text-sm md:text-base">{loveReveal.text}</p>
                        )}
                        {(!loveReveal.image && !loveReveal.text && loveReveal.type === 'text') && (
                          <p className="text-pink-500 italic text-sm md:text-base">Your reveal message will appear here...</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl transition-all flex items-center justify-center gap-2 md:gap-3"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Messages
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 md:gap-3"
                >
                  <Eye className="w-4 h-4 md:w-5 md:h-5" />
                  Preview Quiz
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: FINAL PREVIEW */}
        {step === 5 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 border border-pink-200/50 animate-fadeIn">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="p-1 md:p-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                <Eye className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 font-serif">
                Final Preview
              </h2>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              {/* Summary */}
              <div className="bg-gradient-to-r from-pink-50 to-red-50/50 rounded-xl p-4 md:p-6 border border-pink-200">
                <h3 className="font-bold text-sm md:text-base text-pink-600 mb-3 md:mb-4 flex items-center gap-1 md:gap-2">
                  <Users className="w-4 h-4 md:w-5 md:h-5" />
                  Quiz Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700 text-sm md:text-base">Title:</span>
                      <span className="font-semibold text-pink-600 text-sm md:text-base">{gameTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 text-sm md:text-base">From:</span>
                      <span className="font-semibold text-sm md:text-base">{creatorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 text-sm md:text-base">For:</span>
                      <span className="font-semibold text-pink-600 text-sm md:text-base">{theirName}</span>
                    </div>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700 text-sm md:text-base">Questions:</span>
                      <span className="font-semibold text-sm md:text-base">5/5 Complete</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 text-sm md:text-base">Love Reveal:</span>
                      <span className="font-semibold text-pink-600 text-sm md:text-base">
                        {loveReveal.enabled ? 'Enabled ✨' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 text-sm md:text-base">Total Points:</span>
                      <span className="font-semibold text-sm md:text-base">{questions.length * 2}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions Preview */}
              <div className="bg-white/70 rounded-xl p-4 md:p-6 border border-pink-200">
                <h3 className="font-bold text-sm md:text-base text-pink-600 mb-3 md:mb-4 flex items-center gap-1 md:gap-2">
                  <FileText className="w-4 h-4 md:w-5 md:h-5" />
                  Questions Preview
                </h3>
                <div className="space-y-3 md:space-y-4 max-h-64 md:max-h-80 overflow-y-auto">
                  {questions.map((q, index) => (
                    <div key={q.id} className="bg-gradient-to-r from-pink-50 to-red-50/30 p-3 md:p-4 rounded-lg hover:scale-[1.01] transition-transform">
                      <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
                          {q.id}
                        </div>
                        <p className="font-semibold text-gray-800 text-sm md:text-base truncate">{q.text}</p>
                        <span className={`text-xs px-1 md:px-2 py-0.5 rounded-full whitespace-nowrap ${
                          q.type === 'options' 
                            ? 'bg-purple-100 text-purple-600' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {q.type === 'options' ? 'Multiple Choice' : 'Text Answer'}
                        </span>
                      </div>
                      <div className="space-y-1 md:space-y-2 ml-8 md:ml-11">
                        {q.type === 'options' ? (
                          <>
                            <p className="text-xs md:text-sm text-gray-600">Options:</p>
                            {q.options.map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center space-x-1 md:space-x-2">
                                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs ${optIdx === q.correctOption 
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow' 
                                  : 'bg-gray-100 text-gray-600'}`}>
                                  {optIdx === q.correctOption ? <Check className="w-2 h-2 md:w-3 md:h-3" /> : String.fromCharCode(65 + optIdx)}
                                </div>
                                <span className="text-xs md:text-sm">{opt}</span>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            <p className="text-xs md:text-sm text-gray-600">Type:</p>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-2 md:p-3 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm md:text-base">Text Answer</span>
                                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                                  Any answer is correct
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

           
              {/* Love Reveal Preview */}
              {loveReveal.enabled && loveReveal.title && (
                <div className="bg-gradient-to-r from-pink-50 to-red-50/50 rounded-xl p-4 md:p-6 border border-pink-200">
                  <h3 className="font-bold text-sm md:text-base text-pink-600 mb-3 md:mb-4 flex items-center gap-1 md:gap-2">
                    <Gift className="w-4 h-4 md:w-5 md:h-5" />
                    Love Reveal Preview
                  </h3>
                  <div className="bg-white/80 rounded-lg p-3 md:p-4">
                    <h4 className="text-base md:text-lg font-bold text-gray-800 mb-2 md:mb-3">{loveReveal.title}</h4>
                    {loveReveal.type === 'image' && loveReveal.image ? (
                      <div className="h-24 md:h-32 bg-gradient-to-r from-pink-100 to-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-pink-500 text-sm md:text-base">Image will appear here</span>
                      </div>
                    ) : loveReveal.type === 'text' && loveReveal.text ? (
                      <p className="text-gray-700 whitespace-pre-line text-sm md:text-base">{loveReveal.text}</p>
                    ) : (
                      <p className="text-pink-500 italic text-sm md:text-base">Reveal content will appear here...</p>
                    )}
                  </div>
                </div>
              )}

              {/* Final Data Log Button */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50/30 rounded-xl p-4 md:p-6 border border-purple-200">
                <h3 className="font-bold text-sm md:text-base text-purple-600 mb-3 md:mb-4 flex items-center gap-1 md:gap-2">
                  <FileText className="w-4 h-4 md:w-5 md:h-5" />
                  Data Verification
                </h3>
                <p className="text-gray-700 text-sm md:text-base mb-3 md:mb-4">
                  Click the button below to see all data that will be sent to the backend API in your browser console.
                </p>
                <button
                  onClick={() => {
                    const gameData = {
                      gameInfo: {
                        title: gameTitle,
                        creatorName: creatorName,
                        theirName: theirName,
                        couplePhoto: couplePhoto ? 'Base64 image data included' : null,
                        totalQuestions: 5,
                        scoringSystem: {
                          perfect: { min: 8, max: 10, message: messages.perfect },
                          good: { min: 5, max: 7, message: messages.good },
                          low: { min: 0, max: 4, message: messages.low }
                        },
                        loveReveal: loveReveal,
                        createdAt: new Date().toISOString(),
                        theme: 'valentine',
                        totalPoints: questions.length * 2
                      },
                      questions: questions.map(q => ({
                        id: q.id,
                        text: q.text,
                        type: q.type,
                        questionImage: q.image ? 'Base64 image data included' : null,
                        options: q.type === 'options' ? q.options.map((opt, idx) => ({
                          index: idx,
                          text: opt,
                          isCorrect: idx === q.correctOption
                        })) : [],
                        correctOption: q.correctOption,
                        points: 2
                      })),
                      messages: messages,
                      timestamp: new Date().toISOString(),
                      stats: {
                        multipleChoiceQuestions: questions.filter(q => q.type === 'options').length,
                        textQuestions: questions.filter(q => q.type === 'text').length,
                        totalPoints: questions.length * 2
                      }
                    };
                    
                    console.log("📊 FINAL QUIZ DATA TO BE SENT TO API:");
                    console.log(JSON.stringify(gameData, null, 2));
                    
                    showMessage(
                      'Data Logged to Console',
                      'All quiz data has been logged to your browser console (F12 → Console tab). You can view the complete JSON structure.',
                      'info'
                    );
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 md:gap-3"
                >
                  <FileText className="w-4 h-4 md:w-5 md:h-5" />
                  Log Complete Data to Console
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl transition-all flex items-center justify-center gap-2 md:gap-3"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Reveal
                </button>
                <button
                  onClick={handleFinishCreator}
                  disabled={loading}
                  className={`flex-1 font-bold py-3 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 md:gap-3 ${loading 
                    ? 'bg-gradient-to-r from-gray-300 to-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg shadow-pink-500/30'}`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent"></div>
                      Creating Quiz...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 md:w-5 md:h-5" />
                      Create & Share
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: SHARE */}
        {step === 6 && shareLink && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 border border-pink-200/50 animate-fadeIn">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 md:p-4 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-full mb-3 md:mb-4">
                <Sparkles className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-pink-500" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent mb-1 md:mb-2 font-serif">
                Love Quiz Created! ✨
              </h2>
              <p className="text-sm md:text-base text-pink-600 mb-4 md:mb-6">Share this beautiful quiz with {theirName}</p>
              
              <div className="bg-gradient-to-r from-pink-50 to-red-50/50 rounded-xl p-4 md:p-6 mb-4 md:mb-6 border border-pink-200">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="p-1 md:p-2 bg-gradient-to-r from-pink-100 to-red-100 rounded-lg">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-pink-600">Ready for {theirName}!</h3>
                    <p className="text-xs md:text-sm text-pink-500">Share this link with them</p>
                  </div>
                </div>
                
                {/* Share Link */}
                <div className="bg-white/80 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                  <div className="flex items-center justify-between gap-1 md:gap-2 mb-2 md:mb-3">
                    <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-pink-600">
                      <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
                      Quiz Link:
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareLink);
                        showMessage('Copied!', 'Link copied to clipboard! 📋', 'success');
                      }}
                      className="text-xs md:text-sm bg-gradient-to-r from-pink-500 to-red-500 text-white px-2 md:px-3 py-1 rounded-lg flex items-center gap-1 hover:scale-105 transition-transform"
                    >
                      <Copy className="w-2 h-2 md:w-3 md:h-3" />
                      Copy
                    </button>
                  </div>
                  <div className="bg-pink-50 p-2 md:p-3 rounded-lg border border-pink-200">
                    <p className="text-xs md:text-sm text-pink-600 break-all font-mono">{shareLink}</p>
                  </div>
                </div>
                
                {/* Share Buttons */}
                <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
                  <button
                    onClick={() => {
                      const text = `💖 Hey ${theirName}! I made a special Love Quiz for you! Can you guess how well you know me? 🌹 ${shareLink}`;
                      navigator.clipboard.writeText(text);
                      showMessage('Copied!', 'Message copied! 📋\nPaste it in WhatsApp, iMessage, etc.', 'success');
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm rounded-xl transition-all flex items-center justify-center gap-1 md:gap-2"
                  >
                    <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
                    Copy Message
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: gameTitle,
                          text: `💖 Hey ${theirName}! I made a special Love Quiz for you!`,
                          url: shareLink,
                        });
                      } else {
                        showMessage('Share', 'Copy the link and share it directly!', 'info');
                      }
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm rounded-xl transition-all flex items-center justify-center gap-1 md:gap-2"
                  >
                    <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                    Share
                  </button>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-1 md:gap-2">
                  <div className="bg-white/80 p-2 md:p-3 rounded-lg text-center">
                    <div className="text-lg md:text-xl lg:text-2xl font-bold text-pink-600">5</div>
                    <div className="text-xs text-pink-500">Questions</div>
                  </div>
                  <div className="bg-white/80 p-2 md:p-3 rounded-lg text-center">
                    <div className="text-lg md:text-xl lg:text-2xl font-bold text-pink-600">10</div>
                    <div className="text-xs text-pink-500">Points</div>
                  </div>
                  <div className="bg-white/80 p-2 md:p-3 rounded-lg text-center">
                    <div className="text-lg md:text-xl lg:text-2xl font-bold text-pink-600">{loveReveal.enabled ? '✨' : '—'}</div>
                    <div className="text-xs text-pink-500">Reveal</div>
                  </div>
                </div>
              </div>
              
              {/* Success Message */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50/50 rounded-xl p-4 md:p-6 mb-4 md:mb-6 border border-green-200">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="p-1 md:p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-green-600">Successfully Created!</h3>
                    <p className="text-xs md:text-sm text-green-500">Your quiz is saved and ready to share</p>
                  </div>
                </div>
                <p className="text-gray-700 text-xs md:text-sm">
                  {theirName} will see your love reveal, answer {questions.length} questions, 
                  and get a personalized score message with your special touch!
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <button
                  onClick={() => {
                    setStep(1);
                    setGameTitle('');
                    setCreatorName('');
                    setCouplePhoto(null);
                    setTheirName('');
                    setQuestions([]);
                    setCurrentQuestion({
                      id: null,
                      text: '',
                      type: 'options',
                      image: null,
                      options: ['', '', '', ''],
                      correctOption: 0,
                    });
                    setMessages({
                      perfect: {
                        text: "Perfect! You know everything about me! ❤️",
                        image: null,
                        type: 'text',
                        imageCaption: ''
                      },
                      good: {
                        text: "Great! You know me pretty well! 💕",
                        image: null,
                        type: 'text',
                        imageCaption: ''
                      },
                      low: {
                        text: "Let's spend more time together! 😘",
                        image: null,
                        type: 'text',
                        imageCaption: ''
                      }
                    });
                    setLoveReveal({
                      enabled: true,
                      title: '',
                      image: null,
                      text: '',
                      type: 'text'
                    });
                    setShareLink('');
                  }}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 md:gap-3"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  Create Another Quiz
                </button>
                <button
                  onClick={() => window.open(shareLink, '_blank')}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 md:gap-3"
                >
                  <Eye className="w-4 h-4 md:w-5 md:h-5" />
                  Preview Quiz
                </button>
              </div>
              
              <p className="text-xs text-pink-400 mt-4 md:mt-6">
                ❤️ Made with love for {theirName} by {creatorName}
              </p>
            </div>
          </div>
        )}
        
        {/* Navigation Footer */}
        {step < 6 && step > 1 && (
          <div className="mt-4 md:mt-6 text-center">
            <button
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1 md:gap-2 text-pink-600 hover:text-pink-700 font-semibold text-sm md:text-base px-3 md:px-4 py-1 md:py-2 rounded-lg hover:bg-pink-50/50 transition-colors"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Create;