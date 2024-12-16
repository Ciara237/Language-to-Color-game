import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';

// Programming languages with their colors
const LANGUAGES = [
  { name: 'JavaScript', color: '#F0DB4F' },
  { name: 'Python', color: '#3776AB' },
  { name: 'Java', color: '#FF0000' },
  { name: 'C++', color: '#00599C' },
  { name: 'Ruby', color: '#CC342D' },
  { name: 'Swift', color: '#F05138' },
  { name: 'Go', color: '#00ADD8' },
  { name: 'Rust', color: '#000000' },
  { name: 'TypeScript', color: '#007ACC' },
  { name: 'Kotlin', color: '#7F52FF' },
  { name: 'PHP', color: '#777BB3' },
  { name: 'C#', color: '#9B4F0F' },
  { name: 'R', color: '#276DC3' },
  { name: 'Scala', color: '#DC322F' },
  { name: 'Dart', color: '#0175C2' },
  { name: 'Perl', color: '#39457E' },
  { name: 'Haskell', color: '#5D4F85' },
  { name: 'Lua', color: '#00007C' },
  { name: 'Objective-C', color: '#438EFF' },
  { name: 'Matlab', color: '#0076A8' },
  { name: 'Shell', color: '#89E051' },
  { name: 'Groovy', color: '#4D4D4D' },
  { name: 'Elixir', color: '#6E4A7E' }
];

const LanguageColorGame = () => {
  const [showLanguages, setShowLanguages] = useState(true);
  const [languageInput, setLanguageInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [remainingLanguages, setRemainingLanguages] = useState([...LANGUAGES]);
  const [gameOver, setGameOver] = useState(false);

  // Success and failure sounds 
  //const successSound = new Audio('/path/to/success-sound.mp3');
  //const failureSound = new Audio('/path/to/failure-sound.mp3');

  useEffect(() => {
    // Hide languages after 4 seconds
    const timer = setTimeout(() => {
      setShowLanguages(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    // Check if game is already over
    if (gameOver || attempts.length >= 20) {
      setGameOver(true);
      return;
    }

    // Find the target language
    const targetLanguage = remainingLanguages.find(
      lang => lang.name.toLowerCase() === languageInput.toLowerCase()
    );

    // Check if language was already used
    const languageAlreadyUsed = attempts.some(
      attempt => attempt.language.toLowerCase() === languageInput.toLowerCase()
    );

    let isSuccess = false;
    let gameEnds = false;

    if (languageAlreadyUsed) {
      // Automatic fail if language is reused
      isSuccess = false;
      gameEnds = attempts.length + 1 >= 5;
    } else if (targetLanguage) {
      // Check if color matches
      isSuccess = targetLanguage.color.toLowerCase() === colorInput.toLowerCase();
      
      // Determine if game should end
      gameEnds = !isSuccess && attempts.length + 1 >= 5;
    } else {
      // Language not found
      isSuccess = false;
      gameEnds = attempts.length + 1 >= 5;
    }

    // Play sound
    isSuccess ? successSound.play() : failureSound.play();

    // Update game state
    const newAttempt = {
      attemptNumber: attempts.length + 1,
      language: languageInput,
      color: colorInput,
      isSuccess
    };

    const newAttempts = [...attempts, newAttempt];
    setAttempts(newAttempts);

    // Remove used language
    if (targetLanguage) {
      setRemainingLanguages(
        remainingLanguages.filter(lang => lang.name !== targetLanguage.name)
      );
    }

    // Reset inputs
    setLanguageInput('');
    setColorInput('');

    // Check game over conditions
    if (gameEnds || newAttempts.length >= 20) {
      setGameOver(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="text-center text-2xl font-bold">
          Programming Language Color Matching Game
        </CardHeader>
        <CardContent>
          {/* Language Display Phase */}
          {showLanguages && (
            <div className="grid grid-cols-4 gap-4 mb-4">
              {LANGUAGES.map((lang, index) => (
                <div 
                  key={index} 
                  className="p-4 text-center font-bold"
                  style={{ backgroundColor: lang.color, color: 'white' }}
                >
                  {lang.name}
                </div>
              ))}
            </div>
          )}

          {/* Game Input Phase */}
          {!showLanguages && !gameOver && (
            <div className="space-y-4">
              <Input
                placeholder="Enter Programming Language"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
              />
              <Input
                placeholder="Enter Language Color (HEX)"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
              />
              <Button onClick={handleSubmit} className="w-full">
                Submit Guess
              </Button>
            </div>
          )}

          {/* Results Table */}
          {(gameOver || attempts.length > 0) && (
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">Game Results</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2">Attempt</th>
                    <th className="border p-2">Language</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt, index) => (
                    <tr key={index}>
                      <td className="border p-2 text-center">{attempt.attemptNumber}</td>
                      <td 
                        className="border p-2 text-center"
                        style={{ backgroundColor: attempt.color }}
                      >
                        {attempt.language}
                      </td>
                      <td className="border p-2 text-center">
                        {attempt.isSuccess ? (
                          <div className="bg-green-500 text-white p-1 flex justify-center">
                            <Check />
                          </div>
                        ) : (
                          <div className="bg-red-500 text-white p-1 flex justify-center">
                            <X />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Game Over Message */}
          {gameOver && (
            <div className="text-center mt-4 text-xl font-bold">
              Game Over! You {attempts.filter(a => a.isSuccess).length >= 15 ? 'Won' : 'Lost'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageColorGame;
