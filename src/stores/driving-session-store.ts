import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ───
export interface DrivingEventItem {
  id: string;
  sessionId: string;
  type: string;
  severity: 'smooth' | 'normal' | 'harsh' | 'dangerous';
  speed?: number;
  rpm?: number;
  timestamp: string;
  metadata?: string;
}

export interface SessionSummary {
  id: string;
  type: string;
  status: string;
  startTime: string;
  endTime?: string;
  duration: number;
  distance: number;
  score?: number;
  maxSpeed?: number;
  avgSpeed?: number;
  harshBrakes: number;
  harshAccel: number;
  harshTurns: number;
  speedViolations: number;
  fatigueEvents: number;
  distractionEvents: number;
  weather?: string;
  roadType?: string;
  vehicleId?: string;
  events?: DrivingEventItem[];
}

export interface VehicleItem {
  id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  fuelType: string;
  transmission: string;
  engineSize?: string;
  licensePlate?: string;
  color?: string;
  mileage: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type SessionStatus = 'idle' | 'active' | 'paused';
export type VehicleType = 'car' | 'motorcycle' | 'truck' | 'bus';
export type WeatherCondition = 'clear' | 'rain' | 'fog' | 'snow' | 'night' | 'storm';
export type RoadType = 'urban' | 'rural' | 'highway' | 'mountain';

interface DrivingSessionState {
  // Session
  currentSession: SessionSummary | null;
  sessions: SessionSummary[];
  sessionStatus: SessionStatus;
  selectedVehicleType: VehicleType;
  weather: WeatherCondition;
  roadType: RoadType;
  sessionDuration: number;
  sessionDistance: number;

  // Score
  drivingScore: number;

  // Events
  events: DrivingEventItem[];

  // Vehicles
  vehicles: VehicleItem[];
  selectedVehicleId: string | null;

  // Chat
  chatMessages: ChatMessage[];
  isChatLoading: boolean;

  // Filters (history)
  filterType: string;
  filterStatus: string;
  filterDateFrom: string;
  filterDateTo: string;

  // Actions
  setSessionStatus: (status: SessionStatus) => void;
  setCurrentSession: (session: SessionSummary | null) => void;
  setSessions: (sessions: SessionSummary[]) => void;
  addSession: (session: SessionSummary) => void;
  updateSession: (id: string, updates: Partial<SessionSummary>) => void;
  setSelectedVehicleType: (type: VehicleType) => void;
  setWeather: (weather: WeatherCondition) => void;
  setRoadType: (roadType: RoadType) => void;
  setSessionDuration: (duration: number) => void;
  setSessionDistance: (distance: number) => void;
  setDrivingScore: (score: number) => void;
  addEvent: (event: DrivingEventItem) => void;
  setEvents: (events: DrivingEventItem[]) => void;
  clearEvents: () => void;
  setVehicles: (vehicles: VehicleItem[]) => void;
  setSelectedVehicleId: (id: string | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  setIsChatLoading: (loading: boolean) => void;
  setFilterType: (type: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterDateFrom: (date: string) => void;
  setFilterDateTo: (date: string) => void;
  resetSession: () => void;
}

const initialState = {
  currentSession: null,
  sessions: [] as SessionSummary[],
  sessionStatus: 'idle' as SessionStatus,
  selectedVehicleType: 'car' as VehicleType,
  weather: 'clear' as WeatherCondition,
  roadType: 'urban' as RoadType,
  sessionDuration: 0,
  sessionDistance: 0,
  drivingScore: 100,
  events: [] as DrivingEventItem[],
  vehicles: [] as VehicleItem[],
  selectedVehicleId: null as string | null,
  chatMessages: [] as ChatMessage[],
  isChatLoading: false,
  filterType: '',
  filterStatus: '',
  filterDateFrom: '',
  filterDateTo: '',
};

export const useDrivingSessionStore = create<DrivingSessionState>()(
  persist(
    (set) => ({
      ...initialState,

      setSessionStatus: (status) => set({ sessionStatus: status }),

      setCurrentSession: (session) => set({ currentSession: session }),

      setSessions: (sessions) => set({ sessions }),

      addSession: (session) =>
        set((state) => ({ sessions: [session, ...state.sessions] })),

      updateSession: (id, updates) =>
        set((state) => ({
          currentSession:
            state.currentSession?.id === id
              ? { ...state.currentSession, ...updates }
              : state.currentSession,
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      setSelectedVehicleType: (type) => set({ selectedVehicleType: type }),

      setWeather: (weather) => set({ weather }),

      setRoadType: (roadType) => set({ roadType }),

      setSessionDuration: (duration) => set({ sessionDuration: duration }),

      setSessionDistance: (distance) => set({ sessionDistance: distance }),

      setDrivingScore: (score) => set({ drivingScore: score }),

      addEvent: (event) =>
        set((state) => {
          const newEvents = [event, ...state.events].slice(0, 100);
          // Deduct points based on severity
          const penalty =
            event.severity === 'dangerous'
              ? 5
              : event.severity === 'harsh'
                ? 2
                : event.severity === 'normal'
                  ? 0
                  : 0.5;
          const newScore = Math.max(0, state.drivingScore - penalty);
          return { events: newEvents, drivingScore: Math.round(newScore * 10) / 10 };
        }),

      setEvents: (events) => set({ events }),

      clearEvents: () => set({ events: [] }),

      setVehicles: (vehicles) => set({ vehicles }),

      setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),

      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message],
        })),

      setChatMessages: (messages) => set({ chatMessages: messages }),

      setIsChatLoading: (loading) => set({ isChatLoading: loading }),

      setFilterType: (type) => set({ filterType: type }),
      setFilterStatus: (status) => set({ filterStatus: status }),
      setFilterDateFrom: (date) => set({ filterDateFrom: date }),
      setFilterDateTo: (date) => set({ filterDateTo: date }),

      resetSession: () =>
        set({
          currentSession: null,
          sessionStatus: 'idle',
          sessionDuration: 0,
          sessionDistance: 0,
          drivingScore: 100,
          events: [],
          chatMessages: [],
        }),
    }),
    {
      name: 'adso-driving-session-store',
      partialize: (state) => ({
        selectedVehicleType: state.selectedVehicleType,
        weather: state.weather,
        roadType: state.roadType,
        selectedVehicleId: state.selectedVehicleId,
      }),
    }
  )
);
