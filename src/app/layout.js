"use client";

import { useState } from "react";
import "./globals.css";

const axios = require('axios');

export default function RootLayout({ children }) {
  const [currentQuestionId, setCurrentQuestionId] = useState('q0');
  const [prevQuestionId, setPrevQuestionId] = useState('q0');
  const [nextQuestionId, setNextQuestionId] = useState('q1');
  const [answers, setAnswers] = useState({
    'q1': null,
    'q2': null,
    'q3': null,
    'q4': null,
    'q5': null,
    'q6': null,
    'q7': null,
    'q8': null,
    'q9': null,
    'q10': null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isWarrior, setIsWarrior] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const CATEGORIES = {
    MYTHIC: {
      name: 'Mythic',
      description: 'Kandidat dengan kesiapan maksimal dan potensi tinggi untuk mengikuti program coaching premium.',
      characteristics: [
        'Pemahaman mendalam tentang konten',
        'Konsisten membuat konten',
        'Sudah familiar dan rutin menggunakan AI',
        'Memiliki waktu yang cukup setiap hari',
        'Siap berinvestasi lebih besar',
        'Motivasi sangat tinggi',
        'Skillset sudah mumpuni',
        'Pernah mengalami viral'
      ]
    },
    LEGEND: {
      name: 'Legend',
      description: 'Kandidat yang solid namun masih membutuhkan peningkatan di beberapa aspek.',
      characteristics: [
        'Pemahaman dan pengalaman yang cukup, meski belum sepenuhnya konsisten',
        'Paparan terhadap AI dan alokasi waktu di level menengah',
        'Kesiapan investasi dan motivasi cukup baik',
        'Skillset dan pengalaman viral masih berkembang',
        'Penghasilan dari konten di level menengah'
      ]
    },
    WARRIOR: {
      name: 'Warrior',
      description: 'Kandidat yang masih sangat awam dan memerlukan pendekatan dasar sebelum program coaching intensif.',
      characteristics: [
        'Pemahaman yang terbatas tentang konten',
        'Pengalaman minimal dalam membuat konten',
        'Paparan AI rendah',
        'Waktu dan investasi terbatas',
        'Motivasi dan skillset masih perlu dibangun',
        'Penghasilan dari konten sangat rendah atau nihil'
      ]
    }
  };

  const questions = {
    q0: {
      id: 'q0',
      type: 'biodata',
      question: 'Test',
      nextQuestionId: 'q1',
    },
    q1: {
      id: 'q1',
      type: 'multiple-choice',
      question: 'Apa itu konten menurut kamu?',
      prevQuestionId: 'q0',
      options: [
        { 
          text: 'Konten adalah segala bentuk informasi yang dibuat dan dibagikan secara online dengan tujuan membangun engagement.',
          points: 3,
          nextQuestionId: 'q2',
        },
        { 
          text: 'Konten adalah postingan yang saya buat di media sosial tanpa definisi mendalam atau strategi tertentu.',
          points: 2,
          nextQuestionId: 'q2',
        },
        { 
          text: 'Saya tidak yakin apa itu konten.',
          points: 1,
          nextQuestionId: 'q2',
          isWarriorTrigger: true
        }
      ]
    },
    q2: {
      id: 'q2',
      type: 'multiple-choice',
      question: 'Apakah kamu memiliki pengalaman dalam membuat konten?',
      prevQuestionId: 'q1',
      options: [
        { 
          text: 'Saya membuat konten secara rutin dan konsisten.',
          points: 3,
          nextQuestionId: 'q3',
        },
        { 
          text: 'Saya pernah membuat beberapa konten, tapi tidak konsisten.',
          points: 2,
          nextQuestionId: 'q3',
        },
        { 
          text: 'Saya belum pernah membuat konten.',
          points: 1,
          nextQuestionId: 'q3',
        }
      ]
    },
    q3: {
      id: 'q3',
      type: 'multiple-choice',
      question: 'Seberapa terpapar kamu dengan AI (Artificial Intelligence)?',
      prevQuestionId: 'q2',
      options: [
        { 
          text: 'Saya rutin menggunakan alat AI untuk mendukung pembuatan konten.',
          points: 3,
          nextQuestionId: 'q4',
        },
        { 
          text: 'Saya pernah mencoba AI, tapi belum konsisten memanfaatkannya.',
          points: 2,
          nextQuestionId: 'q4',
        },
        { 
          text: 'Saya belum pernah menggunakan AI untuk konten.',
          points: 1,
          nextQuestionId: 'q4',
        }
      ]
    },
    q4: {
      id: 'q4',
      type: 'multiple-choice',
      question: 'Berapa banyak waktu kamu yang tersedia untuk belajar content creation?',
      prevQuestionId: 'q3',
      options: [
        { 
          text: 'Saya memiliki banyak waktu setiap hari (lebih dari 2 jam/hari).',
          points: 3,
          nextQuestionId: 'q5',
        },
        { 
          text: 'Saya bisa meluangkan waktu beberapa kali dalam seminggu.',
          points: 2,
          nextQuestionId: 'q5',
        },
        { 
          text: 'Saya sangat sibuk dan jarang punya waktu.',
          points: 1,
          nextQuestionId: 'q5',
        }
      ]
    },
    q5: {
      id: 'q5',
      type: 'multiple-choice',
      question: 'Berapa jumlah nilai investasi yang rela kamu bayar untuk belajar AI-Driven Content Creation? (per bulan):',
      prevQuestionId: 'q4',
      options: [
        { 
          text: 'Lebih dari Rp2.000.000.',
          points: 3,
          nextQuestionId: 'q6',
        },
        { 
          text: 'Rp500.000 – Rp2.000.000.',
          points: 2,
          nextQuestionId: 'q6',
        },
        { 
          text: 'Kurang dari Rp500.000.',
          points: 1,
          nextQuestionId: 'q6',
        }
      ]
    },
    q6: {
      id: 'q6',
      type: 'multiple-choice',
      question: 'Seberapa besar keinginan kamu untuk sukses di dunia Content Creation?',
      prevQuestionId: 'q5',
      options: [
        { 
          text: 'Sangat kuat – saya 100% berkomitmen mencapai tujuan.',
          points: 3,
          nextQuestionId: 'q7',
        },
        { 
          text: 'Cukup kuat – saya termotivasi tapi butuh pendampingan.',
          points: 2,
          nextQuestionId: 'q7',
        },
        { 
          text: 'Tidak terlalu – saya masih ragu-ragu.',
          points: 1,
          nextQuestionId: 'q7',
        }
      ]
    },
    q7: {
      id: 'q7',
      type: 'multiple-choice',
      question: 'Apakah kamu sudah memiliki skillset yang memadai?',
      prevQuestionId: 'q6',
      options: [
        { 
          text: 'Saya sudah memiliki skill yang memadai dan terus mengasahnya.',
          points: 3,
          nextQuestionId: 'q8',
        },
        { 
          text: 'Saya memiliki dasar, namun masih perlu belajar banyak.',
          points: 2,
          nextQuestionId: 'q8',
        },
        { 
          text: 'Saya belum memiliki skill yang relevan.',
          points: 1,
          nextQuestionId: 'q8',
        }
      ]
    },
    q8: {
      id: 'q8',
      type: 'multiple-choice',
      question: 'Apakah kamu pernah viral sebelumnya?',
      prevQuestionId: 'q7',
      options: [
        { 
          text: 'Ya, salah satu konten saya pernah mendapatkan exposure signifikan/viral.',
          points: 3,
          nextQuestionId: 'q9',
        },
        { 
          text: 'Saya pernah mendapatkan perhatian meski tidak viral.',
          points: 2,
          nextQuestionId: 'q9',
        },
        { 
          text: 'Tidak, belum pernah mendapatkan traction yang berarti.',
          points: 1,
          nextQuestionId: 'q9',
        }
      ]
    },
    q9: {
      id: 'q9',
      type: 'multiple-choice',
      question: 'Berapa penghasilan saat ini yang kamu dapatkan dari konten? (per bulan)',
      prevQuestionId: 'q8',
      options: [
        { 
          text: 'Lebih dari Rp10.000.000.',
          points: 4,
          nextQuestionId: 'q10',
        },
        { 
          text: 'Rp5.000.000 – Rp10.000.000.',
          points: 3,
          nextQuestionId: 'q10',
        },
        { 
          text: 'Rp1.000.000 – Rp5.000.000.',
          points: 2,
          nextQuestionId: 'q10',
        },
        { 
          text: 'Tidak ada penghasilan.',
          points: 1,
          nextQuestionId: 'q10',
        }
      ]
    },
    q10: {
      id: 'q10',
      type: 'multiple-choice',
      question: 'Berapa target kamu untuk penghasilan dari konten? (per bulan)',
      prevQuestionId: 'q9',
      options: [
        { 
          text: 'Lebih dari Rp10.000.000.',
          points: 4,
          nextQuestionId: 'end',
        },
        { 
          text: 'Rp5.000.000 – Rp10.000.000.',
          points: 3,
          nextQuestionId: 'end',
        },
        { 
          text: 'Rp1.000.000 – Rp5.000.000.',
          points: 2,
          nextQuestionId: 'end',
        },
        { 
          text: 'Saya belum memiliki target yang jelas.',
          points: 1,
          nextQuestionId: 'end',
        }
      ]
    }
  };

  const handleChangeFullName = (value) => {
    setFullName(value);
  };

  const handleChangeEmail = (value) => {
    setEmail(value);
  };

  const handleChangePhoneNumber = (value) => {
    setPhoneNumber(value);
  };

  const calculateCategory = (finalScore, isWarriorFlag) => {
    if (isWarriorFlag || finalScore <= 15) {
      return CATEGORIES.WARRIOR;
    }
    if (finalScore >= 24) {
      return CATEGORIES.MYTHIC;
    }
    return CATEGORIES.LEGEND;
  };

  const handlePressBackButton = () => {
    if (!prevQuestionId) return;

    // Store current question ID before updating
    const tempCurrentQuestionId = currentQuestionId;

    // Update navigation states
    setCurrentQuestionId(prevQuestionId);
    // Update prev question ID from questions data
    setPrevQuestionId(questions[prevQuestionId]?.prevQuestionId || null);
    // Set next question ID to current question
    setNextQuestionId(tempCurrentQuestionId);
    
    setCurrentStep(prev => prev - 1);
  }

  const handlePressNextButton = async () => {
    // Special handling for q0
    if (currentQuestionId ===  'q0') {
      if (!fullName || !email || !phoneNumber) return;

      setPrevQuestionId('q0');
      setCurrentQuestionId('q1');
      setNextQuestionId(questions['q1'].options[0].nextQuestionId);
      setCurrentStep(prev => prev + 1);
      return
    }

    // For regular questions
    if (!answers[currentQuestionId]) return;

    if (nextQuestionId === 'end') {
      setShowResult(true);
      try {
        // This calls your local API route, not Notion directly
        const response = await axios.post(`https://script.google.com/macros/s/AKfycbyaWgBBeODFJsjrw9egzWiFECAHylWzvEW7xo3vKQMQ-yuOOFQ4rpDXWuYZ9Mhf7XQ9/exec?fullName=${fullName}&email=${email}&phoneNumber=${phoneNumber}&contentLevel=${answers['q1']}&contentExp=${answers['q2']}&aiAwareness=${answers['q3']}&availability=${answers['q4']}&totalInvestment=${answers['q5']}&desireLevel=${answers['q6']}&skillset=${answers['q7']}&virality=${answers['q8']}&currentRevenue=${answers['q9']}&targetRevenue=${answers['q10']}`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          }
        });
        console.log('Spreadsheet data:', response.data);
      } catch (error) {
        console.error('Error fetching from Notion:', error);
      }
      return;
    }

    // Update navigation states
    setPrevQuestionId(currentQuestionId);
    setCurrentQuestionId(nextQuestionId);

    // Set next question ID based on first option of next question
    // (will be updated when user selects an answer)
    const nextQuestion = questions[nextQuestionId];
    if (nextQuestion && nextQuestion.options) {
      setNextQuestionId(nextQuestion.options[0].nextQuestionId);
    }
    setCurrentStep(prev => prev + 1);
  }

  const handleAnswerClick = (option) => {    
    if (option.isWarriorTrigger) {
      setIsWarrior(true);
    }
    
    // Update answers
    setAnswers(prev => ({
      ...prev,
      [currentQuestionId]: option.points
    }));
  
    // Update next question ID based on selected answer
    setNextQuestionId(option.nextQuestionId);
  };

  const currentQuestion = questions[currentQuestionId];
  const totalSteps = Object.keys(questions).length;
  
  return (
    <html lang="en">
      <body>
        <div className="w-full mx-auto max-h-screen">
          {!showResult ? (
            <div className="w-full mx-auto min-h-screen items-center justify-center p-8">
              <div 
                className="rounded-lg"
                style={{
                  background: "linear-gradient(135deg, #5e5def 50%, #6968f7 50%, #12174F 100%)",
                  padding: "20px"
                }}
              >
                  <div className="flex items-center text-white mb-4">
                      <h1 className="text-xl font-semibold">Registration Form - Private Coaching by AI Creator Labs</h1>
                  </div>
      
                  {/* Progress Bar */}
                  <>
                      <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                              className="h-full max-w-7xl rounded-full"
                              style={{
                                  width: `${currentStep / totalSteps * 100}%`,
                                  background: "linear-gradient(to right, #fff, rgba(255,255,255,0.8))"
                              }}
                          />
                      </div>
                      <p className="text-white/90 text-sm mt-2">
                      Pertanyaan {currentStep} dari {totalSteps}
                      </p>
                  </>
              </div>
              <div className="shadow-lg p-8 rounded-lg mt-2 " style={{
                background: "linear-gradient(135deg, #5e5def 40%, #6968f7 50%, #12174F 100%)",
              }}>
                {currentQuestionId === "q0" && (
                  <div>
                    <h3 className="text-2xl font-bold text-white-900 mb-2">
                      Nama Lengkap
                    </h3>
                    <div className="space-y-4 mb-8">
                      <input
                          className={"w-full p-3 rounded-lg text-gray-800 max-w-8xl"}
                          type="text"
                          placeholder={"Contoh: Ricky Chandra Johanes"}
                          value={fullName}
                          onChange={(e) => handleChangeFullName(e.target.value)}
                      />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white-900 mb-2">
                      Email
                    </h3>
                    <div className="space-y-4 mb-8">
                      <input
                          className={"w-full p-3 rounded-lg text-gray-800 max-w-8xl"}
                          type="text"
                          placeholder={"Contoh: techpreneurboi@aicreatorlabs.id"}
                          value={email}
                          onChange={(e) => handleChangeEmail(e.target.value)}
                      />
                    </div>

                    <h3 className="text-2xl font-bold text-white-900 mb-2">
                      Nomor HP / WhatsApp
                    </h3>
                    <div className="space-y-4">
                      <input
                          className={"w-full p-3 rounded-lg text-gray-800 max-w-8xl"}
                          type="text"
                          placeholder={"Contoh: 6281234567890"}
                          value={phoneNumber}
                          onChange={(e) => handleChangePhoneNumber(e.target.value)}
                          onKeyPress={(e) => {
                            if (!/\d/.test(e.key)) {
                                e.preventDefault();
                            }
                          }}
                          onKeyDown={(e) => {
                              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                  e.preventDefault();
                              }
                          }}
                      />
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => handlePressNextButton(currentQuestion.nextQuestionId)}
                        className={`px-6 py-2 rounded-lg text-white mt-12 w-full ${!fullName || !email || !phoneNumber ? "bg-gray-500" : "bg-slate-900 hover:bg-slate-800 transition-colors duration-150"} `}
                        disabled={!fullName || !email || !phoneNumber}
                        style={{
                            marginLeft: "auto"
                        }}
                      >
                        Selanjutnya
                      </button>
                    </div>
                  </div>
                )}
                {currentQuestionId !== "q0" && (
                  <div>
                    <h3 className="text-2xl font-bold text-white-900 mb-8">
                      {console.log(questions[currentQuestionId])}
                      {questions[currentQuestionId].question}
                    </h3>
                    
                    <div className="space-y-4">
                      {questions[currentQuestionId].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerClick(option)}
                          className={`w-full rounded-lg text-left px-6 py-6 ${answers[currentQuestionId] !== option.points ? "bg-gray-800 text-white border border-gray-600 hover:bg-gray-600 transition-colors duration-150 whitespace-normal text-wrap" : "bg-gray-600 text-white"}`}
                        >
                          {option.text}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handlePressBackButton(questions[prevQuestionId])}
                        className={`px-6 py-2 rounded-lg text-white mt-12 w-full bg-slate-900 hover:bg-slate-800 transition-colors duration-150"} `}
                        disabled={!prevQuestionId}
                      >
                        ←
                      </button>
                      <button
                        onClick={() => handlePressNextButton()}
                        className={`px-6 py-2 rounded-lg text-white mt-12 w-full ${!answers[currentQuestionId] ? "bg-gray-500" : "bg-slate-900 hover:bg-slate-800 transition-colors duration-150"} `}
                        disabled={!answers[currentQuestionId]}
                      >
                        {currentStep === totalSteps ? "Submit " : "→"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            ) : (
            <div className="w-full mx-auto min-h-screen items-center justify-center flex text-center p-8">
              <div className="bg-gray-800 max-w-8xl rounded-xl shadow-lg p-8">
                <div className="rounded-lg">
                  <h2 className="text-xl font-bold text-white-900 mb-2">
                  ✅ DATA BERHASIL DIKIRIM!
                  </h2>
                  <p className="text-white-800 mb-4">Anggota tim kami akan segera menghubungi kamu</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
