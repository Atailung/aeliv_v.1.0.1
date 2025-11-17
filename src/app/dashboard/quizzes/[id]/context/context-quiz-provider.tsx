"use client";

import { createContext, ReactNode, useContext } from "react";

interface QuizContentType {
    // Define the shape of your quiz context here
}

const QuizContext = createContext<QuizContentType | null>(null);

export const QuizProvider = ({children}: {children: ReactNode}) => {
    const value = {};
    return (
        <QuizContext.Provider value={value}>
            {children}
        </QuizContext.Provider>
    );
}

export const useQuiz = () => {
    const context =useContext(QuizContext);
    if (!context) {
        throw new Error("useQuiz must be used within a QuizProvider");
    }
    return context;
}