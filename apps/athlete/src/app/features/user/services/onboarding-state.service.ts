import { Injectable, signal } from '@angular/core';

export interface OnboardingState {
  tellAboutUs?: {
    gender?: string;
    birthdate?: string;
    age?: string;
    weight?: string;
    height?: string;
  };
  selectGoals?: {
    goals?: any[];
  };
  selectLevel?: {
    activityLevel?: string;
  };
  profileSetup?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    nickName?: string;
    profilePictureUrl?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OnboardingStateService {
  private _onboardingState = signal<OnboardingState>({});

  constructor() {
    // Cargar datos del localStorage al inicializar
    this.loadFromStorage();
  }

  // Getters
  get onboardingState() {
    return this._onboardingState();
  }

  getTellAboutUsData() {
    return this._onboardingState().tellAboutUs || {};
  }

  getSelectGoalsData() {
    return this._onboardingState().selectGoals || {};
  }

  getSelectLevelData() {
    return this._onboardingState().selectLevel || {};
  }

  getProfileSetupData() {
    return this._onboardingState().profileSetup || {};
  }

  // Setters
  setTellAboutUsData(data: OnboardingState['tellAboutUs']) {
    this._onboardingState.update(state => ({
      ...state,
      tellAboutUs: { ...state.tellAboutUs, ...data }
    }));
    this.saveToStorage();
  }

  setSelectGoalsData(data: OnboardingState['selectGoals']) {
    this._onboardingState.update(state => ({
      ...state,
      selectGoals: { ...state.selectGoals, ...data }
    }));
    this.saveToStorage();
  }

  setSelectLevelData(data: OnboardingState['selectLevel']) {
    this._onboardingState.update(state => ({
      ...state,
      selectLevel: { ...state.selectLevel, ...data }
    }));
    this.saveToStorage();
  }

  setProfileSetupData(data: OnboardingState['profileSetup']) {
    this._onboardingState.update(state => ({
      ...state,
      profileSetup: { ...state.profileSetup, ...data }
    }));
    this.saveToStorage();
  }

  // Persistencia en localStorage
  private saveToStorage() {
    localStorage.setItem('athlete_onboarding_state', JSON.stringify(this._onboardingState()));
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('athlete_onboarding_state');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        this._onboardingState.set(parsedState);
      } catch (error) {
        console.error('Error loading onboarding state from storage:', error);
      }
    }
  }

  // Limpiar estado al completar onboarding
  clearOnboardingState() {
    this._onboardingState.set({});
    localStorage.removeItem('athlete_onboarding_state');
  }

  // Verificar si hay datos guardados para una sección
  hasDataForSection(section: keyof OnboardingState): boolean {
    const data = this._onboardingState()[section];
    return data !== undefined && Object.keys(data).length > 0;
  }
}