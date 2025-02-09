import React, { createContext, useState } from 'react';

export const ScoreContext = createContext();

export function ScoreProvider({ children }) {
    const [totalScore, setTotalScore] = useState(0);

    return (
        <ScoreContext.Provider value={{ totalScore, setTotalScore }}>
            {children}
        </ScoreContext.Provider>
    );
}
