'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, CheckCircle, XCircle, RotateCcw, Play, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: string;
  category: string;
}

type QuizState = 'idle' | 'loading' | 'playing' | 'submitting' | 'results';

type AnswerRecord = {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
};

export default function QuizSection() {
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [validated, setValidated] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0, percentage: 0, passed: false });

  // Timer tick
  useEffect(() => {
    if (quizState !== 'playing') return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [quizState]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startQuiz = useCallback(async () => {
    setQuizState('loading');
    try {
      const res = await fetch('/api/quiz');
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setSelectedOption(null);
        setValidated(false);
        setAnswers([]);
        setTimer(0);
        setQuizState('playing');
      } else {
        // No questions in DB, show idle with error
        setQuizState('idle');
      }
    } catch {
      setQuizState('idle');
    }
  }, []);

  const validateAnswer = () => {
    if (selectedOption === null || !questions[currentIndex]) return;
    const q = questions[currentIndex];
    const isCorrect = selectedOption === q.correctIndex;
    setAnswers((prev) => [
      ...prev,
      { questionId: q.id, selectedOption, isCorrect },
    ]);
    setValidated(true);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      // Submit quiz
      submitQuiz();
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setValidated(false);
    }
  };

  const submitQuiz = async () => {
    setQuizState('submitting');
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo@adso.com',
          answers: answers.map((a) => ({
            questionId: a.questionId,
            selectedOption: a.selectedOption,
          })),
          duration: timer,
        }),
      });
      const data = await res.json();
      setScore({
        correct: data.correctAnswers ?? answers.filter((a) => a.isCorrect).length,
        total: data.totalQuestions ?? questions.length,
        percentage: data.score ?? 0,
        passed: data.passed ?? false,
      });
      setQuizState('results');
    } catch {
      // Fallback: calculate locally
      const correct = answers.filter((a) => a.isCorrect).length;
      const pct = Math.round((correct / questions.length) * 100);
      setScore({ correct, total: questions.length, percentage: pct, passed: pct >= 70 });
      setQuizState('results');
    }
  };

  const resetQuiz = () => {
    setQuizState('idle');
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setValidated(false);
    setAnswers([]);
    setTimer(0);
  };

  const currentQuestion = questions[currentIndex];
  const progressPercent = questions.length > 0
    ? ((currentIndex + (validated ? 1 : 0)) / questions.length) * 100
    : 0;

  return (
    <section id="quiz" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Timer className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Examen blanc — Code de la route
              </h2>
              <p className="text-slate-500 text-sm">Testez vos connaissances</p>
            </div>
          </div>

          {/* Idle State */}
          <AnimatePresence mode="wait">
            {quizState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-emerald-200">
                  <CardContent className="pt-8 pb-8 flex flex-col items-center text-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        Prêt pour l&apos;examen ?
                      </h3>
                      <p className="text-slate-500 max-w-md">
                        Cet examen blanc comporte <strong>10 questions</strong> tirées au hasard
                        sur le code de la route français. Vous devez obtenir au moins{' '}
                        <strong>70% de bonnes réponses</strong> pour réussir.
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                      onClick={startQuiz}
                    >
                      <Play className="w-4 h-4" />
                      Commencer l&apos;examen
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Loading State */}
            {quizState === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card>
                  <CardContent className="pt-8 pb-8 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="space-y-3 pt-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Playing State */}
            {(quizState === 'playing' || quizState === 'submitting') && currentQuestion && (
              <motion.div
                key={`playing-${currentIndex}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                          Question {currentIndex + 1}/{questions.length}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {currentQuestion.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm font-mono">
                        <Timer className="w-3.5 h-3.5" />
                        {formatTime(timer)}
                      </div>
                    </div>
                    <Progress value={progressPercent} className="mt-3 h-2 bg-emerald-100 [&>[data-slot=progress-indicator]]:bg-emerald-500" />
                  </CardHeader>

                  <CardContent className="pt-4">
                    <p className="text-lg font-medium text-slate-900 mb-6">
                      {currentQuestion.question}
                    </p>

                    <div className="space-y-3">
                      {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedOption === idx;
                        const isCorrectOption = idx === currentQuestion.correctIndex;
                        let borderClass = 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50';
                        let bgClass = '';
                        let icon = null;

                        if (validated) {
                          if (isCorrectOption) {
                            borderClass = 'border-emerald-500 bg-emerald-50';
                            icon = <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />;
                          } else if (isSelected && !isCorrectOption) {
                            borderClass = 'border-red-400 bg-red-50';
                            icon = <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
                          }
                        } else if (isSelected) {
                          borderClass = 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200';
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={validated}
                            onClick={() => setSelectedOption(idx)}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${borderClass} ${bgClass} ${validated ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                              validated && isCorrectOption
                                ? 'bg-emerald-500 text-white'
                                : validated && isSelected && !isCorrectOption
                                  ? 'bg-red-400 text-white'
                                  : isSelected
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-100 text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className={`flex-1 text-sm md:text-base ${validated && !isSelected && !isCorrectOption ? 'text-slate-400' : 'text-slate-700'}`}>
                              {option}
                            </span>
                            {icon}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after validation */}
                    <AnimatePresence>
                      {validated && currentQuestion.explanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4"
                        >
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
                            <span className="font-semibold">Explication :</span>{' '}
                            {currentQuestion.explanation}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                      {!validated ? (
                        <Button
                          disabled={selectedOption === null}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={validateAnswer}
                        >
                          Valider
                        </Button>
                      ) : (
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={nextQuestion}
                          disabled={quizState === 'submitting'}
                        >
                          {currentIndex + 1 >= questions.length ? (
                            <>
                              Voir les résultats
                              <CheckCircle className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              Question suivante
                              <ChevronRight className="w-4 h-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Results State */}
            {quizState === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-2">
                  <CardContent className="pt-8 pb-8">
                    <div className="text-center space-y-6">
                      {/* Score Circle */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                        className={`mx-auto w-32 h-32 rounded-full flex flex-col items-center justify-center ${score.passed ? 'bg-emerald-100' : 'bg-red-100'}`}
                      >
                        <span className={`text-3xl font-bold ${score.passed ? 'text-emerald-700' : 'text-red-600'}`}>
                          {score.percentage}%
                        </span>
                        <span className={`text-sm ${score.passed ? 'text-emerald-600' : 'text-red-500'}`}>
                          {score.correct}/{score.total}
                        </span>
                      </motion.div>

                      {/* Pass/Fail Message */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        {score.passed ? (
                          <>
                            <h3 className="text-2xl font-bold text-emerald-700">
                              Félicitations ! 🎉
                            </h3>
                            <p className="text-slate-500 mt-1">
                              Vous avez réussi l&apos;examen blanc avec succès.
                            </p>
                          </>
                        ) : (
                          <>
                            <h3 className="text-2xl font-bold text-red-600">
                              Essayez encore
                            </h3>
                            <p className="text-slate-500 mt-1">
                              Vous n&apos;avez pas atteint le seuil de 70%. Continuez à vous entraîner !
                            </p>
                          </>
                        )}
                      </motion.div>

                      {/* Stats Grid */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-3 gap-4 max-w-sm mx-auto"
                      >
                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-2xl font-bold text-emerald-600">{score.correct}</p>
                          <p className="text-xs text-slate-500">Correctes</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-2xl font-bold text-red-500">{score.total - score.correct}</p>
                          <p className="text-xs text-slate-500">Incorrectes</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-2xl font-bold text-slate-700">{formatTime(timer)}</p>
                          <p className="text-xs text-slate-500">Temps</p>
                        </div>
                      </motion.div>

                      {/* Restart Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8"
                          onClick={resetQuiz}
                        >
                          <RotateCcw className="w-4 h-4" />
                          Recommencer
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
