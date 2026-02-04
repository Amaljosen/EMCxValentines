import React, { useState } from 'react'
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
  TextCursor,
  ChevronDown,
  ChevronUp,
  CopyIcon
} from 'lucide-react'

// Custom shadcn/ui styled components
const Button = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "", 
  disabled = false,
  onClick,
  type = "button",
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline"
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10"
  }
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

const Input = React.forwardRef(({ className = "", type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  )
})

const Textarea = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  )
})

const Card = ({ className = "", ...props }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
)

const CardHeader = ({ className = "", ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
)

const CardTitle = ({ className = "", ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
)

const CardDescription = ({ className = "", ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props} />
)

const CardContent = ({ className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
)

const CardFooter = ({ className = "", ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props} />
)

const Label = ({ className = "", ...props }) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props} />
)

const Progress = ({ value = 0, className = "", ...props }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-secondary ${className}`} {...props}>
    <div 
      className="h-full w-full flex-1 bg-primary transition-all" 
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
)

const Badge = ({ variant = "default", className = "", children, ...props }) => {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground"
  }
  
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}

const Switch = ({ checked = false, onCheckedChange, ...props }) => {
  const [isChecked, setIsChecked] = useState(checked)
  
  const handleClick = () => {
    const newValue = !isChecked
    setIsChecked(newValue)
    if (onCheckedChange) onCheckedChange(newValue)
  }
  
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      onClick={handleClick}
      className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
      data-state={isChecked ? "checked" : "unchecked"}
      {...props}
    >
      <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" data-state={isChecked ? "checked" : "unchecked"} />
    </button>
  )
}

const Tabs = ({ defaultValue, value, onValueChange, children, className = "" }) => {
  const [activeTab, setActiveTab] = useState(value || defaultValue)
  
  const handleTabChange = (newValue) => {
    setActiveTab(newValue)
    if (onValueChange) onValueChange(newValue)
  }
  
  return (
    <div className={className}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { activeTab, onTabChange: handleTabChange })
      )}
    </div>
  )
}

const TabsList = ({ children, className = "", activeTab, onTabChange, ...props }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`} {...props}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeTab, onTabChange })
    )}
  </div>
)

const TabsTrigger = ({ value, children, className = "", activeTab, onTabChange, ...props }) => {
  const isActive = activeTab === value
  
  return (
    <button
      type="button"
      onClick={() => onTabChange(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isActive ? 'bg-background text-foreground shadow-sm' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ value, children, className = "", activeTab, ...props }) => {
  if (activeTab !== value) return null
  
  return (
    <div className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`} {...props}>
      {children}
    </div>
  )
}

const RadioGroup = ({ value, onValueChange, children, className = "" }) => {
  const [selectedValue, setSelectedValue] = useState(value)
  
  const handleChange = (newValue) => {
    setSelectedValue(newValue)
    if (onValueChange) onValueChange(newValue)
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { selectedValue, onValueChange: handleChange })
      )}
    </div>
  )
}

const RadioGroupItem = ({ value, id, selectedValue, onValueChange, ...props }) => {
  const isSelected = selectedValue === value
  
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        role="radio"
        aria-checked={isSelected}
        onClick={() => onValueChange(value)}
        className="h-4 w-4 rounded-full border border-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        data-state={isSelected ? "checked" : "unchecked"}
        {...props}
      >
        {isSelected && (
          <div className="h-2 w-2 rounded-full bg-primary m-auto" />
        )}
      </button>
      <Label htmlFor={id}>{props.children}</Label>
    </div>
  )
}

const Dialog = ({ open, onOpenChange, children, ...props }) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {React.Children.map(children, child =>
        React.cloneElement(child, { onOpenChange })
      )}
    </div>
  )
}

const DialogContent = ({ children, className = "", onOpenChange, ...props }) => (
  <div className="fixed inset-0 z-50 bg-black/50" onClick={() => onOpenChange(false)}>
    <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
      <div className={`${className}`} onClick={(e) => e.stopPropagation()} {...props}>
        {children}
      </div>
    </div>
  </div>
)

const DialogHeader = ({ className = "", ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props} />
)

const DialogTitle = ({ className = "", ...props }) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
)

const DialogDescription = ({ className = "", ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props} />
)

const DialogFooter = ({ className = "", ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props} />
)

const Alert = ({ variant = "default", className = "", children, ...props }) => {
  const variants = {
    default: "border bg-background",
    destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
  }
  
  return (
    <div className={`relative w-full rounded-lg border p-4 ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}

const AlertTitle = ({ className = "", ...props }) => (
  <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`} {...props} />
)

const AlertDescription = ({ className = "", ...props }) => (
  <div className={`text-sm ${className}`} {...props} />
)

const TooltipProvider = ({ children, ...props }) => (
  <div {...props}>{children}</div>
)

const Tooltip = ({ children, ...props }) => {
  const [show, setShow] = useState(false)
  
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} {...props}>
      {React.Children.map(children, (child, index) => {
        if (index === 0) return React.cloneElement(child, { show })
        return child
      })}
    </div>
  )
}

const TooltipTrigger = ({ children, ...props }) => (
  <div {...props}>{children}</div>
)

const TooltipContent = ({ children, show, className = "", ...props }) => {
  if (!show) return null
  
  return (
    <div className={`absolute z-50 w-max rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 ${className}`} {...props}>
      {children}
    </div>
  )
}

const Accordion = ({ type = "single", children, className = "" }) => {
  const [openItems, setOpenItems] = useState([])
  
  const handleToggle = (value) => {
    if (type === "single") {
      setOpenItems(openItems[0] === value ? [] : [value])
    } else {
      setOpenItems(openItems.includes(value) 
        ? openItems.filter(item => item !== value)
        : [...openItems, value]
      )
    }
  }
  
  return (
    <div className={className}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { openItems, onToggle: handleToggle })
      )}
    </div>
  )
}

const AccordionItem = ({ value, children, openItems, onToggle, ...props }) => (
  <div className="border-b" {...props}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { value, isOpen: openItems.includes(value), onToggle })
    )}
  </div>
)

const AccordionTrigger = ({ value, children, isOpen, onToggle, className = "", ...props }) => (
  <button
    type="button"
    onClick={() => onToggle(value)}
    className={`flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline ${isOpen ? 'underline' : ''} ${className}`}
    {...props}
  >
    {children}
    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
  </button>
)

const AccordionContent = ({ children, isOpen, className = "", ...props }) => {
  if (!isOpen) return null
  
  return (
    <div className={`pb-4 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
}

const Separator = ({ className = "", ...props }) => (
  <div className={`shrink-0 bg-border h-[1px] w-full ${className}`} {...props} />
)

// CSS Variables for theming
const themeStyles = `
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 346.8 77.2% 49.8%;
    --primary-foreground: 355.7 100% 97.3%;
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 346.8 77.2% 49.8%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 346.8 77.2% 49.8%;
    --primary-foreground: 355.7 100% 97.3%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 346.8 77.2% 49.8%;
  }

  * {
    border-color: hsl(var(--border));
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
`

// Main Create Component
function Create() {
  const [step, setStep] = useState(1)
  const [gameTitle, setGameTitle] = useState('')
  const [creatorName, setCreatorName] = useState('')
  const [couplePhoto, setCouplePhoto] = useState(null)
  const [theirName, setTheirName] = useState('')
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState({
    id: null,
    text: '',
    type: 'options',
    image: null,
    options: ['', '', '', ''],
    correctOption: 0,
  })
  
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

  const [loveReveal, setLoveReveal] = useState({
    enabled: true,
    title: '',
    image: null,
    text: '',
    type: 'text'
  })

  const [loading, setLoading] = useState(false)
  const [shareLink, setShareLink] = useState('')
  
  const [showDialog, setShowDialog] = useState(false)
  const [dialogContent, setDialogContent] = useState({
    title: '',
    message: '',
    type: 'info'
  })

  const showMessage = (title, message, type = 'info') => {
    setDialogContent({ title, message, type })
    setShowDialog(true)
  }

  const API_BASE_URL = "https://your-backend-api.com/api/create-quiz"

  const handleImageUpload = (e, type, messageType = null) => {
    const file = e.target.files[0]
    if (!file) return
    
    const MAX_FILE_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE) {
      showMessage(
        'File Too Large',
        `Image size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds 10MB limit. Please choose a smaller image.`,
        'error'
      )
      return
    }
    
    if (!file.type.startsWith('image/')) {
      showMessage('Invalid File', 'Please select an image file (JPEG, PNG, etc.)', 'error')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result
      if (type === 'couple') {
        setCouplePhoto(result)
      } else if (type === 'question') {
        setCurrentQuestion({ ...currentQuestion, image: result })
      } else if (type === 'message' && messageType) {
        setMessages({
          ...messages,
          [messageType]: {
            ...messages[messageType],
            image: result,
            imageCaption: messages[messageType].imageCaption || `A special image for ${theirName}`
          }
        })
      } else if (type === 'reveal') {
        setLoveReveal({
          ...loveReveal,
          image: result
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
        type
      }
    })
  }

  const handleMessageTextChange = (messageType, text) => {
    setMessages({
      ...messages,
      [messageType]: {
        ...messages[messageType],
        text
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
    
    setCurrentQuestion({
      id: null,
      text: '',
      type: currentQuestion.type,
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
      const response = await axios.post(API_BASE_URL, gameData, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const gameId = response.data?.id || response.data?.gameId || Math.random().toString(36).substring(7)
      const link = `${window.location.origin}/view/${gameId}`
      setShareLink(link)
      
      localStorage.setItem(`lovegame_${gameId}`, JSON.stringify(gameData))
      
      setStep(6)
      showMessage('Success!', `🎉 Your Love Quiz has been created successfully! Share this link with ${theirName}`, 'success')
      
    } catch (error) {
      console.error("❌ API Error:", error)
      
      const gameId = Math.random().toString(36).substring(7)
      const link = `${window.location.origin}/view/${gameId}`
      setShareLink(link)
      localStorage.setItem(`lovegame_${gameId}`, JSON.stringify(gameData))
      
      setStep(6)
      showMessage('Saved Locally', `🎉 Quiz saved locally! Share this link: ${link}`, 'info')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{themeStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 p-4 md:p-6">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {dialogContent.type === 'error' ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : dialogContent.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                )}
                {dialogContent.title}
              </DialogTitle>
              <DialogDescription className="text-base">
                {dialogContent.message}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setShowDialog(false)} className="w-full">
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="max-w-6xl mx-auto space-y-6">
          <Card className="border-2 border-pink-200 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="h-8 w-8 text-pink-500 fill-pink-500" />
                <CardTitle className="text-3xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Create Love Quiz
                </CardTitle>
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </div>
              <CardDescription className="text-lg">
                For: <span className="font-semibold text-pink-600">{theirName || 'Your Special Someone'}</span>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-pink-200 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="font-semibold">Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Step {step} of 6 • {Math.round((step / 6) * 100)}% complete
                  </p>
                </div>
                <Badge variant="outline" className="text-pink-600 border-pink-300">
                  {step}/6
                </Badge>
              </div>
              <Progress value={(step / 6) * 100} className="h-2" />
              <div className="flex justify-between mt-2">
                {['Setup', 'Questions', 'Messages', 'Reveal', 'Preview', 'Share'].map((label, index) => (
                  <div key={label} className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step > index + 1 ? 'bg-green-500 text-white' :
                      step === index + 1 ? 'bg-pink-500 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {step > index + 1 ? <Check className="h-4 w-4" /> : index + 1}
                    </div>
                    <span className={`text-xs mt-1 ${
                      step >= index + 1 ? 'text-pink-600 font-medium' : 'text-gray-500'
                    }`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {step === 1 && (
            <Card className="border-pink-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-pink-500" />
                  Love Story Setup
                </CardTitle>
                <CardDescription>
                  Let's set up your love quiz by adding your details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="creatorName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Your Name
                    </Label>
                    <Input
                      id="creatorName"
                      placeholder="Alex"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theirName" className="flex items-center gap-2">
                      <Heart className="h-4 w-4 fill-pink-500" />
                      Their Name
                    </Label>
                    <Input
                      id="theirName"
                      placeholder="Taylor"
                      value={theirName}
                      onChange={(e) => setTheirName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gameTitle" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Quiz Title
                  </Label>
                  <Input
                    id="gameTitle"
                    placeholder="How well do you know me?"
                    value={gameTitle}
                    onChange={(e) => setGameTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Couple Photo (Optional)
                  </Label>
                  {couplePhoto ? (
                    <div className="relative">
                      <img
                        src={couplePhoto}
                        alt="Couple"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setCouplePhoto(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-pink-300 rounded-lg p-8 text-center hover:border-pink-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'couple')}
                        className="hidden"
                        id="couple-photo"
                      />
                      <label htmlFor="couple-photo" className="cursor-pointer">
                        <ImageIcon className="h-12 w-12 text-pink-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-pink-600">Upload couple photo</p>
                        <p className="text-xs text-pink-500 mt-1">Make it special</p>
                      </label>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full gap-2 bg-pink-500 hover:bg-pink-600 text-white"
                  onClick={() => {
                    if (!creatorName.trim() || !theirName.trim() || !gameTitle.trim()) {
                      showMessage('Missing Information', '💝 Please fill all required fields!', 'error')
                      return
                    }
                    setStep(2)
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                  Start Adding Questions
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {questions.length > 0 && (
                <Card className="border-pink-200 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-pink-500" />
                        Added Questions ({questions.length}/5)
                      </CardTitle>
                      <Badge variant={questions.length === 5 ? "default" : "secondary"}>
                        {questions.length}/5
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {questions.map((q) => (
                        <div key={q.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center">
                                {q.id}
                              </Badge>
                              <span className="font-medium truncate">{q.text}</span>
                              <Badge variant={q.type === 'options' ? "secondary" : "outline"}>
                                {q.type === 'options' ? 'Multiple Choice' : 'Text Answer'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 ml-9">
                              {q.type === 'options' 
                                ? `${q.options?.length || 0} options • Correct: ${String.fromCharCode(65 + (q.correctOption || 0))}`
                                : 'Text answer - Any answer is correct'
                              }
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuestion(q.id)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {questions.length < 5 && (
                <Card className="border-pink-200 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-pink-500" />
                        Question #{questions.length + 1}
                      </CardTitle>
                      <Badge variant="outline">
                        {questions.length + 1}/5
                      </Badge>
                    </div>
                    <CardDescription>
                      {currentQuestion.type === 'options' ? 'Multiple choice question' : 'Text answer question'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="question-text" className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Question Text
                      </Label>
                      <Textarea
                        id="question-text"
                        placeholder={
                          currentQuestion.type === 'options' 
                            ? "What's my favorite color?"
                            : "What was your favorite moment with me?"
                        }
                        value={currentQuestion.text}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Radio className="h-4 w-4" />
                        Question Type
                      </Label>
                      <Tabs 
                        defaultValue="options" 
                        value={currentQuestion.type}
                        onValueChange={(value) => setCurrentQuestion({ 
                          ...currentQuestion, 
                          type: value,
                          options: value === 'options' ? ['', '', '', ''] : [],
                          correctOption: value === 'options' ? 0 : -1
                        })}
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="options" className="gap-2">
                            <Radio className="h-4 w-4" />
                            Multiple Choice
                          </TabsTrigger>
                          <TabsTrigger value="text" className="gap-2">
                            <TextCursor className="h-4 w-4" />
                            Text Answer
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="options" className="mt-4">
                          <Alert>
                            <Radio className="h-4 w-4" />
                            <AlertTitle>Multiple Choice</AlertTitle>
                            <AlertDescription>
                              {theirName} will select from the options you provide
                            </AlertDescription>
                          </Alert>
                        </TabsContent>
                        <TabsContent value="text" className="mt-4">
                          <Alert>
                            <TextCursor className="h-4 w-4" />
                            <AlertTitle>Text Answer</AlertTitle>
                            <AlertDescription>
                              {theirName} will type their answer - any answer is correct!
                            </AlertDescription>
                          </Alert>
                        </TabsContent>
                      </Tabs>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Question Image (Optional)
                      </Label>
                      {currentQuestion.image ? (
                        <div className="relative">
                          <img
                            src={currentQuestion.image}
                            alt="Question"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => setCurrentQuestion({ ...currentQuestion, image: null })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-pink-300 rounded-lg p-8 text-center hover:border-pink-500 transition-colors cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'question')}
                            className="hidden"
                            id="question-image"
                          />
                          <label htmlFor="question-image" className="cursor-pointer">
                            <ImageIcon className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-pink-600">Add question image</p>
                          </label>
                        </div>
                      )}
                    </div>

                    {currentQuestion.type === 'options' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            Options (Select correct one)
                          </Label>
                          <span className="text-sm text-gray-500">
                            Click radio for correct answer
                          </span>
                        </div>
                        <div className="space-y-3">
                          {currentQuestion.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                              <RadioGroup
                                value={currentQuestion.correctOption.toString()}
                                onValueChange={(value) => setCurrentQuestion({ 
                                  ...currentQuestion, 
                                  correctOption: parseInt(value) 
                                })}
                              >
                                <div className="flex items-center gap-2">
                                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                  <Label
                                    htmlFor={`option-${index}`}
                                    className="flex items-center gap-2 font-normal cursor-pointer"
                                  >
                                    <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center">
                                      {String.fromCharCode(65 + index)}
                                    </Badge>
                                  </Label>
                                </div>
                              </RadioGroup>
                              <Input
                                placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full gap-2 bg-pink-500 hover:bg-pink-600 text-white"
                      onClick={addQuestion}
                      disabled={!currentQuestion.text.trim()}
                    >
                      <Plus className="h-4 w-4" />
                      Add Question {questions.length + 1}
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {questions.length === 5 && (
                <Card className="border-pink-200 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                      <h3 className="text-xl font-semibold">All Questions Added!</h3>
                      <p className="text-gray-500">
                        You've added all 5 questions. Ready to continue!
                      </p>
                      <Button
                        className="w-full gap-2 bg-purple-500 hover:bg-purple-600 text-white"
                        onClick={() => setStep(3)}
                      >
                        Continue to Score Messages
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {step === 3 && (
            <Card className="border-pink-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-pink-500" />
                  Score Messages
                </CardTitle>
                <CardDescription>
                  Customize messages for {theirName} based on their score
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="perfect">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="perfect" className="gap-2">
                      <Trophy className="h-4 w-4" />
                      Perfect (8-10)
                    </TabsTrigger>
                    <TabsTrigger value="good" className="gap-2">
                      <Star className="h-4 w-4" />
                      Good (5-7)
                    </TabsTrigger>
                    <TabsTrigger value="low" className="gap-2">
                      <Heart className="h-4 w-4" />
                      Low (0-4)
                    </TabsTrigger>
                  </TabsList>

                  {['perfect', 'good', 'low'].map((type) => (
                    <TabsContent key={type} value={type} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold capitalize">
                            {type === 'perfect' && 'Perfect Score'}
                            {type === 'good' && 'Good Score'}
                            {type === 'low' && 'Low Score'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {type === 'perfect' && 'They know you completely!'}
                            {type === 'good' && 'They know you pretty well!'}
                            {type === 'low' && 'More time to connect!'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant={messages[type].type === 'text' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleMessageTypeChange(type, 'text')}
                            className={messages[type].type === 'text' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}
                          >
                            <Type className="h-3 w-3 mr-1" />
                            Text
                          </Button>
                          <Button
                            variant={messages[type].type === 'image' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleMessageTypeChange(type, 'image')}
                            className={messages[type].type === 'image' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}
                          >
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Image
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Message Text</Label>
                        <Textarea
                          value={messages[type].text}
                          onChange={(e) => handleMessageTextChange(type, e.target.value)}
                          placeholder={
                            type === 'perfect' ? "Perfect! You know everything about me! ❤️" :
                            type === 'good' ? "Great! You know me pretty well! 💕" :
                            "Let's spend more time together! 😘"
                          }
                          rows={3}
                        />
                      </div>

                      {messages[type].type === 'image' && (
                        <div className="space-y-4">
                          <Label>Celebration Image</Label>
                          {messages[type].image ? (
                            <div className="space-y-3">
                              <div className="relative">
                                <img
                                  src={messages[type].image}
                                  alt={`${type} score`}
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2"
                                  onClick={() => handleMessageTypeChange(type, 'text')}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <Label>Image Caption (Optional)</Label>
                                <Input
                                  value={messages[type].imageCaption || ''}
                                  onChange={(e) => handleImageCaptionChange(type, e.target.value)}
                                  placeholder={`A special celebration for ${theirName}!`}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-pink-300 rounded-lg p-8 text-center hover:border-pink-500 transition-colors cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'message', type)}
                                className="hidden"
                                id={`${type}-image`}
                              />
                              <label htmlFor={`${type}-image`} className="cursor-pointer">
                                {type === 'perfect' && <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />}
                                {type === 'good' && <Star className="h-8 w-8 text-pink-500 mx-auto mb-2" />}
                                {type === 'low' && <Heart className="h-8 w-8 text-blue-500 mx-auto mb-2" />}
                                <p className="text-sm font-medium text-pink-600">Upload celebration image</p>
                                <p className="text-xs text-pink-500 mt-1">Max 10MB • JPG, PNG, GIF</p>
                              </label>
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>

                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertTitle>Pro Tip</AlertTitle>
                  <AlertDescription>
                    You can add both text and image! The text will always show, and the image appears below it when added.
                    {theirName} will love the personal touch! 💖
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button
                  variant="outline"
                  className="gap-2 flex-1"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Questions
                </Button>
                <Button
                  className="gap-2 flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => setStep(4)}
                >
                  <Gift className="h-4 w-4" />
                  Add Love Reveal
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 4 && (
            <Card className="border-pink-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-6 w-6 text-pink-500" />
                  Love Reveal
                </CardTitle>
                <CardDescription>
                  Add a special message for {theirName} to see before the quiz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Enable Love Reveal</Label>
                    <p className="text-sm text-gray-500">
                      Show a special message before the quiz starts
                    </p>
                  </div>
                  <Switch
                    checked={loveReveal.enabled}
                    onCheckedChange={(checked) => setLoveReveal({ ...loveReveal, enabled: checked })}
                  />
                </div>

                {loveReveal.enabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="reveal-title">Reveal Title</Label>
                      <Input
                        id="reveal-title"
                        placeholder={`A Special Message from ${creatorName} to ${theirName}`}
                        value={loveReveal.title}
                        onChange={(e) => setLoveReveal({ ...loveReveal, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Reveal Type</Label>
                      <Tabs 
                        defaultValue="text" 
                        value={loveReveal.type}
                        onValueChange={(value) => setLoveReveal({ ...loveReveal, type: value })}
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="text">Text Message</TabsTrigger>
                          <TabsTrigger value="image">Image Message</TabsTrigger>
                        </TabsList>
                        <TabsContent value="text" className="mt-4">
                          <Textarea
                            placeholder={`To my dearest ${theirName},\n\nI created this quiz to show you how much our memories mean to me...`}
                            value={loveReveal.text}
                            onChange={(e) => setLoveReveal({ ...loveReveal, text: e.target.value })}
                            rows={5}
                          />
                        </TabsContent>
                        <TabsContent value="image" className="mt-4">
                          {loveReveal.image ? (
                            <div className="relative">
                              <img
                                src={loveReveal.image}
                                alt="Love reveal"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={() => setLoveReveal({ ...loveReveal, image: null })}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-pink-300 rounded-lg p-8 text-center hover:border-pink-500 transition-colors cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'reveal')}
                                className="hidden"
                                id="reveal-image"
                              />
                              <label htmlFor="reveal-image" className="cursor-pointer">
                                <Gift className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                                <p className="text-sm font-medium text-pink-600">Upload love reveal image</p>
                                <p className="text-xs text-pink-500 mt-1">Max 10MB • A special image for {theirName}</p>
                              </label>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>

                    {loveReveal.title && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Preview for {theirName}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <h4 className="font-semibold">{loveReveal.title}</h4>
                            {loveReveal.type === 'image' && loveReveal.image && (
                              <img
                                src={loveReveal.image}
                                alt="Reveal preview"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            )}
                            {loveReveal.type === 'text' && loveReveal.text && (
                              <p className="text-gray-500 whitespace-pre-line">{loveReveal.text}</p>
                            )}
                            {(!loveReveal.image && !loveReveal.text && loveReveal.type === 'text') && (
                              <p className="text-gray-500 italic">Your reveal message will appear here...</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button
                  variant="outline"
                  className="gap-2 flex-1"
                  onClick={() => setStep(3)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Messages
                </Button>
                <Button
                  className="gap-2 flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => setStep(5)}
                >
                  <Eye className="h-4 w-4" />
                  Preview Quiz
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 5 && (
            <Card className="border-pink-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-6 w-6 text-pink-500" />
                  Final Preview
                </CardTitle>
                <CardDescription>
                  Review your quiz before publishing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="summary">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Quiz Summary
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Title:</span>
                            <span className="font-semibold text-pink-600">{gameTitle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">From:</span>
                            <span className="font-semibold">{creatorName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">For:</span>
                            <span className="font-semibold text-pink-600">{theirName}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Questions:</span>
                            <span className="font-semibold">5/5 Complete</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Love Reveal:</span>
                            <Badge variant={loveReveal.enabled ? "default" : "outline"}>
                              {loveReveal.enabled ? 'Enabled ✨' : 'Disabled'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Total Points:</span>
                            <span className="font-semibold">{questions.length * 2}</span>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="questions">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Questions Preview
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 max-h-80 overflow-y-auto">
                        {questions.map((q) => (
                          <Card key={q.id}>
                            <CardHeader className="py-3">
                              <div className="flex items-center gap-2">
                                <Badge className="h-6 w-6 p-0 flex items-center justify-center">
                                  {q.id}
                                </Badge>
                                <CardTitle className="text-sm">{q.text}</CardTitle>
                                <Badge variant="outline" className="ml-auto">
                                  {q.type === 'options' ? 'Multiple Choice' : 'Text Answer'}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="py-2">
                              {q.type === 'options' ? (
                                <div className="space-y-2">
                                  <p className="text-sm font-medium">Options:</p>
                                  {q.options.map((opt, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${
                                        idx === q.correctOption 
                                          ? 'bg-green-100 text-green-600 border border-green-200' 
                                          : 'bg-gray-100 text-gray-600'
                                      }`}>
                                        {idx === q.correctOption ? <Check className="h-2 w-2" /> : String.fromCharCode(65 + idx)}
                                      </div>
                                      <span className="text-sm">{opt}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm font-medium">Text Answer</span>
                                  <Badge variant="secondary" className="text-xs">
                                    Any answer is correct
                                  </Badge>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Data Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                      Click below to see all data that will be sent to the backend API in your browser console.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
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
                    >
                      <FileText className="h-4 w-4" />
                      Log Complete Data to Console
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button
                  variant="outline"
                  className="gap-2 flex-1"
                  onClick={() => setStep(4)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Reveal
                </Button>
                <Button
                  className="gap-2 flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                  onClick={handleFinishCreator}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creating Quiz...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create & Share
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 6 && shareLink && (
            <Card className="border-pink-200 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                  <Sparkles className="h-6 w-6 text-pink-500" />
                </div>
                <CardTitle className="text-2xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Love Quiz Created! ✨
                </CardTitle>
                <CardDescription className="text-base">
                  Share this beautiful quiz with {theirName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-pink-500" />
                      Ready for {theirName}!
                    </CardTitle>
                    <CardDescription>Share this link with them</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input
                        value={shareLink}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              onClick={() => {
                                navigator.clipboard.writeText(shareLink);
                                showMessage('Copied!', 'Link copied to clipboard! 📋', 'success');
                              }}
                            >
                              <CopyIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy link</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        className="gap-2 bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => {
                          const text = `💖 Hey ${theirName}! I made a special Love Quiz for you! Can you guess how well you know me? 🌹 ${shareLink}`;
                          navigator.clipboard.writeText(text);
                          showMessage('Copied!', 'Message copied! 📋\nPaste it in WhatsApp, iMessage, etc.', 'success');
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                        Copy Message
                      </Button>
                      <Button
                        className="gap-2"
                        variant="outline"
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
                      >
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-lg border p-3 text-center">
                        <div className="text-xl font-bold text-pink-600">5</div>
                        <div className="text-xs text-gray-500">Questions</div>
                      </div>
                      <div className="rounded-lg border p-3 text-center">
                        <div className="text-xl font-bold text-pink-600">10</div>
                        <div className="text-xs text-gray-500">Points</div>
                      </div>
                      <div className="rounded-lg border p-3 text-center">
                        <div className="text-xl font-bold text-pink-600">
                          {loveReveal.enabled ? '✨' : '—'}
                        </div>
                        <div className="text-xs text-gray-500">Reveal</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Successfully Created!</AlertTitle>
                  <AlertDescription>
                    Your quiz is saved and ready to share. {theirName} will see your love reveal, 
                    answer {questions.length} questions, and get a personalized score message!
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    className="gap-2 bg-pink-500 hover:bg-pink-600 text-white"
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
                  >
                    <Plus className="h-4 w-4" />
                    Create Another Quiz
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => window.open(shareLink, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                    Preview Quiz
                  </Button>
                </div>

                <Separator />

                <p className="text-center text-sm text-gray-500">
                  ❤️ Made with love for {theirName} by {creatorName}
                </p>
              </CardContent>
            </Card>
          )}

          {step < 6 && step > 1 && (
            <div className="text-center">
              <Button
                variant="ghost"
                className="gap-2"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Create