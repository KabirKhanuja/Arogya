import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

function ExerciseRoadmapV0({ data }) {
  const navigation = useNavigation();
  const [expandedPhase, setExpandedPhase] = useState(0);
  const [expandedDay, setExpandedDay] = useState(null);

  // Helper function to safely get array or return empty array
  const safeArray = (arr) => Array.isArray(arr) ? arr : [];

  // Helper function to safely get string or return empty string
  const safeString = (str) => str || '';

  const renderExercise = (exercise = {}) => (
    <TouchableOpacity onPress={() => navigation.navigate("Countdown", {
      exerciseName: exercise?.name || "Exercise"
    })}
      key={exercise?.slug || Math.random().toString()}
    >
      <View key={exercise?.slug || Math.random().toString()} style={styles.exerciseCard}>
        <Text style={styles.exerciseName}>{safeString(exercise?.name)}</Text>
        {exercise?.category && (
          <Text style={styles.exerciseCategory}>Category: {exercise.category}</Text>
        )}
        {exercise?.purpose && (
          <Text style={styles.exercisePurpose}>{exercise.purpose}</Text>
        )}

        <View style={styles.exerciseDetails}>
          {exercise?.duration !== undefined && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Duration:</Text>
              <Text style={styles.detailValue}>{exercise.duration} min</Text>
            </View>
          )}
          {exercise?.sets !== undefined && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Sets:</Text>
              <Text style={styles.detailValue}>{exercise.sets}</Text>
            </View>
          )}
          {exercise?.reps !== undefined && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Reps:</Text>
              <Text style={styles.detailValue}>{exercise.reps}</Text>
            </View>
          )}
          {exercise?.hold_duration && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Hold:</Text>
              <Text style={styles.detailValue}>{exercise.hold_duration}</Text>
            </View>
          )}
        </View>

        {safeArray(exercise?.precautions).length > 0 && (
          <View style={styles.precautionsContainer}>
            <Text style={styles.precautionsTitle}>Precautions:</Text>
            {safeArray(exercise?.precautions).map((precaution, index) => (
              <Text key={index} style={styles.precautionItem}>
                • {safeString(precaution)}
              </Text>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderDay = (day = {}, phaseIndex) => (
    <View key={day?.day || Math.random().toString()} style={styles.dayContainer}>
      <TouchableOpacity
        style={styles.dayHeader}
        onPress={() => setExpandedDay(expandedDay === day?.day ? null : day?.day)}
      >
        <Text style={styles.dayTitle}>{safeString(day?.day[0].toUpperCase() + day?.day?.substring(1))}</Text>
        <Text style={styles.expandIcon}>
          {expandedDay === day?.day ? '−' : '+'}
        </Text>
      </TouchableOpacity>

      {expandedDay === day?.day && safeArray(day?.sessions).map((session, sessionIndex) => (
        <View key={sessionIndex} style={styles.sessionContainer}>
          {session?.time_slot && (
            <Text style={styles.timeSlot}>{session.time_slot}</Text>
          )}
          {safeArray(session?.exercises).map(renderExercise)}
        </View>
      ))}
    </View>
  );

  const renderPhase = (phase = {}, index) => (
    <View key={phase?.phase_number || index} style={styles.phaseContainer}>
      <TouchableOpacity
        style={styles.phaseHeader}
        onPress={() => setExpandedPhase(expandedPhase === index ? null : index)}
      >
        <View>
          <Text style={styles.phaseTitle}>
            {phase?.phase_number ? `Phase ${phase.phase_number}: ` : ''}{safeString(phase?.phase_name)}
          </Text>
          {phase?.duration_weeks !== undefined && (
            <Text style={styles.phaseDuration}>
              Duration: {phase.duration_weeks} weeks
            </Text>
          )}
        </View>
        <Text style={styles.expandIcon}>
          {expandedPhase === index ? '−' : '+'}
        </Text>
      </TouchableOpacity>

      {expandedPhase === index && (
        <View style={styles.phaseContent}>
          {safeArray(phase?.weekly_schedule).map((day) => renderDay(day, index))}
        </View>
      )}
    </View>
  );

  // Handle case where data or data.roadmap is undefined
  if (!data?.roadmap) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>No roadmap data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{safeString(data?.roadmap?.description)}</Text>
          {safeArray(data?.roadmap?.goals).length > 0 && (
            <View style={styles.goalsContainer}>
              <Text style={styles.goalsTitle}>Goals:</Text>
              {safeArray(data?.roadmap?.goals).map((goal, index) => (
                <Text key={index} style={styles.goalItem}>
                  • {safeString(goal)}
                </Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.phasesContainer}>
          {safeArray(data?.roadmap?.phases).map(renderPhase)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  goalsContainer: {
    marginTop: 8,
  },
  goalsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  goalItem: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginBottom: 4,
  },
  phasesContainer: {
    padding: 16,
  },
  phaseContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  phaseHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  phaseDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  expandIcon: {
    fontSize: 24,
    color: '#666',
  },
  phaseContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  dayContainer: {
    marginBottom: 16,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
  sessionContainer: {
    marginTop: 12,
    paddingLeft: 12,
  },
  timeSlot: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  exercisePurpose: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 4,
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  precautionsContainer: {
    marginTop: 8,
  },
  precautionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  precautionItem: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    marginBottom: 2,
  },
});

export default ExerciseRoadmapV0;