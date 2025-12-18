import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load knowledge base
const knowledgeBase = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'knowledge-base.json'), 'utf8')
);

// Simple keyword matching for retrieval
function retrieveRelevantContext(query) {
  const queryLower = query.toLowerCase();
  const relevantSections = [];

  // Check for keywords and retrieve relevant sections
  const keywordMap = {
    // Admissions related
    'admission|apply|eligibility|cat|entrance|ipmat': knowledgeBase.admissions,
    'fee|cost|price|scholarship|financial': knowledgeBase.fees_and_scholarships,
    
    // Program related
    'mba|program|course|pgp|ipm|epgp|pgpmx|dpm|edpm': knowledgeBase.academic_programs,
    'executive|pgpx': knowledgeBase.academic_programs,
    'fdp|faculty development': knowledgeBase.executive_programs,
    
    // Placement related
    'placement|salary|job|recruit|company|sector': knowledgeBase.placements,
    
    // Campus related
    'campus|facility|hostel|accommodation|location|infrastructure': knowledgeBase.campus,
    
    // Faculty related
    'faculty|professor|teacher|research|department|collaboration': knowledgeBase.faculty,
    
    // Student life
    'club|event|activity|student life|culture|diversity': knowledgeBase.student_life,
    
    // Research and conferences
    'research|publication|conference|cere': knowledgeBase.research_and_conferences,
    
    // FAQs
    'faq|question|answer|help': knowledgeBase.faqs,
    
    // General info
    'iim|indore|about|institution|vision|mission': knowledgeBase.institution,
  };

  // Match keywords and collect relevant sections
  for (const [keywords, section] of Object.entries(keywordMap)) {
    const keywordArray = keywords.split('|');
    if (keywordArray.some(keyword => queryLower.includes(keyword))) {
      relevantSections.push(section);
    }
  }

  // If no specific match, return general info
  if (relevantSections.length === 0) {
    relevantSections.push(knowledgeBase.institution);
  }

  return relevantSections;
}

// Format context for LLM
function formatContext(relevantSections) {
  const contextParts = [];
  
  relevantSections.forEach(section => {
    if (section) {
      contextParts.push(JSON.stringify(section, null, 2));
    }
  });

  return contextParts.join('\n\n---\n\n');
}

// Check if query is on-topic or a greeting/casual message
function isOnTopic(query, conversationHistory = []) {
  const queryLower = query.toLowerCase().trim();
  
  // Greetings and casual messages (always allow)
  const greetings = [
    'hi', 'hello', 'hey', 'hola', 'bonjour', 'namaste', 'namaskar', 'vanakkam', 'namaskara',
    'buenos dias', 'buenos noches', 'good morning', 'good afternoon', 'good evening',
    'how are you', 'whats up', 'what\'s up', 'how you doing', 'how\'re you',
    'thanks', 'thank you', 'thankyou', 'thanks a lot', 'thank you so much',
    'ok', 'okay', 'sure', 'yes', 'no', 'nope', 'yeah', 'yep',
    'bye', 'goodbye', 'see you', 'take care', 'cheers', 'cya',
    'help', 'can you help', 'can you assist', 'i need help',
    // Hindi greetings
    'नमस्ते', 'नमस्कार', 'हेलो', 'हाय', 'सुप्रभात', 'शुभ संध्या',
    'धन्यवाद', 'धन्य', 'ठीक है', 'हाँ', 'नहीं', 'अलविदा',
    // Tamil greetings
    'வணக்கம்', 'ஹலோ', 'ஹாய்', 'நன்றி', 'சரி', 'ஆம்', 'இல்லை', 'பிரியாவிடை',
    // Telugu greetings
    'నమస్కారం', 'హలో', 'హాయ్', 'ధన్యవాదాలు', 'సరిగ్గా', 'అవును', 'కాదు', 'విదాయ',
    // Spanish greetings
    'buenos dias', 'buenas noches', 'gracias', 'de nada', 'si', 'no', 'adios',
    // French greetings
    'bonjour', 'bonsoir', 'merci', 'de rien', 'oui', 'non', 'au revoir'
  ];
  
  // Core IIM Indore related keywords (strong indicators)
  const coreIIMKeywords = [
    'iim', 'indore', 'mba', 'admission', 'placement', 'campus', 'program',
    'pgp', 'pgpx', 'ipm', 'epgp', 'dpm', 'edpm', 'pgpmx', 'faculty', 'student', 
    'scholarship', 'fee', 'hostel', 'cat', 'ipmat', 'entrance', 'recruit', 'salary', 
    'course', 'class', 'exam', 'application', 'interview', 'result', 'club', 'event', 
    'facility', 'research', 'academic', 'management', 'business', 'education', 'director',
    'board', 'governance', 'collaboration', 'international', 'conference', 'cere',
    'specialization', 'internship', 'recruiter', 'sector', 'infrastructure', 'diversity'
  ];
  
  // Comparison/preference keywords (only valid in context)
  const comparisonKeywords = ['better', 'best', 'compare', 'difference', 'vs', 'versus', 'prefer', 'suitable'];

  // Check for greetings first (always allow)
  const isGreeting = greetings.some(greeting => queryLower === greeting || queryLower.startsWith(greeting + ' '));
  if (isGreeting) {
    return true;
  }
  
  // Check for core keywords
  const hasCoreKeyword = coreIIMKeywords.some(keyword => queryLower.includes(keyword));
  if (hasCoreKeyword) {
    return true;
  }
  
  // Check if it's a follow-up comparison question in an IIM context
  if (conversationHistory && conversationHistory.length > 0) {
    const hasComparisonKeyword = comparisonKeywords.some(keyword => queryLower.includes(keyword));
    
    if (hasComparisonKeyword) {
      // Check if previous messages contain IIM keywords (context-aware)
      const recentMessages = conversationHistory.slice(-4); // Last 2 exchanges
      const hasIIMContext = recentMessages.some(msg => {
        if (msg.content) {
          return coreIIMKeywords.some(keyword => msg.content.toLowerCase().includes(keyword));
        }
        return false;
      });
      
      if (hasIIMContext) {
        return true;
      }
    }
  }
  
  return false;
}

// Get guardrail response for off-topic queries
function getGuardrailResponse(language = 'en') {
  const responses = {
    en: "I'm specifically designed to help with questions about IIM Indore. Please ask me about admissions, programs, placements, campus facilities, or any other aspect of IIM Indore.",
    hi: "मैं विशेष रूप से IIM इंदौर के बारे में सवालों के जवाब देने के लिए डिज़ाइन किया गया हूँ। कृपया मुझसे प्रवेश, कार्यक्रम, प्लेसमेंट, कैंपस सुविधाओं या IIM इंदौर के किसी अन्य पहलू के बारे में पूछें।",
    ta: "நான் IIM இந்தூர் பற்றிய கேள்விகளுக்கு பதிலளிக்க வடிவமைக்கப்பட்டுள்ளேன். தயவுசெய்து சேர்க்கை, நிரல்கள், வேலை வாய்ப்பு, வளாக வசதிகள் அல்லது IIM இந்தூரின் অন்য எந்த அம்சம் பற்றியும் என்னிடம் கேளுங்கள்.",
    te: "నేను IIM ఇందూర్ గురించిన ప్రశ్నలకు సమాధానం ఇవ్వడానికి ప్రత్యేకంగా రూపొందించబడ్డాను. దయచేసి ప్రవేశం, కార్యక్రమాలు, ప్లేస్‌మెంట్‌లు, క్యాంపస్ సదుపాయాలు లేదా IIM ఇందూర్ యొక్క ఏదైనా ఇతర అంశ గురించి నన్ను అడగండి.",
    es: "Estoy diseñado específicamente para ayudarte con preguntas sobre IIM Indore. Por favor, pregúntame sobre admisiones, programas, colocaciones, instalaciones del campus o cualquier otro aspecto de IIM Indore.",
    fr: "Je suis spécifiquement conçu pour répondre aux questions sur IIM Indore. Veuillez me poser des questions sur les admissions, les programmes, les placements, les installations du campus ou tout autre aspect d'IIM Indore."
  };

  return responses[language] || responses['en'];
}

export { retrieveRelevantContext, formatContext, isOnTopic, getGuardrailResponse };
