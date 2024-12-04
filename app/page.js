"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function GPA() {
  const [subjects, setSubjects] = useState([{ credits: "", grade: "" }]);
  const [gpa, setGpa] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState("light");
  const { width, height } = useWindowSize();

  const gradesMap = {
    O: 10,
    "A+": 9,
    A: 8,
    B: 7,
    C: 6,
    D: 5,
    F: 0,
  };

  const gifs = {
    outstanding: "https://media.giphy.com/media/l0MYB8Ory7Hqefo9a/giphy.gif",
    great: "https://media.giphy.com/media/xT5LMDsUy5QGmk0LrO/giphy.gif",
    good: "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
    average: "https://media.giphy.com/media/3o6ZsXGfFfdzW5slT6/giphy.gif",
    tryAgain: "https://media.giphy.com/media/xT8qBuhwqoaXxF2zDi/giphy.gif",
  };

  const getRemark = (gpa) => {
    if (gpa >= 9) return { remark: "Outstanding performance!", gif: gifs.outstanding };
    if (gpa >= 8) return { remark: "Great job! You're doing really well.", gif: gifs.great };
    if (gpa >= 7) return { remark: "Good work! Keep pushing forward.", gif: gifs.good };
    if (gpa >= 5) return { remark: "You’re on track. Aim higher next time!", gif: gifs.average };
    return { remark: "Don’t be discouraged! Reflect and try again.", gif: gifs.tryAgain };
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleAddSubject = () => {
    setSubjects([...subjects, { credits: "", grade: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const calculateGPA = () => {
    for (let i = 0; i < subjects.length; i++) {
      if (!subjects[i].credits || !subjects[i].grade) {
        alert("Please fill in all credits and grades.");
        return;
      }
    }
    let totalCredits = 0;
    let weightedGrades = 0;

    subjects.forEach(({ credits, grade }) => {
      const numericGrade = gradesMap[grade] || 0;
      const numericCredits = parseFloat(credits) || 0;

      weightedGrades += numericGrade * numericCredits;
      totalCredits += numericCredits;
    });

    const calculatedGpa = totalCredits > 0 ? (weightedGrades / totalCredits).toFixed(2) : 0;
    setGpa(calculatedGpa);

    setShowModal(true);
  };

  const { remark, gif } = getRemark(gpa);

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center p-5`}>
      {/* Header Section */}
      <header className="w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">GPA Calculator</h1>
        {/* <button
          onClick={toggleTheme}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Toggle {theme === "light" ? "Dark" : "Light"} Mode
        </button> */}
      </header>

      {/* Main Content Section */}
      <div className="flex flex-col justify-center items-center flex-grow w-full">
        {gpa > 9 && <Confetti width={width} height={height} />}

        {subjects.map((subject, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-800 dark:text-gray-200">Credits</label>
              <input
                type="number"
                min="0"
                value={subject.credits}
                onChange={(e) => handleChange(index, "credits", e.target.value)}
                className="p-2 border rounded dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-800 dark:text-gray-200">Grade</label>
              <select
                value={subject.grade}
                onChange={(e) => handleChange(index, "grade", e.target.value)}
                className="p-2 border rounded dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="">Select Grade</option>
                {Object.keys(gradesMap).map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <button
          onClick={handleAddSubject}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Add Subject
        </button>

        <button
          onClick={calculateGPA}
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
          Calculate GPA
        </button>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-green-600 dark:text-green-400">
              GPA Result
            </h2>
            <p className="text-center text-gray-700 dark:text-gray-200 mb-4">
              Your GPA is <span className="font-bold">{gpa}</span>.
            </p>
            <p className="text-center text-blue-500 dark:text-blue-300 mb-4">
              {remark}
            </p>
            <div className="flex justify-center mb-6">
              <img src={gif} alt="Remark GIF" className="w-32 h-32 rounded" />
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
