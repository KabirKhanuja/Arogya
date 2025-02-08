import React from 'react';
import { SafeAreaView } from 'react-native';
import StepTracker from './pedo-app/app/StepTracker';  // Import the StepTracker component

const App = () => {
  return (
    <SafeAreaView>
      <StepTracker />  {/* Render the StepTracker component */}
    </SafeAreaView>
  );
};

export default App;
