import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

// Theme colors
const THEME = {
  primary: '#3498db',
  secondary: '#2ecc71',
  accent: '#f39c12',
  background: '#f9f9f9',
  card: '#ffffff',
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
    light: '#bdc3c7',
    white: '#ffffff',
  },
  border: '#ecf0f1',
  shadow: {
    color: '#000',
    opacity: 0.1,
  }
};

function ExerciseRoadmap({ data, roadmapProgress }) {
  const navigation = useNavigation();
  const [expandedPhase, setExpandedPhase] = useState(0);
  const [expandedDay, setExpandedDay] = useState(null);

  // Helper function to safely get array or return empty array
  const safeArray = (arr) => Array.isArray(arr) ? arr : [];

  // Helper function to safely get string or return empty string
  const safeString = (str) => str || '';
  const normalText = (str) => {
    return str
      .replace(/_/g, ' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
  // Get category icon
  const getCategoryIcon = (category = '') => {
    const catLower = category.toLowerCase();

    if (catLower.includes('strength')) return 'dumbbell';
    if (catLower.includes('cardio')) return 'running';
    if (catLower.includes('yoga') || catLower.includes('flexibility')) return 'yoga';
    if (catLower.includes('balance')) return 'level';
    if (catLower.includes('mobility')) return 'walking';
    if (catLower.includes('stretching')) return 'child';
    if (catLower.includes('rehab')) return 'medkit';
    return 'fitness-center'; // Default icon
  };

  const renderExercise = (exercise = {}) => {
    const categoryIcon = 'running';//getCategoryIcon(exercise?.category);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Countdown", {
          exerciseName: exercise?.name || "Exercise"
        })}
        key={exercise?.slug || Math.random().toString()}
        style={styles.exerciseCardContainer}
      >
        <View style={styles.exerciseCard}>
          <View style={styles.exerciseHeaderRow}>
            <View style={styles.exerciseNameContainer}>
              <FontAwesome5 name={categoryIcon} size={18} color={THEME.primary} style={styles.categoryIcon} />
              <Text style={styles.exerciseName}>{normalText(safeString(exercise?.name))}</Text>
            </View>
            <View style={styles.startButton}>
              <Ionicons name="play-circle" size={24} color={THEME.secondary} />
            </View>
          </View>

          {exercise?.category && (
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{exercise.category}</Text>
            </View>
          )}

          {exercise?.purpose && (
            <Text style={styles.exercisePurpose}>{exercise.purpose}</Text>
          )}

          <View style={styles.exerciseDetails}>
            {exercise?.duration !== undefined && (
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color={THEME.primary} style={styles.detailIcon} />
                <Text style={styles.detailLabel}>Duration:</Text>
                <Text style={styles.detailValue}>{exercise.duration} min</Text>
              </View>
            )}
            {exercise?.sets !== undefined && (
              <View style={styles.detailItem}>
                <FontAwesome5 name="layer-group" size={14} color={THEME.primary} style={styles.detailIcon} />
                <Text style={styles.detailLabel}>Sets:</Text>
                <Text style={styles.detailValue}>{exercise.sets}</Text>
              </View>
            )}
            {exercise?.reps !== undefined && (
              <View style={styles.detailItem}>
                <FontAwesome5 name="redo" size={14} color={THEME.primary} style={styles.detailIcon} />
                <Text style={styles.detailLabel}>Reps:</Text>
                <Text style={styles.detailValue}>{exercise.reps}</Text>
              </View>
            )}
            {exercise?.hold_duration && (
              <View style={styles.detailItem}>
                <Ionicons name="hourglass-outline" size={16} color={THEME.primary} style={styles.detailIcon} />
                <Text style={styles.detailLabel}>Hold:</Text>
                <Text style={styles.detailValue}>{exercise.hold_duration}</Text>
              </View>
            )}
          </View>

          {safeArray(exercise?.precautions).length > 0 && (
            <View style={styles.precautionsContainer}>
              <View style={styles.precautionsTitleRow}>
                <Ionicons name="warning-outline" size={16} color={THEME.accent} />
                <Text style={styles.precautionsTitle}>Precautions:</Text>
              </View>
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
  };

  const renderDay = (day = {}, phaseIndex) => {
    // Get day icon
    const getDayIcon = (day) => {
      const dayLower = day?.toLowerCase() || '';

      if (dayLower.includes('monday')) return 'calendar-day-1';
      if (dayLower.includes('tuesday')) return 'calendar-day-2';
      if (dayLower.includes('wednesday')) return 'calendar-day-3';
      if (dayLower.includes('thursday')) return 'calendar-day-4';
      if (dayLower.includes('friday')) return 'calendar-day-5';
      if (dayLower.includes('saturday')) return 'calendar-day-6';
      if (dayLower.includes('sunday')) return 'calendar-day-7';
      if (dayLower.includes('rest')) return 'home';
      return 'event';
    };

    const dayIcon = getDayIcon(day?.day);
    const isExpanded = expandedDay === day?.day;
    const isCompleted = phaseIndex == 2;

    return (
      <View key={day?.day || Math.random().toString()} style={styles.dayContainer}>
        <TouchableOpacity
          style={[styles.dayHeader, isExpanded && styles.dayHeaderActive]}
          onPress={() => setExpandedDay(isExpanded ? null : day?.day)}
        >
          <View style={styles.dayTitleContainer}>
            <MaterialIcons name={isCompleted ? 'check' : 'calendar-today'} size={20} color={isExpanded ? THEME.text.white : THEME.primary} style={styles.dayIcon} />
            <Text style={[styles.dayTitle, isExpanded && styles.dayTitleActive]}>
              {safeString(day?.day[0].toUpperCase() + day?.day?.substring(1))}
            </Text>
          </View>
          <MaterialIcons
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color={isExpanded ? THEME.text.white : THEME.text.secondary}
          />
        </TouchableOpacity>

        {isExpanded && safeArray(day?.sessions).map((session, sessionIndex) => (
          <View key={sessionIndex} style={styles.sessionContainer}>
            {session?.time_slot && (
              <View style={styles.timeSlotContainer}>
                <Ionicons name="time-outline" size={16} color={THEME.primary} />
                <Text style={styles.timeSlot}>{session.time_slot[0].toUpperCase() + session.time_slot.substring(1)}</Text>
              </View>
            )}
            {safeArray(session?.exercises).map(renderExercise)}
          </View>
        ))}
      </View>
    );
  };

  const renderPhase = (phase = {}, index) => {
    const isExpanded = expandedPhase === index;

    return (
      <View key={phase?.phase_number || index} style={styles.phaseContainer}>
        <TouchableOpacity
          style={[styles.phaseHeader, isExpanded && styles.phaseHeaderActive]}
          onPress={() => setExpandedPhase(isExpanded ? null : index)}
        >
          <View style={styles.phaseTitleSection}>
            <View style={{ ...styles.phaseNumberBadge, backgroundColor: isExpanded ? 'white' : 'rgba(52, 152, 219, 0.15)' }}>
              <Text style={styles.phaseNumberText}>{phase?.phase_number || index + 1}</Text>
            </View>
            <View>
              <Text style={[styles.phaseTitle, isExpanded && styles.phaseTitleActive]}>
                {safeString(phase?.phase_name)}
              </Text>
              {phase?.duration_weeks !== undefined && (
                <View style={styles.phaseDurationRow}>
                  <Ionicons name="calendar-outline" size={14} color={isExpanded ? THEME.text.white : THEME.text.secondary} />
                  <Text style={[styles.phaseDuration, isExpanded && styles.phaseDurationActive]}>
                    {phase.duration_weeks} weeks
                  </Text>
                </View>
              )}
            </View>
          </View>
          <MaterialIcons
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={28}
            color={isExpanded ? THEME.text.white : THEME.text.secondary}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.phaseContent}>
            {safeArray(phase?.weekly_schedule).map((day) => renderDay(day, index))}
          </View>
        )}
      </View>
    );
  };

  if (!data?.roadmap) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Ionicons name="fitness-outline" size={80} color={THEME.text.light} />
          <Text style={styles.emptyStateTitle}>No Roadmap Available</Text>
          <Text style={styles.emptyStateMessage}>Your exercise roadmap data is not available yet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Ionicons name="map-outline" size={24} color={THEME.primary} />
            <Text style={styles.headerTitle}>Your Fitness Journey</Text>
          </View>
          <Text style={styles.title}>{safeString(data?.roadmap?.description)}</Text>

          {safeArray(data?.roadmap?.goals).length > 0 && (
            <View style={styles.goalsContainer}>
              <View style={styles.goalsTitleRow}>
                <Ionicons name="trophy-outline" size={18} color={THEME.primary} />
                <Text style={styles.goalsTitle}>Your Goals:</Text>
              </View>
              {safeArray(data?.roadmap?.goals).map((goal, index) => (
                <View key={index} style={styles.goalItemRow}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={THEME.secondary} style={styles.goalIcon} />
                  <Text style={styles.goalItem}>{safeString(goal)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        <View style={{marginTop: 28, marginBottom: 18, marginHorizontal: 18}}>
          <Text style={[styles.progressLabel]}>
            Overall Roadmap Progress ({roadmapProgress}%)
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${roadmapProgress}%` }]}>
            </View>
          </View>
        </View>


        <View style={styles.phasesContainer}>
          <Text style={styles.sectionTitle}>Exercise Phases</Text>
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
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    padding: 20,
    backgroundColor: THEME.card,
    borderRadius: 12,
    margin: 16,
    elevation: 3,
    shadowColor: THEME.shadow.color,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: THEME.shadow.opacity,
    shadowRadius: 6,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.primary,
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    color: THEME.text.primary,
    marginBottom: 16,
    lineHeight: 22,
  },
  goalsContainer: {
    marginTop: 12,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  goalsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
    marginLeft: 6,
  },
  goalItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  goalIcon: {
    marginTop: 2,
    marginRight: 6,
  },
  goalItem: {
    fontSize: 14,
    color: THEME.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.text.primary,
    marginBottom: 16,
    marginLeft: 16,
  },
  phasesContainer: {
    paddingHorizontal: 16,
  },
  phaseContainer: {
    backgroundColor: THEME.card,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: THEME.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: THEME.shadow.opacity,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  phaseHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phaseHeaderActive: {
    backgroundColor: THEME.primary,
  },
  phaseTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(52, 152, 219, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  phaseNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.primary,
  },
  phaseNumberTextSelected: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.text.primary,
  },
  phaseTitleActive: {
    color: THEME.text.white,
  },
  phaseDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  phaseDuration: {
    fontSize: 14,
    color: THEME.text.secondary,
    marginLeft: 4,
  },
  phaseDurationActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  phaseContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  dayContainer: {
    marginBottom: 16,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderRadius: 8,
  },
  dayHeaderActive: {
    backgroundColor: THEME.primary,
  },
  dayTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayIcon: {
    marginRight: 8,
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  dayTitleActive: {
    color: THEME.text.white,
  },
  sessionContainer: {
    marginTop: 12,
    paddingLeft: 12,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeSlot: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME.text.secondary,
    marginLeft: 6,
  },
  exerciseCardContainer: {
    marginBottom: 12,
  },
  exerciseCard: {
    backgroundColor: THEME.card,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.border,
    elevation: 1,
    shadowColor: THEME.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: THEME.shadow.opacity,
    shadowRadius: 2,
  },
  exerciseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    marginRight: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.text.primary,
    flex: 1,
  },
  startButton: {
    padding: 4,
  },
  categoryTag: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: '500',
  },
  exercisePurpose: {
    fontSize: 14,
    color: THEME.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
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
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: THEME.text.secondary,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 13,
    color: THEME.text.primary,
    fontWeight: '500',
  },
  precautionsContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    padding: 10,
    borderRadius: 6,
  },
  precautionsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  precautionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text.primary,
    marginLeft: 6,
  },
  precautionItem: {
    fontSize: 13,
    color: THEME.text.secondary,
    marginLeft: 8,
    marginBottom: 4,
    lineHeight: 18,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
  },
  progressLabel: {
    color: "#9E7A47",
    fontSize: 16,
    marginBottom: 19,
    textAlign: 'center',
  },
  progressBarContainer: {
    backgroundColor: "#F5F0E5",
    borderRadius: 4,
    marginBottom: 29,
    marginHorizontal: 16,
    height: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#F99E16",
    borderRadius: 4,
  },
});

export default ExerciseRoadmap;