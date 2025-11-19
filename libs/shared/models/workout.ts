import { TrainingTypeEnum } from '../constants/types-routines';

export const convertToPayload = (data: any) => {
  if (data.workoutTypeId === TrainingTypeEnum.DOCUMENT) {
    return payloadToDocumentForm(data);
  }

  if (data.workoutTypeId === TrainingTypeEnum.RECORDED_CLASSES) {
    return payloadToRecordedClassForm(data);
  }

  return {
    creatorId: data.creatorId,
    title: data.title,
    description: data.description,
    workoutUrl: data.workoutUrl,
    levelIds: data.difficulty.map((level: any) => level.levelId),
    locationTypeIds: data.location.map((loc: any) => loc.locationTypeId),
    categoryIds: data.category.map((cat: any) => cat.categoryId),
    tagIds: data.target.map((tag: any) => tag.tagId),
    toolIds: data.equipment.map((tool: any) => tool.toolId),
    workoutTypeId: data.workoutTypeId,
    workerStatusId: 1,
    assets: data.exercises.map((exercise: any) => ({
      assetUrl: exercise.url || '',
      name: exercise.name,
      description: exercise.description,
      s3Key: exercise.s3Key,
    })),
    idempotencyKey: data.idempotencyKey,
  };
};

export const payloadToRecordedClassForm = (data: any) => {
  return {
    creatorId: data.creatorId,
    title: data.title,
    description: data.description,
    workoutUrl: data.workoutUrl,
    levelIds: data.difficulty.map((level: any) => level.levelId),
    locationTypeIds: data.location.map((loc: any) => loc.locationTypeId),
    categoryIds: data.category.map((cat: any) => cat.categoryId),
    tagIds: data.target.map((tag: any) => tag.tagId),
    toolIds: data.equipment.map((tool: any) => tool.toolId),
    workoutTypeId: data.workoutTypeId,
    workerStatusId: 1,
    assets: [
      {
        assetUrl: data.urlVideo,
        name: data.titleVideo,
        description: '',
      },
    ],
    idempotencyKey: data.idempotencyKey,
  };
};

export const payloadToDocumentForm = (data: any) => {
  return {
    creatorId: data.creatorId,
    title: data.title,
    description: data.description,
    workoutUrl: data.workoutUrl,
    tagIds: [1, 35, 37],
    workoutTypeId: data.workoutTypeId,
    workerStatusId: 1,
    assets: data.exercises.map((exercise: any) => ({
      assetUrl: exercise.url || '',
      name: exercise.name,
      description: exercise.description,
    })),
    idempotencyKey: data.idempotencyKey,
  };
};
