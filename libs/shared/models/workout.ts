export const convertToPayload = (data: any) => {
  return {
    creatorId: data.creatorId,
    title: data.title,
    description: data.description,
    workoutUrl: data.workoutUrl,
    levelIds: data.difficulty,
    locationTypeIds: data.location,
    categoryIds: data.category,
    workoutTypeId: 1,
    workerStatusId: 1,
    tagIds: data.target,
    toolIds: data.equipment,
    assets: data.exercises.map((exercise: any) => ({
      assetUrl: exercise.videoUrl || '',
      name: exercise.name,
      description: exercise.description,
    })),
  };
};
