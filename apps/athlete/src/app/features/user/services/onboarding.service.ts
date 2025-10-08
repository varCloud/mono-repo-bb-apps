import { Injectable, signal } from '@angular/core';

export interface OnboardingData {
  // Tell About Us
  gender?: string;
  birthdate?: string;
  age?: number;
  weight?: string;
  height?: string;
  
  // Select Goals
  goals?: string[];
  
  // Select Level
  activityLevel?: string;
  
  // Profile Setup
  firstName?: string;
  lastName?: string;
  nickName?: string;
  phone?: string;
  isoCode?: string;
  profileColor?: string;
  profilePictureUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  
  // Estado del onboarding usando signals
  private onboardingData = signal<OnboardingData>({});
  
  // Getter reactivo para acceder a los datos
  get data() {
    return this.onboardingData.asReadonly();
  }

  // Métodos para guardar datos de cada paso
  
  saveTellAboutUs(data: { gender: string; birthdate: string; age: number; weight: string; height: string; }): void {
    this.onboardingData.update(current => ({
      ...current,
      gender: data.gender,
      birthdate: data.birthdate,
      age: data.age,
      weight: data.weight,
      height: data.height
    }));
    this.saveToLocalStorage();
  }

  saveGoals(goals: string[]): void {
    this.onboardingData.update(current => ({
      ...current,
      goals
    }));
    this.saveToLocalStorage();
  }

  saveActivityLevel(activityLevel: string): void {
    this.onboardingData.update(current => ({
      ...current,
      activityLevel
    }));
    this.saveToLocalStorage();
  }

  saveProfileSetup(data: {
    firstName: string;
    lastName: string;
    nickName: string;
    phone: string;
    isoCode: string;
    profileColor: string;
    profilePictureUrl?: string;
  }): void {
    this.onboardingData.update(current => ({
      ...current,
      ...data
    }));
    this.saveToLocalStorage();
  }

  // Método para obtener todos los datos del onboarding
  getAllData(): OnboardingData {
    return this.onboardingData();
  }

  // Método para limpiar los datos
  clearData(): void {
    this.onboardingData.set({});
    this.clearLocalStorage();
  }

  // Verificar si el onboarding está completo
  isComplete(): boolean {
    const data = this.onboardingData();
    return !!(
      data.gender &&
      data.birthdate &&
      data.goals?.length &&
      data.activityLevel &&
      data.firstName &&
      data.lastName
    );
  }

  // Obtener el siguiente paso pendiente
  getNextStep(): string {
    const data = this.onboardingData();
    
    if (!data.gender || !data.birthdate) {
      return '/onboarding/tell-about-us';
    }
    
    if (!data.goals?.length) {
      return '/onboarding/select-goals';
    }
    
    if (!data.activityLevel) {
      return '/onboarding/select-level';
    }
    
    if (!data.firstName || !data.lastName) {
      return '/onboarding/profile-setup';
    }
    
    return '/home'; // Onboarding completo
  }

  // Persistencia en localStorage
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('athlete_onboarding_data', JSON.stringify(this.onboardingData()));
    } catch (error) {
      console.error('Error saving onboarding data to localStorage:', error);
    }
  }

  // Cargar datos del localStorage
  loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem('athlete_onboarding_data');
      if (stored) {
        this.onboardingData.set(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading onboarding data from localStorage:', error);
    }
  }

  // Limpiar localStorage
  private clearLocalStorage(): void {
    try {
      localStorage.removeItem('athlete_onboarding_data');
    } catch (error) {
      console.error('Error clearing onboarding data from localStorage:', error);
    }
  }

  // Método para enviar datos finales al backend
  async completeOnboarding(): Promise<any> {
    const data = this.getAllData();
    
    if (!this.isComplete()) {
      throw new Error('Onboarding data is incomplete');
    }

    try {
      // Aquí harías la llamada al backend para crear/actualizar el usuario
      // const response = await this.http.post('/api/athlete/complete-onboarding', data).toPromise();
      
      // Por ahora simulamos la respuesta
      console.log('Completing onboarding with data:', data);
      
      // Limpiar datos después de enviar
      this.clearData();
      
      return { success: true, data };
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }
}