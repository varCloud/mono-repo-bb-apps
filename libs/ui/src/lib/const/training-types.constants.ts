import { TrainingType } from '../components/training-type-selection/training-type-selection.component';

export const TRAINING_TYPES: TrainingType[] = [
  {
    id: 'recorded-classes',
    title: 'Clases grabadas',
    description: 'Recomendado para clases uno a uno',
    icon: 'assets/icons/workouts/clase_grabada.svg',
  },
  {
    id: 'routines',
    title: 'Rutinas',
    description:
      'Crea una rutina y sube videos cortos que ayuden a tus clientes a entender el entrenamiento',
    icon: 'assets/icons/workouts/rutinas.svg',
  },
  {
    id: 'document',
    title: 'Documento',
    description:
      'Comparte lo que desees con tus clientes y dale más valor a tu perfil',
    icon: 'assets/icons/workouts/documento.svg',
  },
];

export enum TrainingTypeEnum {
  RECORDED_CLASSES = 'recorded-classes',
  ROUTINES = 'routines',
  DOCUMENT = 'document',
}
