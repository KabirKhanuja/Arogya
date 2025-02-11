export interface Roadmap {
    description: string;
    goals: string[];
    total_duration_weeks: number;
    phases: Phase[];
}

export interface Phase {
    phase_number: number;
    phase_name: string;
    duration_weeks: number;
    weekly_schedule: WeeklySchedule[];
}

export interface WeeklySchedule {
    day: string;
    sessions: Session[];
}

export interface Session {
    time_slot: string;
    exercises: Exercise[];
}

export interface Exercise {
    name: string;
    slug: string;
    category: string;
    purpose: string;
    duration: number;
    sets: number;
    reps: number;
    hold_duration?: number;
    rest_between_sets: number;
    frequency_per_day: number;
    frequency_per_week: number;
    precautions: string[];
}

export interface RoadmapResponse {
    message: string;
    roadmap: Roadmap;
}